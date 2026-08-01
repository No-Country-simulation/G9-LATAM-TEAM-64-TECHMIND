package com.techmind.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static jdk.internal.org.jline.reader.impl.LineReaderImpl.CompletionType.List;

@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("/api/contenidos")
@RestController
public class ContenidoController {
    @GetMapping
    public String getAllContents() {
        return ResponseEntity<List<ContenidoResponseDTO>>;
    }

}