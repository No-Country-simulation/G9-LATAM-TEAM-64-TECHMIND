package com.techmind.backend.repository;

import com.techmind.backend.model.Contenido;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class ContenidoRepositoryTest {

    @Autowired
    private ContenidoRepository contenidoRepository;

    @Test
    public void shouldSaveAndFindContenido() {
        // Arrange
        Contenido contenido = new Contenido();
        contenido.setTitulo("Test Titulo");
        contenido.setTexto("Test Texto");
        contenido.setCategoria("Backend");
        contenido.setEtiquetas(Arrays.asList("Java", "Test"));
        contenido.setFechaRegistro(LocalDateTime.now());

        // Act
        Contenido savedContenido = contenidoRepository.save(contenido);
        Contenido foundContenido = contenidoRepository.findById(savedContenido.getId()).orElse(null);

        // Assert
        assertThat(foundContenido).isNotNull();
        assertThat(foundContenido.getTitulo()).isEqualTo("Test Titulo");
    }
}
