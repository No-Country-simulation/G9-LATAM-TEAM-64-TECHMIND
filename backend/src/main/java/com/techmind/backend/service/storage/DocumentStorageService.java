package com.techmind.backend.service.storage;

import com.oracle.bmc.Region;
import com.oracle.bmc.auth.SimpleAuthenticationDetailsProvider;
import com.oracle.bmc.objectstorage.ObjectStorageClient;
import com.oracle.bmc.objectstorage.model.CreatePreauthenticatedRequestDetails;
import com.oracle.bmc.objectstorage.requests.CreatePreauthenticatedRequestRequest;
import com.oracle.bmc.objectstorage.requests.PutObjectRequest;
import com.oracle.bmc.objectstorage.responses.CreatePreauthenticatedRequestResponse;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Locale;
import java.util.UUID;

/** Guarda los documentos originales en OCI Object Storage.
 *
 *  El servicio es OPCIONAL a propósito. Si faltan credenciales, arranca
 *  desactivado y `subir` devuelve null: el análisis del documento sigue
 *  funcionando igual, simplemente no queda copia descargable. Así el backend
 *  se puede desplegar antes de tener configurado OCI. */
@Service
public class DocumentStorageService {

    private static final Logger log = LoggerFactory.getLogger(DocumentStorageService.class);

    /** Cuánto vive el enlace de descarga. Corto: se genera uno nuevo en cada clic. */
    private static final Duration VIGENCIA_ENLACE = Duration.ofMinutes(15);

    /** Prefijo dentro del bucket. Mantiene los documentos separados del modelo. */
    private static final String PREFIJO = "documentos/";

    private final String tenancy;
    private final String usuario;
    private final String huella;
    private final String region;
    private final String clavePrivada;
    private final String clavePrivadaRuta;
    private final String namespace;
    private final String bucket;

    private ObjectStorageClient cliente;

    public DocumentStorageService(
            @Value("${OCI_TENANCY_OCID:}") String tenancy,
            @Value("${OCI_USER_OCID:}") String usuario,
            @Value("${OCI_FINGERPRINT:}") String huella,
            @Value("${OCI_REGION:}") String region,
            @Value("${OCI_PRIVATE_KEY:}") String clavePrivada,
            // Alternativa para desarrollo local: un archivo .env no puede
            // contener un PEM, porque se lee línea a línea.
            @Value("${OCI_PRIVATE_KEY_PATH:}") String clavePrivadaRuta,
            @Value("${OCI_NAMESPACE:}") String namespace,
            @Value("${OCI_BUCKET:}") String bucket
    ) {
        this.tenancy = tenancy;
        this.usuario = usuario;
        this.huella = huella;
        this.region = region;
        this.clavePrivada = clavePrivada;
        this.clavePrivadaRuta = clavePrivadaRuta;
        this.namespace = namespace;
        this.bucket = bucket;
    }

    @PostConstruct
    void iniciar() {
        if (!hayCredenciales()) {
            log.warn("OCI Object Storage sin configurar: los documentos no se guardarán. "
                    + "Faltan variables: {}", variablesQueFaltan());
            return;
        }

        try {
            String pem = resolverClavePrivada();

            SimpleAuthenticationDetailsProvider credenciales = SimpleAuthenticationDetailsProvider.builder()
                    .tenantId(tenancy)
                    .userId(usuario)
                    .fingerprint(huella)
                    .region(Region.fromRegionId(region))
                    .privateKeySupplier(() -> new ByteArrayInputStream(pem.getBytes(StandardCharsets.UTF_8)))
                    .build();

            cliente = ObjectStorageClient.builder()
                    .region(Region.fromRegionId(region))
                    .build(credenciales);

            log.info("OCI Object Storage listo — bucket '{}' en {}", bucket, region);

        } catch (Exception e) {
            // Un fallo aquí no debe impedir que arranque la aplicación: el resto
            // del backend funciona perfectamente sin almacenamiento de archivos.
            cliente = null;
            log.error("No se pudo inicializar OCI Object Storage. Los documentos no se guardarán.", e);
        }
    }

    @PreDestroy
    void cerrar() {
        if (cliente != null) cliente.close();
    }

    public boolean estaActivo() {
        return cliente != null;
    }

    /** Sube el documento y devuelve su clave dentro del bucket, o null si el
     *  almacenamiento no está activo o la subida falla.
     *
     *  Nunca lanza: perder la copia del archivo es un contratiempo, no una razón
     *  para tumbar un análisis que por lo demás salió bien. */
    public String subir(MultipartFile archivo) {
        if (!estaActivo()) return null;

        String clave = PREFIJO + UUID.randomUUID() + extension(archivo.getOriginalFilename());
        long inicio = System.currentTimeMillis();

        try {
            byte[] contenido = archivo.getBytes();

            cliente.putObject(PutObjectRequest.builder()
                    .namespaceName(namespace)
                    .bucketName(bucket)
                    .objectName(clave)
                    .contentLength((long) contenido.length)
                    .contentType(archivo.getContentType())
                    .putObjectBody(new ByteArrayInputStream(contenido))
                    .build());

            log.info("Documento guardado en '{}' ({} KB, {} ms)",
                    clave, contenido.length / 1024, System.currentTimeMillis() - inicio);
            return clave;

        } catch (IOException | RuntimeException e) {
            log.error("No se pudo guardar '{}' en el bucket", archivo.getOriginalFilename(), e);
            return null;
        }
    }

    /** Genera un enlace de descarga temporal para un objeto del bucket.
     *
     *  Se crea uno nuevo en cada petición y caduca a los 15 minutos, así que el
     *  enlace no sirve de nada si alguien lo reenvía más tarde. */
    public String enlaceDescarga(String clave, String nombreVisible) {
        if (!estaActivo()) {
            throw new AlmacenamientoNoConfiguradoException(
                    "El almacenamiento de documentos no está configurado en este servidor");
        }

        CreatePreauthenticatedRequestDetails detalles = CreatePreauthenticatedRequestDetails.builder()
                .name("descarga-" + UUID.randomUUID())
                .objectName(clave)
                .accessType(CreatePreauthenticatedRequestDetails.AccessType.ObjectRead)
                .timeExpires(Date.from(Instant.now().plus(VIGENCIA_ENLACE)))
                .build();

        CreatePreauthenticatedRequestResponse respuesta = cliente.createPreauthenticatedRequest(
                CreatePreauthenticatedRequestRequest.builder()
                        .namespaceName(namespace)
                        .bucketName(bucket)
                        .createPreauthenticatedRequestDetails(detalles)
                        .build());

        // accessUri es una ruta relativa: hay que anteponerle el endpoint.
        String ruta = respuesta.getPreauthenticatedRequest().getAccessUri();
        String url = endpointBase() + (ruta.startsWith("/") ? ruta : "/" + ruta);

        log.info("Enlace temporal generado para '{}' ({}) -> {}", nombreVisible, clave, url);
        return url;
    }

    /** URL base de Object Storage para la región configurada.
     *
     *  No se usa `cliente.getEndpoint()`: en esta versión del SDK devuelve la
     *  plantilla sin resolver del todo —algo como
     *  `objectstorage.sa-bogota-1.{dualstack.`— y el navegador no puede abrir eso.
     *
     *  El dominio de segundo nivel sale del realm de la región, no está fijo:
     *  `oraclecloud.com` para el realm comercial, pero otros realms usan otro. */
    private String endpointBase() {
        Region r = Region.fromRegionId(region);

        String dominio;
        try {
            dominio = r.getRealm().getSecondLevelDomain();
        } catch (RuntimeException e) {
            dominio = "oraclecloud.com";
            log.warn("No se pudo deducir el dominio del realm de '{}'; se usa {}", region, dominio);
        }

        return "https://objectstorage." + r.getRegionId() + "." + dominio;
    }

    /** Obtiene el PEM, venga de donde venga.
     *
     *  Tres formatos aceptados, en orden de preferencia:
     *
     *  1. `OCI_PRIVATE_KEY_PATH` — ruta a un `.pem`. Lo natural en local, donde
     *     un archivo `.env` no puede contener saltos de línea.
     *  2. `OCI_PRIVATE_KEY` con el PEM tal cual, con sus saltos. Es lo que
     *     admite el editor de variables de Northflank.
     *  3. `OCI_PRIVATE_KEY` con los saltos escritos como `\n` literales, o el
     *     PEM entero en base64. Son los apaños habituales cuando la plataforma
     *     de despliegue no deja pegar varias líneas. */
    private String resolverClavePrivada() throws IOException {
        if (!clavePrivadaRuta.isBlank()) {
            Path ruta = Path.of(clavePrivadaRuta.replaceFirst("^~", System.getProperty("user.home")));
            log.info("Leyendo la clave privada de {}", ruta);
            return validarPem(Files.readString(ruta), "el archivo " + ruta);
        }

        String texto = clavePrivada.trim();

        // Saltos escapados: "-----BEGIN...\nMIIE..." en una sola línea.
        if (!texto.contains("\n") && texto.contains("\\n")) {
            texto = texto.replace("\\n", "\n");
        }

        // PEM completo codificado en base64.
        if (!texto.startsWith("-----BEGIN")) {
            try {
                String decodificado = new String(
                        Base64.getDecoder().decode(texto.replaceAll("\\s", "")), StandardCharsets.UTF_8);
                if (decodificado.startsWith("-----BEGIN")) {
                    log.info("Clave privada recibida en base64");
                    texto = decodificado;
                }
            } catch (IllegalArgumentException ignorado) {
                // No era base64. El validador de abajo dará el mensaje útil.
            }
        }

        return validarPem(texto, "la variable OCI_PRIVATE_KEY");
    }

    private String validarPem(String texto, String origen) {
        String limpio = texto.trim();

        if (!limpio.startsWith("-----BEGIN")) {
            throw new IllegalArgumentException(
                    "La clave privada de " + origen + " no empieza por '-----BEGIN'. "
                            + "Empieza por: '" + limpio.substring(0, Math.min(30, limpio.length())) + "...'");
        }

        if (limpio.lines().count() < 3) {
            throw new IllegalArgumentException(
                    "La clave privada de " + origen + " tiene una sola línea. Un PEM ocupa varias. "
                            + "Si la pusiste en un archivo .env, usa OCI_PRIVATE_KEY_PATH con la ruta al .pem: "
                            + "los .env se leen línea a línea y truncan el valor.");
        }

        return limpio;
    }

    private boolean hayCredenciales() {
        return variablesQueFaltan().isEmpty();
    }

    private String variablesQueFaltan() {
        StringBuilder faltan = new StringBuilder();
        if (tenancy.isBlank()) faltan.append("OCI_TENANCY_OCID ");
        if (usuario.isBlank()) faltan.append("OCI_USER_OCID ");
        if (huella.isBlank()) faltan.append("OCI_FINGERPRINT ");
        if (region.isBlank()) faltan.append("OCI_REGION ");
        if (clavePrivada.isBlank() && clavePrivadaRuta.isBlank()) faltan.append("OCI_PRIVATE_KEY|OCI_PRIVATE_KEY_PATH ");
        if (namespace.isBlank()) faltan.append("OCI_NAMESPACE ");
        if (bucket.isBlank()) faltan.append("OCI_BUCKET ");
        return faltan.toString().trim();
    }

    private String extension(String nombre) {
        if (nombre == null) return "";
        int punto = nombre.lastIndexOf('.');
        return punto < 0 ? "" : nombre.substring(punto).toLowerCase(Locale.ROOT);
    }
}
