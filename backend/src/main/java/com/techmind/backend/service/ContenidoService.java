package com.techmind.backend.service;

import com.techmind.backend.dto.ContenidoRequestDTO;
import com.techmind.backend.dto.ContenidoResponseDTO;
import com.techmind.backend.dto.MlResponseDTO;
import com.techmind.backend.model.Contenido;
import com.techmind.backend.repository.ContenidoRepository;
import com.techmind.backend.service.client.MlServiceClient;
import com.techmind.backend.service.storage.DocumentStorageService;
import org.apache.tika.exception.TikaException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContenidoService {

    private static final Logger log = LoggerFactory.getLogger(ContenidoService.class);

    private final ContenidoRepository repository;
    private final MlServiceClient mlClient;
    private final DocumentExtractionService extractionService;
    private final DocumentStorageService storageService;

    public ContenidoService(
            ContenidoRepository repository,
            MlServiceClient mlClient,
            DocumentExtractionService extractionService,
            DocumentStorageService storageService
    ) {
        this.repository = repository;
        this.mlClient = mlClient;
        this.extractionService = extractionService;
        this.storageService = storageService;
    }

    /** Datos del documento original. Todo nulo cuando el contenido se pegó como
     *  texto, y `clave` nula cuando OCI no estaba configurado al subirlo. */
    public record ArchivoInfo(String nombre, String tipo, Long tamano, String clave) {}

    /** Extrae el texto del documento con Tika, guarda el original en el bucket
     *  y lo clasifica.
     *
     *  Sin @Transactional, por lo mismo que processAndSave: extraer, subir y
     *  clasificar son operaciones lentas que no deben retener una conexión.
     *
     *  @param tituloFormulario el que escribió el usuario. Si viene vacío o
     *                          nulo, se conserva el que dedujo Tika de los
     *                          metadatos del documento o de su nombre. */
    public ContenidoResponseDTO processAndSaveFromFile(MultipartFile file, String tituloFormulario) {
        ContenidoRequestDTO request;

        try {
            request = extractionService.extractContent(file);
        } catch (IOException | TikaException | SAXException e) {
            log.error("No se pudo extraer el texto de '{}'", file.getOriginalFilename(), e);
            throw new RuntimeException(
                    "No se pudo leer el documento '" + file.getOriginalFilename() + "'. "
                            + "Comprueba que sea un TXT, PDF o DOCX válido.", e);
        }

        // El título del formulario manda sobre el del archivo.
        if (tituloFormulario != null && !tituloFormulario.isBlank()) {
            request.setTitulo(tituloFormulario.trim());
        }

        log.info("Documento '{}' — título: '{}', {} caracteres extraídos",
                file.getOriginalFilename(), request.getTitulo(),
                request.getTexto() == null ? 0 : request.getTexto().length());

        // Devuelve null si el almacenamiento no está activo; no es un error.
        String clave = storageService.subir(file);

        ArchivoInfo archivo = new ArchivoInfo(
                file.getOriginalFilename(), file.getContentType(), file.getSize(), clave);

        return processAndSave(request, archivo);
    }

    public ContenidoResponseDTO processAndSave(ContenidoRequestDTO request) {
        return processAndSave(request, null);
    }

    /** Clasifica y guarda.
     *
     *  Deliberadamente SIN @Transactional: la llamada al ml-service es una
     *  petición HTTP que puede tardar segundos, y dentro de una transacción
     *  mantendría ocupada una conexión de Postgres todo ese rato. Con el pool
     *  por defecto, unas pocas peticiones lentas dejan seca la base para todo
     *  lo demás: hasta un simple listado se queda en cola.
     *
     *  Así, la conexión solo se toma en `repository.save()`, que ya abre su
     *  propia transacción. */
    public ContenidoResponseDTO processAndSave(ContenidoRequestDTO request, ArchivoInfo archivo) {
        long t0 = System.currentTimeMillis();
        log.info("[1/3] Procesando '{}'", request.getTitulo());

        // 1. Llamar al ML Service — fuera de cualquier transacción.
        MlResponseDTO mlResponse = mlClient.processContent(request);
        long tMl = System.currentTimeMillis();
        log.info("[2/3] Clasificación lista en {} ms. Guardando en Postgres...", tMl - t0);

        // 2. Map ML response to Entity
        Contenido contenido = new Contenido();
        contenido.setTitulo(request.getTitulo());
        contenido.setTexto(request.getTexto());
        contenido.setCategoria(mlResponse.getCategoria());
        contenido.setEtiquetas(mlResponse.getPalabras_clave());
        contenido.setConfianza(mlResponse.getConfianza());
        contenido.setProbabilidad(mlResponse.getProbabilidad());
        contenido.setPalabrasClave(mlResponse.getPalabras_clave());
        contenido.setTemasRelacionados(mlResponse.getTemas_relacionados());
        contenido.setResumenCorto(mlResponse.getResumen_corto());
        contenido.setRequiereRevision(mlResponse.isRequiere_revision());

        if (archivo != null) {
            contenido.setArchivoNombre(archivo.nombre());
            contenido.setArchivoTipo(archivo.tipo());
            contenido.setArchivoTamano(archivo.tamano());
            contenido.setArchivoClave(archivo.clave());
        }

        // 3. Save to DB
        Contenido saved = repository.save(contenido);
        long tDb = System.currentTimeMillis();
        log.info("[3/3] Guardado id={} en {} ms. Total: {} ms",
                saved.getId(), tDb - tMl, tDb - t0);

        return toDto(saved);
    }

    /** Solo lectura, y en una única transacción: así las colecciones perezosas
     *  se cargan con la sesión abierta en vez de depender de que el filtro
     *  open-in-view la mantenga viva hasta el final de la petición. */
    @Transactional(readOnly = true)
    public List<ContenidoResponseDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Enlace temporal para descargar el documento original de un contenido. */
    @Transactional(readOnly = true)
    public String enlaceDescarga(Long id) {
        Contenido contenido = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No existe el contenido " + id));

        if (contenido.getArchivoClave() == null) {
            throw new IllegalArgumentException(
                    "El contenido " + id + " no tiene documento adjunto. "
                            + "Se creó pegando texto, o se subió antes de configurar el almacenamiento.");
        }

        return storageService.enlaceDescarga(contenido.getArchivoClave(), contenido.getArchivoNombre());
    }

    /** Un único sitio donde se traduce la entidad al DTO. Con doce campos y
     *  un constructor posicional, tenerlo duplicado es pedir que se desalineen. */
    private ContenidoResponseDTO toDto(Contenido c) {
        return new ContenidoResponseDTO(
                c.getId(),
                c.getTitulo(),
                c.getTexto(),
                c.getCategoria(),
                c.getEtiquetas(),
                c.getConfianza(),
                c.getProbabilidad(),
                c.getPalabrasClave(),
                c.getTemasRelacionados(),
                c.getResumenCorto(),
                c.isRequiereRevision(),
                c.getFechaRegistro(),
                c.getArchivoNombre(),
                c.getArchivoTipo(),
                c.getArchivoTamano(),
                c.getArchivoClave() != null
        );
    }
}
