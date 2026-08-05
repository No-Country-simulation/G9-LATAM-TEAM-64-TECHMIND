package com.techmind.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MlResponseDTO {
    private String categoria;
    private double probabilidad;
    private List<String> palabras_clave;
    private List<String> temas_relacionados;
    private String resumen_corto;
    private boolean requiere_revision;
}
