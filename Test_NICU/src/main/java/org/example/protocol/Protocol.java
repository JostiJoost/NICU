package org.example.protocol;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name= "protocol")
public class Protocol {

    @Id
    @Getter
    @Setter
    @Column(name = "naam_protocol")
    private String naamProtocol;

    @Getter
    @Setter
    @Column(name = "naam_centrum")
    private String naamCentrum;

    @Getter
    @Setter
    @Column(name = "datum_aanvraag")
    private LocalDate datumAanvraag;

    @Getter
    @Setter
    @Column(name = "primaire_penvoerder")
    private String primairePenvoerder;

    @Getter
    @Setter
    @Column(name = "functie_primaire_penvoerder")
    private String functiePrimairePenvoerder;

    @Getter
    @Setter
    @Column(name = "datum_eerste_versie")
    private LocalDate datumEersteVersie;

    @Getter
    @Setter
    @Column(name = "datum_accordering")
    private LocalDate datumAccordering;


}
