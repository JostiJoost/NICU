package org.example.protocol;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO voor het opslaan van een protocol samen met een tegenlezer
 *
 * @author Anne Beumer
 * @version 1.2, 15-05-2025
 * @since 14-05-2025
 */
public class ProtocolRequest {

    /**
     * Protocol object dat moet worden opgeslagen.
     */
    @Getter
    @Setter
    private Protocol protocol;

    /**
     * De gekoppelde tegenlezer aan het protocol.
     */
    @Getter
    @Setter
    private Tegenlezer tegenlezer;


}
