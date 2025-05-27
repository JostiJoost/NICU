package org.example.protocol;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Entiteit klasse die een protocol vertegenwoordigt in de database.
 * De class is gekoppeld aan de databse tabel protocol.
 * De velden worden automatisch voorzien van getters en setters via Lombok.
 *
 * @author Anne Beumer
 * @version 1.3, 22-05-2025
 * @since 14-05-2025
 */
@Entity
@Table(name= "protocol")
public class Protocol {

    /**
     * Unieke waarde in de tabel van het protocol.
     */
    @Id
    @Getter
    @Setter
    @Column(name = "naam_protocol")
    private String naamProtocol;

    /**
     * De naam van het centrum dat het protocol indient (ook unieke waarde, dit wordt in studyId gedefinieerd)
     */
    @Getter
    @Setter
    @Column(name = "naam_centrum")
    private String naamCentrum;

    /**
     * De datum waarop het protocol is aangevraagd.
     */
    @Getter
    @Setter
    @Column(name = "datum_aanvraag")
    private LocalDate datumAanvraag;

    /**
     * Naam van de primaire penvoerder (hoofdverantwoordelijke van het protocol).
     */
    @Getter
    @Setter
    @Column(name = "primaire_penvoerder")
    private String primairePenvoerder;

    /**
     * Functie van de primaire penvoerder.
     */
    @Getter
    @Setter
    @Column(name = "functie_primaire_penvoerder")
    private String functiePrimairePenvoerder;

    /**
     * Datum waarop de eerste versie van het protocol is opgesteld.
     */
    @Getter
    @Setter
    @Column(name = "datum_eerste_versie")
    private LocalDate datumEersteVersie;

    /**
     * Datum waarop het protocol is geaccordeerd.
     */
    @Getter
    @Setter
    @Column(name = "datum_accordering")
    private LocalDate datumAccordering;


}
