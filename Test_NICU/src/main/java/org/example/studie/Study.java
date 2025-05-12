package org.example.studie;
import jakarta.persistence.*;

import java.time.LocalDate;

//TODO primary key's koppelen
@Entity
@IdClass(StudyId.class)
@Table(name = "studie")
public class Study {
    @Id
    @Column(name = "naam_studie", length = 50)
    private String studie;

    @Id
    @Column(name = "naam_centrum", length = 50)
    private String centrum;
    @Column(name = "startdatum_studie")
    private LocalDate startdatum;
    @Column(name = "initiatiedatum")
    private LocalDate initiatiedatum;
    @Column(name = "startdatum_juridisch")
    private LocalDate juridisch_start;
    @Column(name = "einddatum_juridisch")
    private LocalDate juridisch_eind;
    @Column(name = "startdatum_apotheek")
    private LocalDate apotheek_start;
    @Column(name = "einddatum_apotheek")
    private LocalDate apotheek_eind;
    @Column(name = "startdatum_metc")
    private LocalDate metc_start;
    @Column(name = "einddatum_metc")
    private LocalDate metc_eind;
    @Column(name = "startdatum_laboratorium")
    private LocalDate lab_start;
    @Column(name = "einddatum_laboratorium")
    private LocalDate lab_eind;
    @Column(name = "geincludeerde_kinderen")
    private Integer geincludeerde_kinderen;
    @Column(name = "opgenomen_kinderen")
    private Integer opgenomen_kinderen;
    @Column(name = "reden_van_weigeren")
    private String reden_weigering;

    public Study(){}


    //TODO evt dit nog ombouwen in 3 functies om code duplicatie te voorkomen?
    public String getStudie(){return studie;}
    public void setStudie(String studie) {this.studie = studie;}

    public String getCentrum(){return centrum;}
    public void setCentrum(String centrum) {this.centrum = centrum;}

    public LocalDate getStartdatum(){return startdatum;}
    public void setStartdatum(LocalDate startdatum) {this.startdatum = startdatum;}

    public LocalDate getInitiatiedatum(){return initiatiedatum;}
    public void setInitiatiedatum(LocalDate initiatiedatum) {this.initiatiedatum = initiatiedatum;}

    public LocalDate getJuridisch_start(){return juridisch_start;}
    public void setJuridisch_start(LocalDate juridisch_start) {this.juridisch_start = juridisch_start;}

    public LocalDate getJuridisch_eind(){return juridisch_eind;}
    public void setJuridisch_eind(LocalDate juridisch_eind) {this.juridisch_eind = juridisch_eind;}

    public LocalDate getApotheek_start(){return apotheek_start;}
    public void setApotheek_start(LocalDate apotheek_start) {this.apotheek_start = apotheek_start;}

    public LocalDate getApotheek_eind(){return apotheek_eind;}
    public void setApotheek_eind(LocalDate apotheek_eind) {this.apotheek_eind = apotheek_eind;}

    public LocalDate getMetc_start(){return metc_start;}
    public void setMetc_start(LocalDate metc_start) {this.metc_start = metc_start;}

    public LocalDate getMetc_eind(){return metc_eind;}
    public void setMetc_eind(LocalDate metc_eind) {this.metc_eind = metc_eind;}

    public LocalDate getLab_start(){return lab_start;}
    public void setLab_start(LocalDate lab_start) {this.lab_start = lab_start;}

    public LocalDate getLab_eind(){return lab_eind;}
    public void setLab_eind(LocalDate lab_eind) {this.lab_eind = lab_eind;}

    public Integer getGeincludeerde_kinderen(){return geincludeerde_kinderen;}
    public void setGeincludeerde_kinderen(Integer geincludeerdeKinderen) {this.geincludeerde_kinderen = geincludeerdeKinderen;}

    public Integer getOpgenomen_kinderen(){return opgenomen_kinderen;}
    public void setOpgenomen_kinderen(Integer opgenomen_kinderen) {this.opgenomen_kinderen = opgenomen_kinderen;}

    public String getReden_weigering(){return reden_weigering;}
    public void setReden_weigering(String reden_weigering) {this.reden_weigering = reden_weigering;}


}
