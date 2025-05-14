package org.example.inclusie;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@IdClass(InclusionId.class)
@Table(name = "aantal_geincludeerd")
public class Inclusion {

    @Id
    String naam_studie;
    @Id
    String naam_centrum;

    LocalDate datum;

    int geincludeerd;

    public String getNaam_studie() {
        return naam_studie;
    }

    public void setNaam_studie(String naam_studie) {
        this.naam_studie = naam_studie;
    }

    public String getNaam_centrum() {
        return naam_centrum;
    }

    public void setNaam_centrum(String naam_centrum) {
        this.naam_centrum = naam_centrum;
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
