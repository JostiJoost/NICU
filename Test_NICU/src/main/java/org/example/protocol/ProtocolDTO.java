package org.example.protocol;

import java.time.LocalDate;

public class ProtocolDTO {
    private String naamCentrum;
    private String naamProtocol;
    private LocalDate datumAanvraag;
    private LocalDate datumEerste;
    private LocalDate datumAccordering;

    public ProtocolDTO(String naamCentrum, String naamProtocol, LocalDate datumAanvraag, LocalDate datumEerste, LocalDate datumAccordering) {
        this.naamCentrum = naamCentrum;
        this.naamProtocol = naamProtocol;
        this.datumAanvraag = datumAanvraag;
        this.datumEerste = datumEerste;
        this.datumAccordering = datumAccordering;
    }

    public String getNaamProtocol() {
        return naamProtocol;
    }

    public void setNaamProtocol(String naamProtocol) {
        this.naamProtocol = naamProtocol;
    }

    public String getNaamCentrum() {
        return naamCentrum;
    }

    public void setNaamCentrum(String naamCentrum) {
        this.naamCentrum = naamCentrum;
    }

    public LocalDate getDatumAanvraag() {
        return datumAanvraag;
    }

    public void setDatumAanvraag(LocalDate datumAanvraag) {
        this.datumAanvraag = datumAanvraag;
    }

    public LocalDate getDatumEerste() {
        return datumEerste;
    }

    public void setDatumEerste(LocalDate datumEerste) {
        this.datumEerste = datumEerste;
    }

    public LocalDate getDatumAccordering() {
        return datumAccordering;
    }

    public void setDatumAccordering(LocalDate datumAccordering) {
        this.datumAccordering = datumAccordering;
    }
}
