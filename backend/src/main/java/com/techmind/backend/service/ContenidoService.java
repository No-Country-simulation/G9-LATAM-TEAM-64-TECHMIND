package com.techmind.backend.service;

import com.techmind.backend.dto.ContenidoRequestDTO;
import com.techmind.backend.dto.ContenidoResponseDTO;
import com.techmind.backend.dto.MlResponseDTO;
import com.techmind.backend.model.Contenido;
import com.techmind.backend.repository.ContenidoRepository;
import com.techmind.backend.service.client.MlServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContenidoService {

    private static final Logger log = LoggerFactory.getLogger(ContenidoService.class);

    private final ContenidoRepository repository;
    private final MlServiceClient mlClient;
    private final DocumentExtractionService extractionService;

    public ContenidoService(ContenidoRepository repository, MlServiceClient mlClient, DocumentExtractionService extractionService) {
        this.repository = repository;
        this.mlClient = mlClient;
        this.extractionService = extractionService;
    }

    // Sin @Transactional, por lo mismo que processAndSave: extraer el texto con
    // Tika y clasificarlo son operaciones lentas que no deben retener una
    // conexión de la base de datos.
    public ContenidoResponseDTO processAndSaveFromFile(org.springframework.web.multipart.MultipartFile file) throws java.io.IOException, org.apache.tika.exception.TikaException, org.xml.sax.SAXException {
        ContenidoRequestDTO request = extractionService.extractContent(file);
        return processAndSave(request);
    }

    public ContenidoResponseDTO processFileAndSave(MultipartFile file) {
        try {
            String contentType = file.getContentType();
            String textoExtraido;

            // Para el MVP, solo procesamos archivos de texto explícitos.
            // Los archivos binarios como PDF/Word requieren Apache Tika, que añadiremos más adelante.
            if (contentType != null && (contentType.startsWith("text/") || contentType.equals("application/json"))) {
                textoExtraido = new String(file.getBytes(), StandardCharsets.UTF_8);
            } else {
                textoExtraido = "Archivo (" + file.getOriginalFilename() + ") subido. Extracción de texto pendiente de implementación (requiere Tika).";
            }

            ContenidoRequestDTO request = new ContenidoRequestDTO(file.getOriginalFilename(), textoExtraido);
            return processAndSave(request);
        } catch (IOException e) {
            throw new RuntimeException("Error al procesar el archivo", e);
        }
    }

    /** Clasifica y guarda.
     *
     *  Deliberadamente SIN @Transactional: la llamada al ml-service es una
     *  petición HTTP que puede tardar segundos, y dentro de una transacción
     *  mantendría ocupada una conexión de Postgres todo ese rato. Con el pool
     *  por defecto (10 conexiones), diez peticiones lentas dejan seca la base
     *  para todo lo demás: hasta un simple listado se queda en cola.
     *
     *  Así, la conexión solo se toma en `repository.save()`, que ya abre su
     *  propia transacción. */
    public ContenidoResponseDTO processAndSave(ContenidoRequestDTO request) {
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

        // 3. Save to DB
        Contenido saved = repository.save(contenido);
        long tDb = System.currentTimeMillis();
        log.info("[3/3] Guardado id={} en {} ms. Total: {} ms",
                saved.getId(), tDb - tMl, tDb - t0);

        // 4. Map Entity to ResponseDTO
        return new ContenidoResponseDTO(
                saved.getId(),
                saved.getTitulo(),
                saved.getTexto(),
                saved.getCategoria(),
                saved.getEtiquetas(),
                saved.getConfianza(),
                saved.getProbabilidad(),
                saved.getPalabrasClave(),
                saved.getTemasRelacionados(),
                saved.getResumenCorto(),
                saved.isRequiereRevision(),
                saved.getFechaRegistro()
        );
    }

    /** Solo lectura, y en una única transacción: así las colecciones perezosas
     *  se cargan con la sesión abierta en vez de depender de que el filtro
     *  open-in-view la mantenga viva hasta el final de la petición. */
    @Transactional(readOnly = true)
    public List<ContenidoResponseDTO> findAll() {
        return repository.findAll().stream()
                .map(c -> new ContenidoResponseDTO(
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
                        c.getFechaRegistro()
                ))
                .collect(Collectors.toList());
    }
}
