package com.techmind.backend.config;

import com.techmind.backend.service.storage.AlmacenamientoNoConfiguradoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.LocalDateTime;
import java.util.Map;

/** Convierte las excepciones en JSON legible.
 *
 *  Sin esto, un fallo al llamar al ml-service llega al cliente como un 500 con
 *  una página de error genérica, y hay que ir a los logs para saber qué pasó.
 *  Con esto, la propia respuesta lo dice. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ResponseEntity<Map<String, Object>> respuesta(HttpStatus estado, String mensaje, String pista) {
        return ResponseEntity.status(estado).body(Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", estado.value(),
                "error", estado.getReasonPhrase(),
                "message", mensaje,
                "hint", pista
        ));
    }

    /** No se pudo abrir la conexión: DNS que no resuelve, puerto cerrado, o la
     *  URL sin `http://` delante. */
    @ExceptionHandler(WebClientRequestException.class)
    public ResponseEntity<Map<String, Object>> mlInalcanzable(WebClientRequestException e) {
        log.error("ml-service inalcanzable", e);
        return respuesta(
                HttpStatus.SERVICE_UNAVAILABLE,
                "No se pudo conectar con el servicio de clasificación: " + e.getMessage(),
                "Revisa ML_SERVICE_URL: debe incluir http:// o https:// y apuntar a un puerto abierto."
        );
    }

    /** Conectó, pero el ml-service devolvió un error. */
    @ExceptionHandler(WebClientResponseException.class)
    public ResponseEntity<Map<String, Object>> mlDevolvioError(WebClientResponseException e) {
        log.error("ml-service respondió {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
        return respuesta(
                HttpStatus.BAD_GATEWAY,
                "El servicio de clasificación respondió " + e.getStatusCode(),
                e.getResponseBodyAsString()
        );
    }

    /** El `.block(...)` agotó su plazo. */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> tiempoAgotado(IllegalStateException e) {
        log.error("Tiempo agotado esperando al ml-service", e);
        return respuesta(
                HttpStatus.GATEWAY_TIMEOUT,
                "El servicio de clasificación no respondió a tiempo: " + e.getMessage(),
                "El ml-service está vivo pero tarda demasiado, o la red entre ambos va mal."
        );
    }

    /** El contenido no existe, o no tiene documento adjunto. */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> noEncontrado(IllegalArgumentException e) {
        return respuesta(
                HttpStatus.NOT_FOUND,
                e.getMessage(),
                "Comprueba el id, o si ese contenido se creó pegando texto en lugar de subiendo un archivo."
        );
    }

    /** Se pidió una descarga pero el servidor no tiene credenciales de OCI. */
    @ExceptionHandler(AlmacenamientoNoConfiguradoException.class)
    public ResponseEntity<Map<String, Object>> sinAlmacenamiento(AlmacenamientoNoConfiguradoException e) {
        log.error("Petición de descarga sin almacenamiento configurado");
        return respuesta(
                HttpStatus.SERVICE_UNAVAILABLE,
                e.getMessage(),
                "Faltan las variables OCI_* en el servicio. Mira docs/oci-credenciales.md."
        );
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> archivoDemasiadoGrande(MaxUploadSizeExceededException e) {
        return respuesta(
                HttpStatus.PAYLOAD_TOO_LARGE,
                "El archivo supera el tamaño máximo permitido",
                "El límite actual es de 10 MB."
        );
    }

    /** Red de seguridad: cualquier otra cosa, con su traza completa en el log. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> cualquierOtra(Exception e) {
        log.error("Error no controlado", e);
        return respuesta(
                HttpStatus.INTERNAL_SERVER_ERROR,
                e.getClass().getSimpleName() + ": " + e.getMessage(),
                "Mira los logs del backend para la traza completa."
        );
    }
}
