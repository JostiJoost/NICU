package org.example.user;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

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

    @Getter
    @Setter
    @Column(name="doorlooptijd_juridisch")
    private Boolean doorlooptijdJuridisch;

    @Getter
    @Setter
    @Column(name="doorlooptijd_apotheek")
    private Boolean doorlooptijdApotheek;

    @Getter
    @Setter
    @Column(name="doorlooptijd_metc")
    private Boolean doorlooptijdMetc;

    @Getter
    @Setter
    @Column(name="doorlooptijd_laboratorium")
    private Boolean doorlooptijdLaboratorium;

    public Collection<? extends GrantedAuthority> getAuthorities(){
        return List.of(new SimpleGrantedAuthority(role));
    }

    public Long getID(){return id;}
    public void setId(Long id){this.id = id;}

    public String getUsername(){return username;}
    public void setUsername(String username){this.username = username;}

    public String getPassword(){return password;}
    public void setPassword(String password){this.password = password;}

    public String getRole(){return role;}
    public void setRole(String role){this.role = role;}

    public String getStudie(){return studie;}
    public void setStudie(String studie){this.studie = studie;}

    public boolean isEnabled(){return enabled;}
    public void setEnabled(boolean enabled){this.enabled = enabled;}
}
