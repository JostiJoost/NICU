package org.example;
import jakarta.persistence.*;

@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(name = "studie_naam")
    private String studie;

    @Column(nullable = false)
    private boolean enabled = true;

    public Long getID(){return id;}
    public void setId(){this.id = id;}

    public String getUsername(){return username;}
    public void setUsername(){this.username = username;}

    public String getPassword(){return password;}
    public void setPassword(){this.password = password;}

    public String getRole(){return role;}
    public void setRole(){this.role = role;}

    public String getStudie(){return studie;}
    public void setStudie(){this.studie = studie;}

    public boolean isEnabled(){return enabled;}
    public void setEnabled(){this.enabled = enabled;}
}
