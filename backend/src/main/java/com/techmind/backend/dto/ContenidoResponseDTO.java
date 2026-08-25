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
    private String confianza;
    private Double probabilidad;
    private List<String> palabrasClave;
    private List<String> temasRelacionados;
    private String resumenCorto;
    private boolean requiereRevision;
    private LocalDateTime fechaRegistro;

    /** Nombre original del documento, o null si el contenido se pegó como texto.
     *  El frontend lo usa para decidir si muestra el botón de descarga. */
    private String archivoNombre;
    private String archivoTipo;
    private Long archivoTamano;

    /** true solo si el original está realmente en el bucket. El nombre puede
     *  existir sin que haya archivo: cuando se subió con el almacenamiento
     *  desactivado, se guarda el nombre pero no la copia. */
    private boolean archivoDisponible;
}
