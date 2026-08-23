package com.techmind.backend.controller;

import com.techmind.backend.dto.ContenidoRequestDTO;
import com.techmind.backend.dto.ContenidoResponseDTO;
import com.techmind.backend.service.ContenidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contenidos")
// Para el MVP se permite cualquiera; conviene fijar la URL real al desplegar.
@CrossOrigin(origins = "*")
public class ContenidoController {

    private final ContenidoService contenidoService;

    public ContenidoController(ContenidoService contenidoService) {
        this.contenidoService = contenidoService;
    }

    @GetMapping
    public ResponseEntity<List<ContenidoResponseDTO>> getAllContents() {
        return ResponseEntity.ok(contenidoService.findAll());
    }

    @PostMapping("/procesar")
    public ResponseEntity<ContenidoResponseDTO> processContent(@RequestBody ContenidoRequestDTO request) {
        return ResponseEntity.status(201).body(contenidoService.processAndSave(request));
    }

    @PostMapping("/archivo")
    public ResponseEntity<ContenidoResponseDTO> processFile(@RequestParam("archivo") org.springframework.web.multipart.MultipartFile file) {
        return ResponseEntity.status(201).body(contenidoService.processFileAndSave(file));
    }
}
