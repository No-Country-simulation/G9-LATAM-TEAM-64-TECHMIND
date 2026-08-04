package com.techmind.backend.controller;

import com.techmind.backend.dto.ContenidoResponseDTO;
import com.techmind.backend.repository.ContenidoRepository;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/contenidos")
@RestController
public class ContenidoController {

    private ContenidoRepository contenidoRepository;
    @GetMapping
    public ResponseEntity<List<ContenidoResponseDTO>> getAllContents() {
        List<ContenidoResponseDTO> contents = contenidoRepository.getAllContents();
        return ResponseEntity.ok(contents);
    }

}