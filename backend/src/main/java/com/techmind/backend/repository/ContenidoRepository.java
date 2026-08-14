package com.techmind.backend.repository;

import com.techmind.backend.model.Contenido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ContenidoRepository extends JpaRepository<Contenido, Long> {
    // Aquí podemos añadir métodos de consulta personalizados si fuera necesario.
}
