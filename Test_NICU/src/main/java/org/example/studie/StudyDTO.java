package org.example.studie;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

public class StudyDTO {
    @Getter
    @Setter
    private String centrum;
    @Getter
    @Setter
    private String studie;
    @Getter
    @Setter
    private LocalDate startdatum;
    @Getter
    @Setter
    private LocalDate startJuridisch;
    @Getter
    @Setter
    private LocalDate eindJuridisch;
    @Getter
    @Setter
    private LocalDate startApotheek;
    @Getter
    @Setter
    private LocalDate eindApotheek;
    @Getter
    @Setter
    private LocalDate startMETC;
    @Getter
    @Setter
    private LocalDate eindMETC;
    @Getter
    @Setter
    private LocalDate startLab;
    @Getter
    @Setter
    private LocalDate eindLab;
    @Getter
    @Setter
    private LocalDate initiatiedatum;
    @Getter
    @Setter
    private Integer geincludeerde_kinderen;
    @Getter
    @Setter
    private LocalDate inclusie_datum;
    @Getter
    @Setter
    private Integer opgenomen_kinderen;
    @Getter
    @Setter
    private String reden_weigering;

    public StudyDTO(){}

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
}
