package org.example.user;

import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Rest controller voor het ophalen van gebruikersinformatie, studies en doorlooptijd gegevens op basis van rol en authenticatie.
 *
 * @author Anne Beumer
 * @version 1.3, 22-05-2025
 * @since 15-05-2025
 */
@RestController
@RequestMapping("/api")
public class UserController {
    private final UserRepository userRepository;

    /**
     * Constructor voor het gebruiken van de userRepository.
     * @param userRepository repository voor gebruikersdata
     */
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Haalt gebruikersgegevens van de ingelogde gebruiker op.
     * @param authenticatie de authenticatie van de ingelode gebuiker
     * @return userDTO met gebruikersnaam, rol en studie of een foutmelding.
     */
    @GetMapping("/user")
    public ResponseEntity<UserDTO> getUserInfo(Authentication authenticatie) {
        if (authenticatie == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        org.springframework.security.core.userdetails.User springUser =
                (org.springframework.security.core.userdetails.User) authenticatie.getPrincipal();

        Optional<User> optionalUser = userRepository.findByUsername(springUser.getUsername());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        User gebruiker = optionalUser.get();

        UserDTO dto = new UserDTO();
        dto.setUsername(gebruiker.getUsername());
        dto.setRole(gebruiker.getRole());
        dto.setStudie(gebruiker.getStudie());

        return ResponseEntity.ok(dto);
    }

    /**
     * Haalt een lijst van studies op, op basis van de rol van de gebruiker.
     *
     * @param authentication authenticatie van de gebruiker
     * @return lijst van studies of een foutstatus
     */
    @GetMapping("/user-studies")
    public ResponseEntity<?> getStudies(Authentication authentication){
        if(authentication == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        org.springframework.security.core.userdetails.User users = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

        String role = users.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("NONE");

        if("ROLE_ADMIN".equals(role)){
            List<String> studies = userRepository.findAllByRole("ROLE_STUDIE")
                    .stream().map(User::getStudie)
                    .toList();
            return ResponseEntity.ok(studies);
        }else if("ROLE_STUDIE".equals(role)){
            Optional<User> gebruiker = userRepository.findByUsername(users.getUsername());
            return gebruiker.map(user -> ResponseEntity.ok(List.of(user.getStudie())))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        } else{return ResponseEntity.status(HttpStatus.FORBIDDEN).build();}

    }

    /**
     * Haalt de naam van de studie en fasen op voor de ingelogde gebruiker met de rol studie.
     *
     * @param authentication authenticatie van de gebruiker
     * @return JSON met studieNaam en Booleans voor de verschillende fasen
     */
    @GetMapping("/user/studienaam")
    public ResponseEntity<?> getStudieNaam(Authentication authentication){
        if(authentication == null){return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();}

        org.springframework.security.core.userdetails.User users = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

        Optional<User> optionalUser = userRepository.findByUsername(users.getUsername());

        if(optionalUser.isPresent()){
            User gebruiker = optionalUser.get();
            Map<String, Object> response = new HashMap<>();
            response.put("studieNaam", gebruiker.getStudie());
            response.put("juridisch", gebruiker.getDoorlooptijdJuridisch());
            response.put("apotheek", gebruiker.getDoorlooptijdApotheek());
            response.put("metc", gebruiker.getDoorlooptijdMetc());
            response.put("laboratorium", gebruiker.getDoorlooptijdLaboratorium());
            return ResponseEntity.ok(response);
        } else {return ResponseEntity.status(HttpStatus.NOT_FOUND).build();}
    }

    /**
     * Haalt de actieve fasen op voor een gegeven studie
     *
     * @param studie de naam van de studie
     * @return JSON met true or false per fase of een foutmelding
     */
    @GetMapping("/studie-fasen")
    public ResponseEntity<?> getFasenVoorStudie(@RequestParam String studie){
        Optional<User> user = userRepository.findByStudie(studie);

        if(user.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Studie niet gevonden.");
        }

        Map<String, Boolean> fasen = new HashMap<>();
        fasen.put("juridisch", user.get().getDoorlooptijdJuridisch());
        fasen.put("apotheek", user.get().getDoorlooptijdApotheek());
        fasen.put("metc", user.get().getDoorlooptijdMetc());
        fasen.put("laboratorium", user.get().getDoorlooptijdLaboratorium());

        return ResponseEntity.ok(fasen);
    }
}

