package org.example.protocol;

import java.io.Serializable;
import java.util.Objects;

/**
 * Primaire sleutel class voor de tabel tegenlezer in de database voor een samengestelde sleutel.
 * Implementeert serializable, zodat de sleutel veilig kan worden opgeslagen.
 *
 * @author Anne Beumer
 * @version 1.0
 * @since 14-05-2025
 */
public class TegenlezerId implements Serializable {

    /**
     * De naam van het protocol waaraan de tegenlezer is gekoppeld.
     */
    private String naamProtocol;

    /**
     * De naam van het protocol waaraan de tegenlezer is gekoppeld.
     */
    private String naamTegenlezer;

    /**
     * Lege constructor, verplicht door JPA
     */
    public TegenlezerId(){}

    /**
     * Constructor met parameters om een samengestelde sleutel aan te maken.
     * @param naamProtocol naam van het protocol
     * @param naamTegenlezer naam van de tegenlezer
     */
    public TegenlezerId(String naamProtocol, String naamTegenlezer){
        this.naamProtocol = naamProtocol;
        this.naamTegenlezer = naamTegenlezer;
    }

    /**
     * Vergelijkt deze sleutel met een ander object op basis van beide sleutelvelden
     * @param object het object dat waarmee vergeleken wordt
     * @return true als beide sleutels overeenkomen
     */
    @Override
    public boolean equals(Object object){
        if(this==object) {return true;}
        if(!(object instanceof TegenlezerId)){return false;}
        TegenlezerId that = (TegenlezerId) object;
        return Objects.equals(naamProtocol, that.naamProtocol) && Objects.equals(naamTegenlezer, that.naamTegenlezer);
    }

    /**
     * Genereert een hashcode op basis van beide sleutelvelden.
     * @return de hashcode.
     */
    @Override
    public int hashCode(){
        return Objects.hash(naamProtocol, naamTegenlezer);
    }
}
