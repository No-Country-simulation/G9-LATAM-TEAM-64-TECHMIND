package com.techmind.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/** Deja rastro de toda petición que entra y de cuánto tardó en salir.
 *
 *  Es lo primero que hay que mirar cuando "no llega respuesta": si aquí no
 *  aparece la línea de entrada, la petición murió antes del backend (proxy,
 *  CORS, red). Si aparece la de entrada pero nunca la de salida, se quedó
 *  colgada dentro. */
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        long inicio = System.currentTimeMillis();
        String metodoYRuta = request.getMethod() + " " + request.getRequestURI();

        log.info("--> {}", metodoYRuta);

        try {
            chain.doFilter(request, response);
        } finally {
            long ms = System.currentTimeMillis() - inicio;
            log.info("<-- {} {} ({} ms)", metodoYRuta, response.getStatus(), ms);
        }
    }
}
