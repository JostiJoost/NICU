package org.example.protocol;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="tegenlezers")
@IdClass(TegenlezerId.class)
public class Tegenlezer {

    @Id
    @Getter
    @Setter
    @Column(name="naam_protocol")
    private String naamProtocol;

    @Id
    @Getter
    @Setter
    @Column(name="naam_tegenlezer")
    private String naamTegenlezer;

    @Getter
    @Setter
    @Column(name="naam_centrum")
    private String naamCentrum;

    @Getter
    @Setter
    @Column(name="functie_tegenlezer")
    private String functieTegenlezer;

}
