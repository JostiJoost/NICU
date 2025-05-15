package org.example.inclusie;

import java.time.LocalDate;

public class InclusionDTO {
    private String naamCentrum;
    private LocalDate datum;
    private int geincludeerd;

    public InclusionDTO(String naamCentrum, LocalDate datum, int geincludeerd) {
        this.naamCentrum = naamCentrum;
        this.datum = datum;
        this.geincludeerd = geincludeerd;
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
