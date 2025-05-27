package org.example.studie;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 *Entiteit die een studie representeert binnen een specifiek centrum.
 *
 * @author Anne Beumer
 * @version 1.2, 15-05-2025
 * @since 09-05-2025
 */
@Entity
@IdClass(StudyId.class)
@Table(name = "studie")
public class Study {

    /**
     * Naam van de studie (samen met centrum de primaire sleutel)
     */
    @Id
    @Column(name = "naam_studie", length = 50)
    @Getter
    @Setter
    private String studie;

    /**
     * Naam van het centrum (deel van de primaire sleutel samen met studie)
     */
    @Id
    @Column(name = "naam_centrum", length = 50)
    @Getter
    @Setter
    private String centrum;

    /**
     * Startdatum van de studie in het centrum
     */
    @Column(name = "startdatum_studie")
    @Getter
    @Setter
    private LocalDate startdatum;

    /**
     * Datum waarop de studie geïnitieerd werd.
     */
    @Column(name = "initiatiedatum")
    @Getter
    @Setter
    private LocalDate initiatiedatum;

    /**
     * Startdatum juridische fase (als deze aanwezig is bij de studie)
     */
    @Column(name = "startdatum_juridisch")
    @Getter
    @Setter
    private LocalDate juridisch_start;

    /**
     * Einddatum juridische fase (als deze aanwezig is bij de studie)
     */
    @Column(name = "einddatum_juridisch")
    @Getter
    @Setter
    private LocalDate juridisch_eind;

    /**
     * Startdatum apotheek fase (als deze aanwezig is bij de studie)
     */
    @Column(name = "startdatum_apotheek")
    @Getter
    @Setter
    private LocalDate apotheek_start;

    /**
     * Einddatum apotheek fase (als deze aanwezig is bij de studie)
     */
    @Column(name = "einddatum_apotheek")
    @Getter
    @Setter
    private LocalDate apotheek_eind;

    /**
     * Startdatum METC fase (als deze aanwezig is bij de studie)
     */
    @Column(name = "startdatum_metc")
    @Getter
    @Setter
    private LocalDate metc_start;

    /**
     * Einddatum METC fase (als deze aanwezig is bij de studie)
     */
    @Column(name = "einddatum_metc")
    @Getter
    @Setter
    private LocalDate metc_eind;

    /**
     * Startdatum laboratorium fase (als deze aanwezig is bij de studie)
     */
    @Column(name = "startdatum_laboratorium")
    @Getter
    @Setter
    private LocalDate lab_start;

    /**
     * Einddatum laboratorium fase (als deze aanwezig is bij de studie)
     */
    @Column(name = "einddatum_laboratorium")
    @Getter
    @Setter
    private LocalDate lab_eind;

    /**
     * Aantal kinderen dat geïncludeerd is in deze studie binnen dit centrum.
     */
    @Column(name = "geincludeerde_kinderen")
    @Getter
    @Setter
    private Integer geincludeerde_kinderen;

    /**
     * Aantal kinderen dat opgenomen is binne het centrum.
     */
    @Column(name = "opgenomen_kinderen")
    @Getter
    @Setter
    private Integer opgenomen_kinderen;

    /**
     * Eventuele reden voor weigering van deelname in dit centrum.
     */
    @Column(name = "reden_van_weigeren")
    @Getter
    @Setter
    private String reden_weigering;

    /**
     * Lege constructor.
     * Vereist door de JPA.
     */
    public Study(){}

}
