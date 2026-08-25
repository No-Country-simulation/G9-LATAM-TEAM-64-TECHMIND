package com.techmind.backend.service.storage;

/** El backend arrancó sin credenciales de OCI y se le pidió algo que las
 *  necesita. Es un problema de configuración del servidor, no de la petición:
 *  el manejador global lo traduce a un 503. */
public class AlmacenamientoNoConfiguradoException extends RuntimeException {
    public AlmacenamientoNoConfiguradoException(String mensaje) {
        super(mensaje);
    }
}
