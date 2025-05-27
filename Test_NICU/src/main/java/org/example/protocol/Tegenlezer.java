package org.example.protocol;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entiteit die een tegenlezer vertegenwoordgt in de database.
 * Waarbij elke tegenlezer gekoppeld is aan één of meer protocollen.
 * Maakt gebruik van Lombok Getters en Setters.
 *
 * @author Anne Beumer
 * @version 1.2, 15-05-2025
 * @since 14-05-2025
 */
@Entity
@Table(name="tegenlezers")
@IdClass(TegenlezerId.class)
public class Tegenlezer {

    /**
     * De naam van het prtocol waaraan de tegenlezer is gekoppeld
     * Vormt samen met naamTegenlezer de primaire sleutel.
     */
    @Id
    @Getter
    @Setter
    @Column(name="naam_protocol")
    private String naamProtocol;

    /**
     * De naam van de tegenlezer (degene die controle uitvoert op het protocol)
     * Vormt samen met naamProtocol de primaire sleutel
     */
    @Id
    @Getter
    @Setter
    @Column(name="naam_tegenlezer")
    private String naamTegenlezer;

    /**
     * Het centrum waaraan de tegenlezer verbonden is.
     */
    @Getter
    @Setter
    @Column(name="naam_centrum")
    private String naamCentrum;

    /**
     * De functie van de tegenlezer binnen het centrum/de studie.
     */
    @Getter
    @Setter
    @Column(name="functie_tegenlezer")
    private String functieTegenlezer;

}
