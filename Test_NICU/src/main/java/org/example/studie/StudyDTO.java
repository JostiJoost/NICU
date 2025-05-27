package org.example.studie;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * DTO voor het overdragen van studiegegevens.
 *
 * @author Anne Beumer en Joost Goddijn
 * @version 1.2, 21-05-2025
 * @since 20-05-2025
 */
public class StudyDTO {

    /**
     * Naam van het centrum.
     */
    @Getter
    @Setter
    private String centrum;

    /**
     * Naam van de studie.
     */
    @Getter
    @Setter
    private String studie;

    /**
     * Startdatum van de studie
     */
    @Getter
    @Setter
    private LocalDate startdatum;

    /**
     * Startdatum juridische fase
     */
    @Getter
    @Setter
    private LocalDate startJuridisch;

    /**
     * Einddatum juridische fase
     */
    @Getter
    @Setter
    private LocalDate eindJuridisch;

    /**
     * Startdatum apotheek fase
     */
    @Getter
    @Setter
    private LocalDate startApotheek;

    /**
     * Einddatum apotheek fase
     */
    @Getter
    @Setter
    private LocalDate eindApotheek;

    /**
     * Startdatum METC fase
     */
    @Getter
    @Setter
    private LocalDate startMETC;

    /**
     * Einddatum METC fase
     */
    @Getter
    @Setter
    private LocalDate eindMETC;

    /**
     * Starttdatum laboratorium fase
     */
    @Getter
    @Setter
    private LocalDate startLab;

    /**
     * Einddatum laboratorium fase
     */
    @Getter
    @Setter
    private LocalDate eindLab;

    /**
     * Intitatiedatum van de studie
     */
    @Getter
    @Setter
    private LocalDate initiatiedatum;

    /**
     * Aant geïncludeerde kinderen voor deze studie in het aangegeven centrum
     */
    @Getter
    @Setter
    private Integer geincludeerde_kinderen;

    /**
     * Datum waarop de inclusie plaatsvond
     */
    @Getter
    @Setter
    private LocalDate inclusie_datum;

    /**
     * Aantal opgenomen kinderen
     */
    @Getter
    @Setter
    private Integer opgenomen_kinderen;

    /**
     * Eventuele reden voor weigering van deelname
     */
    @Getter
    @Setter
    private String reden_weigering;

    /**
     * Lege constructor voor Spring
     */
    public StudyDTO(){}

    /**
     * Constructor voor gedeeltelijke initaialisatie
     *
     * @param centrum het centrum
     * @param studie de studie
     * @param startdatum de startdatum van de studie
     * @param startJuridisch de startdatum van de juridsiche fase
     * @param eindJuridisch de einddatum van de juridische fase
     * @param startApotheek de startdatum van de apotheek fase
     * @param eindApotheek de einddatum van de apotheek fase
     * @param startMETC de startdatum van de METC fase
     * @param eindMETC de einddatum van de METC fase
     * @param startLab de startdatum van de lab fase
     * @param eindLab de einddatum van de lab fase
     * @param initiatiedatum de intiatie datum
     */
    public StudyDTO(String centrum, String studie, LocalDate startdatum,
                    LocalDate startJuridisch, LocalDate eindJuridisch, LocalDate startApotheek,
                    LocalDate eindApotheek, LocalDate startMETC, LocalDate eindMETC,
                    LocalDate startLab, LocalDate eindLab, LocalDate initiatiedatum) {
        this.centrum = centrum;
        this.studie = studie;
        this.startdatum = startdatum;
        this.startJuridisch = startJuridisch;
        this.eindJuridisch = eindJuridisch;
        this.startApotheek = startApotheek;
        this.eindApotheek = eindApotheek;
        this.startMETC = startMETC;
        this.eindMETC = eindMETC;
        this.startLab = startLab;
        this.eindLab = eindLab;
        this.initiatiedatum = initiatiedatum;
    }
}
