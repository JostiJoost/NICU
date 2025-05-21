package org.example.studie;

import java.time.LocalDate;

public class StudyDTO {
    private String centrum;
    private String studie;
    private LocalDate startdatum;
    private LocalDate initiatiedatum;

    public StudyDTO(String centrum, String studie, LocalDate startdatum, LocalDate initiatiedatum) {
        this.centrum = centrum;
        this.studie = studie;
        this.startdatum = startdatum;
        this.initiatiedatum = initiatiedatum;
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
