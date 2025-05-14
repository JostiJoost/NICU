package org.example.protocol;

import java.io.Serializable;
import java.util.Objects;

public class TegenlezerId implements Serializable {
    private String naamProtocol;
    private String naamTegenlezer;

    public TegenlezerId(){}

    public TegenlezerId(String naamProtocol, String naamTegenlezer){
        this.naamProtocol = naamProtocol;
        this.naamTegenlezer = naamTegenlezer;
    }

    @Override
    public boolean equals(Object object){
        if(this==object) {return true;}
        if(!(object instanceof TegenlezerId)){return false;}
        TegenlezerId that = (TegenlezerId) object;
        return Objects.equals(naamProtocol, that.naamProtocol) && Objects.equals(naamTegenlezer, that.naamTegenlezer);
    }

    @Override
    public int hashCode(){
        return Objects.hash(naamProtocol, naamTegenlezer);
    }
}
