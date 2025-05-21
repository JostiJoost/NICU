package org.example.studie;

import java.time.LocalDate;

public class StudyDTO {
    private String centrum;
    private String studie;
    private LocalDate startdatum;
    private LocalDate startJuridisch;
    private LocalDate eindJuridisch;
    private LocalDate startApotheek;
    private LocalDate eindApotheek;
    private LocalDate startMETC;
    private LocalDate eindMETC;
    private LocalDate startLab;
    private LocalDate eindLab;
    private LocalDate initiatiedatum;

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

    public LocalDate getStartJuridisch() {
        return startJuridisch;
    }

    public void setStartJuridisch(LocalDate startJuridisch) {
        this.startJuridisch = startJuridisch;
    }

    public LocalDate getEindJuridisch() {
        return eindJuridisch;
    }

    public void setEindJuridisch(LocalDate eindJuridisch) {
        this.eindJuridisch = eindJuridisch;
    }

    public LocalDate getStartApotheek() {
        return startApotheek;
    }

    public void setStartApotheek(LocalDate startApotheek) {
        this.startApotheek = startApotheek;
    }

    public LocalDate getEindApotheek() {
        return eindApotheek;
    }

    public void setEindApotheek(LocalDate eindApotheek) {
        this.eindApotheek = eindApotheek;
    }

    public LocalDate getStartMETC() {
        return startMETC;
    }

    public void setStartMETC(LocalDate startMETC) {
        this.startMETC = startMETC;
    }

    public LocalDate getEindMETC() {
        return eindMETC;
    }

    public void setEindMETC(LocalDate eindMETC) {
        this.eindMETC = eindMETC;
    }

    public LocalDate getStartLab() {
        return startLab;
    }

    public void setStartLab(LocalDate startLab) {
        this.startLab = startLab;
    }

    public LocalDate getEindLab() {
        return eindLab;
    }

    public void setEindLab(LocalDate eindLab) {
        this.eindLab = eindLab;
    }

    public String getCentrum() {
        return centrum;
    }

    public void setCentrum(String centrum) {
        this.centrum = centrum;
    }

    public String getStudie() {
        return studie;
    }

    public void setStudie(String studie) {
        this.studie = studie;
    }

    public LocalDate getStartdatum() {
        return startdatum;
    }

    public void setStartdatum(LocalDate startdatum) {
        this.startdatum = startdatum;
    }

    public LocalDate getInitiatiedatum() {
        return initiatiedatum;
    }

    public void setInitiatiedatum(LocalDate initiatiedatum) {
        this.initiatiedatum = initiatiedatum;
    }
}
