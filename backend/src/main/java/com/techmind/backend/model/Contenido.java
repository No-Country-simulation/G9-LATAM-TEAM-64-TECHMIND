package com.techmind.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "contenidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contenido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    private String categoria;

    // @BatchSize evita el problema N+1 al listar. Sin él, cada una de estas
    // tres colecciones provoca una consulta por fila: 20 contenidos son 61
    // viajes a la base de datos. Con él, Hibernate las pide de 50 en 50 y el
    // listado entero baja a 4 consultas.
    @ElementCollection
    @BatchSize(size = 50)
    private List<String> etiquetas;

    private String confianza;
    private Double probabilidad;

    @ElementCollection
    @BatchSize(size = 50)
    private List<String> palabrasClave;

    @ElementCollection
    @BatchSize(size = 50)
    private List<String> temasRelacionados;

    @Column(columnDefinition = "TEXT")
    private String resumenCorto;

    private boolean requiereRevision;

    @Column(nullable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
    }
}
