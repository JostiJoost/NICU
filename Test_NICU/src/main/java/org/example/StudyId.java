package org.example;
import java.io.Serializable;

public class StudyId implements Serializable{
    private String studie;
    private String centrum;

    public StudyId() {}

    public StudyId(String studie, String centrum){
        this.studie = studie;
        this.centrum = centrum;
    }

    public String getStudie(){return studie;}
    public void setStudie(String studie){this.studie = studie;}

    public String getCentrum(){return centrum;}
    public void setCentrum(String centrum){this.centrum = centrum;}

}
