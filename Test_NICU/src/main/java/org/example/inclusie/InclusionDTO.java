package org.example.inclusie;

import java.time.LocalDate;

public class InclusionDTO {
    private String naamStudie;
    private String naamCentrum;
    private LocalDate datum;
    private int geincludeerd;

    public InclusionDTO(String naamStudie, String naamCentrum, LocalDate datum, int geincludeerd) {
        this.naamStudie = naamStudie;
        this.naamCentrum = naamCentrum;
        this.datum = datum;
        this.geincludeerd = geincludeerd;
    }

    public String getNaamStudie() {
        return naamStudie;
    }

    public void setNaamStudie(String naamStudie) {
        this.naamStudie = naamStudie;
    }

    public String getNaamCentrum() {
        return naamCentrum;
    }

    public void setNaamCentrum(String naamCentrum) {
        this.naamCentrum = naamCentrum;
    }

    public LocalDate getDatum() {
        return datum;
    }

    public void setDatum(LocalDate datum) {
        this.datum = datum;
    }

    public int getGeincludeerd() {
        return geincludeerd;
    }

    public void setGeincludeerd(int geincludeerd) {
        this.geincludeerd = geincludeerd;
    }
}
