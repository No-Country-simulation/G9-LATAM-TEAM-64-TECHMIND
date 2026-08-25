package com.techmind.backend.controller;

import com.techmind.backend.dto.ContenidoRequestDTO;
import com.techmind.backend.dto.ContenidoResponseDTO;
import com.techmind.backend.service.ContenidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;
import java.util.Map;

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

    /** Sube un documento (TXT, PDF o DOCX). Tika extrae el texto.
     *
     *  El `titulo` es opcional: si el formulario no lo manda, se usa el que
     *  se deduzca de los metadatos del documento o de su nombre de archivo. */
    @PostMapping("/archivo")
    public ResponseEntity<ContenidoResponseDTO> processFile(
            @RequestParam("archivo") org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "titulo", required = false) String titulo
    ) {
        return ResponseEntity.status(201).body(contenidoService.processAndSaveFromFile(file, titulo));
    }

    /** Devuelve un enlace temporal para descargar el documento original.
     *
     *  No transmite el archivo: responde un 302 hacia una URL firmada de OCI que
     *  caduca a los 15 minutos, así que los bytes van del bucket al navegador
     *  sin pasar por aquí. */
    @GetMapping("/{id}/archivo")
    public ResponseEntity<Void> descargarArchivo(@PathVariable Long id) {
        String url = contenidoService.enlaceDescarga(id);
        return ResponseEntity.status(302).location(URI.create(url)).build();
    }

    /** Igual que el anterior, pero devolviendo la URL en JSON en lugar de
     *  redirigir. Lo usa el frontend, que prefiere abrirla en una pestaña nueva
     *  a seguir una redirección con fetch. */
    @GetMapping("/{id}/archivo/enlace")
    public ResponseEntity<Map<String, String>> enlaceArchivo(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("url", contenidoService.enlaceDescarga(id)));
    }
}
