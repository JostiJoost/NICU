package org.example.inclusie;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

public class InclusionId implements Serializable {
    private String naam_studie;
    private String naam_centrum;
    private LocalDate datum;

    public InclusionId() {}

    public InclusionId(String studieNaam, String centrumNaam, LocalDate datum) {
        this.naam_studie = studieNaam;
        this.naam_centrum = centrumNaam;
        this.datum = datum;
    }

    public String getStudie() {
        return naam_studie;
    }

    public void setStudie(String studieNaam) {
        this.naam_studie = studieNaam;
    }

    public String getCentrum() {
        return naam_centrum;
    }

    public void setCentrum(String centrumNaam) {
        this.naam_centrum = centrumNaam;
    }

    public LocalDate getDatum() {
        return datum;
    }

    public void setDatum(LocalDate datum) {
        this.datum = datum;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InclusionId that = (InclusionId) o;
        return Objects.equals(naam_studie, that.naam_studie) &&
                Objects.equals(naam_centrum, that.naam_centrum) &&
                Objects.equals(datum, that.datum);
    }

    @Override
    public int hashCode() {
        return Objects.hash(naam_studie, naam_centrum, datum);
    }
}
