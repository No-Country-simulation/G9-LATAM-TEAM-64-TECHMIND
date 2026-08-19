package com.techmind.backend.service;

import com.techmind.backend.dto.ContenidoRequestDTO;
import com.techmind.backend.dto.ContenidoResponseDTO;
import com.techmind.backend.dto.MlResponseDTO;
import com.techmind.backend.model.Contenido;
import com.techmind.backend.repository.ContenidoRepository;
import com.techmind.backend.service.client.MlServiceClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContenidoService {

    private final ContenidoRepository repository;
    private final MlServiceClient mlClient;
    private final DocumentExtractionService extractionService;

    public ContenidoService(ContenidoRepository repository, MlServiceClient mlClient, DocumentExtractionService extractionService) {
        this.repository = repository;
        this.mlClient = mlClient;
        this.extractionService = extractionService;
    }

    @Transactional
    public ContenidoResponseDTO processAndSaveFromFile(org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        ContenidoRequestDTO request = extractionService.extractContent(file);
        return processAndSave(request);
    }

    @Transactional
    public ContenidoResponseDTO processAndSave(ContenidoRequestDTO request) {
        // 1. Call ML Service
        MlResponseDTO mlResponse = mlClient.processContent(request);

        // 2. Map ML response to Entity
        Contenido contenido = new Contenido();
        contenido.setTitulo(request.getTitulo());
        contenido.setTexto(request.getTexto());
        contenido.setCategoria(mlResponse.getCategoria());
        contenido.setEtiquetas(mlResponse.getPalabras_clave());
        contenido.setConfianza(mlResponse.getConfianza());
        contenido.setPalabrasClave(mlResponse.getPalabras_clave());
        contenido.setTemasRelacionados(mlResponse.getTemas_relacionados());
        contenido.setResumenCorto(mlResponse.getResumen_corto());
        contenido.setRequiereRevision(mlResponse.isRequiere_revision());

        // 3. Save to DB
        Contenido saved = repository.save(contenido);

        // 4. Map Entity to ResponseDTO
        return new ContenidoResponseDTO(
                saved.getId(),
                saved.getTitulo(),
                saved.getTexto(),
                saved.getCategoria(),
                saved.getEtiquetas(),
                saved.getConfianza(),
                saved.getPalabrasClave(),
                saved.getTemasRelacionados(),
                saved.getResumenCorto(),
                saved.isRequiereRevision(),
                saved.getFechaRegistro()
        );
    }

    public List<ContenidoResponseDTO> findAll() {
        return repository.findAll().stream()
                .map(c -> new ContenidoResponseDTO(
                        c.getId(),
                        c.getTitulo(),
                        c.getTexto(),
                        c.getCategoria(),
                        c.getEtiquetas(),
                        c.getConfianza(),
                        c.getPalabrasClave(),
                        c.getTemasRelacionados(),
                        c.getResumenCorto(),
                        c.isRequiereRevision(),
                        c.getFechaRegistro()
                ))
                .collect(Collectors.toList());
    }
}
