package org.example.inclusie;
import lombok.Getter;
import lombok.Setter;

import javax.annotation.processing.Generated;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * Primaire sleutel class voor de Inclusion entiteit
 *
 * @author Joost Goddijn
 * @version 1.2, 15-05-2025
 * @since 14-05-2025
 */
public class InclusionId implements Serializable {

    /**
     * Naam van de studie
     */
    @Getter
    @Setter
    private String naam_studie;

    /**
     * Naam van het centrum
     */
    @Getter
    @Setter
    private String naam_centrum;

    /**
     * Datum woarop de inclusie heeft plaatsgevonden
     */
    @Getter
    @Setter
    private LocalDate datum;

    /**
     * Standaard constructor vereist door JPA
     */
    public InclusionId() {}

    /**
     * Constuctor met alle sleutelvelden
     *
     * @param studieNaam naam van de studie
     * @param centrumNaam naam van het centrum
     * @param datum datum van inclusie
     */
    public InclusionId(String studieNaam, String centrumNaam, LocalDate datum) {
        this.naam_studie = studieNaam;
        this.naam_centrum = centrumNaam;
        this.datum = datum;
    }


    /**
     * Vergelijkt twee InclusionID objecten op basis van hun velden
     * @param o het object waarmee vergeleken wordt
     * @return true als de objecten overeen komen
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InclusionId that = (InclusionId) o;
        return Objects.equals(naam_studie, that.naam_studie) &&
                Objects.equals(naam_centrum, that.naam_centrum) &&
                Objects.equals(datum, that.datum);
    }

    /**
     * Genereert een hashcode op basis van studie, datum en centrum
     * @return gehashte code
     */
    @Override
    public int hashCode() {
        return Objects.hash(naam_studie, naam_centrum, datum);
    }
}
