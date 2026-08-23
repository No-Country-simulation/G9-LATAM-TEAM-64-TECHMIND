package com.techmind.backend.service.client;

import com.techmind.backend.dto.ContenidoRequestDTO;
import com.techmind.backend.dto.MlResponseDTO;
import io.netty.channel.ChannelOption;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Service
public class MlServiceClient {

    private static final Logger log = LoggerFactory.getLogger(MlServiceClient.class);

    /** Cuánto esperamos al clasificador antes de rendirnos. Sin este límite, un
     *  ml-service caído o inalcanzable deja la petición colgada para siempre:
     *  los hilos del servidor se van acumulando hasta que el proceso muere. */
    private static final Duration TIMEOUT = Duration.ofSeconds(20);

    private final WebClient webClient;
    private final String mlServiceUrl;

    public MlServiceClient(
            WebClient.Builder webClientBuilder,
            // El puerto por defecto es el 8000, que es donde escucha uvicorn.
            @Value("${ML_SERVICE_URL:http://127.0.0.1:8000}") String mlServiceUrl
    ) {
        this.mlServiceUrl = mlServiceUrl;

        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5_000)
                .responseTimeout(TIMEOUT);

        this.webClient = webClientBuilder
                .baseUrl(mlServiceUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    /** Se imprime una vez al arrancar. Si `ML_SERVICE_URL` no llegó al
     *  contenedor, aquí se ve el valor por defecto y se acabó el misterio. */
    @PostConstruct
    void mostrarConfiguracion() {
        log.info("========================================");
        log.info("ML_SERVICE_URL efectiva: {}", mlServiceUrl);
        log.info("Timeout de respuesta: {} s", TIMEOUT.toSeconds());
        log.info("========================================");

        if (!mlServiceUrl.startsWith("http://") && !mlServiceUrl.startsWith("https://")) {
            log.error("La URL del ml-service NO empieza por http:// ni https://. "
                    + "Las peticiones van a fallar. Valor recibido: '{}'", mlServiceUrl);
        }
    }

    public MlResponseDTO processContent(ContenidoRequestDTO request) {
        long inicio = System.currentTimeMillis();
        log.info("[ML] POST {}/predict — titulo='{}', texto={} caracteres",
                mlServiceUrl, request.getTitulo(),
                request.getTexto() == null ? 0 : request.getTexto().length());

        try {
            MlResponseDTO respuesta = webClient.post()
                    .uri("/predict")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(MlResponseDTO.class)
                    // El segundo límite cubre el caso de que la conexión se abra
                    // pero el cuerpo de la respuesta nunca termine de llegar.
                    .block(TIMEOUT.plusSeconds(5));

            long ms = System.currentTimeMillis() - inicio;

            if (respuesta == null) {
                log.error("[ML] Respuesta vacía tras {} ms", ms);
                throw new IllegalStateException("El ml-service devolvió un cuerpo vacío");
            }

            log.info("[ML] OK en {} ms — categoria='{}', probabilidad={}",
                    ms, respuesta.getCategoria(), respuesta.getProbabilidad());
            return respuesta;

        } catch (WebClientRequestException e) {
            // No se pudo ni establecer la conexión: DNS, puerto cerrado, URL mal.
            log.error("[ML] No se pudo conectar con '{}' tras {} ms — {}",
                    mlServiceUrl, System.currentTimeMillis() - inicio, e.getMessage());
            throw e;

        } catch (WebClientResponseException e) {
            // Conectó, pero el ml-service devolvió un error. Su cuerpo suele
            // explicar exactamente qué campo rechazó Pydantic.
            log.error("[ML] Respondió {} tras {} ms — cuerpo: {}",
                    e.getStatusCode(), System.currentTimeMillis() - inicio,
                    e.getResponseBodyAsString());
            throw e;

        } catch (Exception e) {
            log.error("[ML] Falló tras {} ms — {}: {}",
                    System.currentTimeMillis() - inicio,
                    e.getClass().getSimpleName(), e.getMessage());
            throw e;
        }
    }
}
