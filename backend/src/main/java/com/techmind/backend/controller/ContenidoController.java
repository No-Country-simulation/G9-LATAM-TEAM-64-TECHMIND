package com.techmind.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/contenidos")
@RestController
public class ContenidoController {
    @GetMapping
    public String getAllContenidos() {
        return "Obteniendo todos los contenidos con una lista de contenidos";
    }

}