package com.techmind.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContenidoResponseDTO {
    private Long id;
    private String titulo;
    private String texto;
    private String categoria;
    private List<String> etiquetas;
    private LocalDateTime fechaRegistro;
}
