package org.example.studie;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * Samengestelde primaire sleutel voor de Study entiteit
 *De class implementeer Serializable aangezien dat verplicht is voor sleutel classes
 *
 * @author Anne Beumer
 * @version 1.2, 15-05-2025
 * @since 09-05-2025
 */
public class StudyId implements Serializable{
    /**
     * Naam van de studie (deel van samengestelde sleutel)
     */
    @Getter
    @Setter
    private String studie;

    /**
     * Naam van het centrum (andere deel van de samengestelde sleutel)
     */
    @Getter
    @Setter
    private String centrum;

    /**
     * Lege constructor voor de JPA
     */
    public StudyId() {}

    /**
     * Constructor voor het initialiseren van beide sleutelvelden
     *
     * @param studie naam van de studie
     * @param centrum naam van het centrum
     */
    public StudyId(String studie, String centrum){
        this.studie = studie;
        this.centrum = centrum;
    }


}
