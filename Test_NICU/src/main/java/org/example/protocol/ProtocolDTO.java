package org.example.protocol;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * DTO voor het weergeven van belangrijke datumvelden van een protocol.
 *
 * @author Joost Goddijn
 * @version 1.0, 22-05-2025
 * @since 22-05-2025
 */
public class ProtocolDTO {

    /**
     * De naam van het centrum dat het protocol heeft ingediend.
     */
    @Getter
    @Setter
    private String naamCentrum;

    /**
     * De naam van het protocol.
     */
    @Getter
    @Setter
    private String naamProtocol;

    /**
     * De datum waarop het protocol is aangevraagd.
     */
    @Getter
    @Setter
    private LocalDate datumAanvraag;

    /**
     * De datum waarop de eerste versie van het protocol is opgesteld.
     */
    @Getter
    @Setter
    private LocalDate datumEerste;

    /**
     * De datum waarop het protocol is geaccordeerd.
     */
    @Getter
    @Setter
    private LocalDate datumAccordering;

    /**
     * De constructor om alle velden van het prtocol in te stellen.
     * @param naamCentrum naam van het centrum van indiening
     * @param naamProtocol naam van het protocol
     * @param datumAanvraag datum van de aanvraag
     * @param datumEerste datum van de eerste versie
     * @param datumAccordering datum van accordering
     */
    public ProtocolDTO(String naamCentrum, String naamProtocol, LocalDate datumAanvraag, LocalDate datumEerste, LocalDate datumAccordering) {
        this.naamCentrum = naamCentrum;
        this.naamProtocol = naamProtocol;
        this.datumAanvraag = datumAanvraag;
        this.datumEerste = datumEerste;
        this.datumAccordering = datumAccordering;
    }
}
