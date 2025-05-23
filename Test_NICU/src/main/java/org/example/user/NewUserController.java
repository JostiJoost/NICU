package org.example.user;

import org.example.studie.Study;
import org.example.studie.StudyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Rest controller voor het beheren van studiegebruikers binnen de admin inlog.
 *
 * @author Anne Beumer
 * @version 1.0
 * @since 16-05-2025
 */
@RestController
@RequestMapping("api/users")
public class NewUserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private StudyRepository studyRepository;

    /**
     * Maakt een nieuwe studiegebruiker aan met een automatisch gegenereerd wachtwoord.
     *
     * @param dto userCreationDTO met studienaam en fasekeuzes
     * @return een createdUserResponse met gebruikersnaam en gegenereerd wachtwoord.
     */
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserCreationDTO dto){

        String username = dto.studieNaam.toLowerCase().replaceAll("\\s+", "") + "_user";

        if(userRepository.findByUsername(username).isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Er bestaat al een studie met deze naam.");
        }

        String password = generateRandomPassword(8);
        String hashedPassword = passwordEncoder.encode(password);

        User user = new User();
        user.setUsername(username);
        user.setPassword(hashedPassword);
        user.setRole("ROLE_STUDIE");
        user.setEnabled(true);
        user.setStudie(dto.studieNaam);
        user.setDoorlooptijdJuridisch(dto.doorlooptijdJuridisch);
        user.setDoorlooptijdApotheek(dto.doorlooptijdApotheek);
        user.setDoorlooptijdMetc(dto.doorlooptijdMetc);
        user.setDoorlooptijdLaboratorium(dto.doorlooptijdLaboratorium);
        userRepository.save(user);

        List<String> centra = studyRepository.findAllDistinctCentra();
        for(String centrumNaam: centra){
            Study nieuweStudie = new Study();
            nieuweStudie.setStudie(dto.studieNaam);
            nieuweStudie.setCentrum(centrumNaam);
            studyRepository.save(nieuweStudie);
        }

        return ResponseEntity.ok(new CreatedUserResponse(username, password));
    }

    /**
     * Reset het wachtwoord van een bestaande gebruiker en retourneert het nieuwe wachtwoord
     *
     * @param username gebruikersnaam van het account
     * @return een JSON response met gebruikersnaam en nieuw wachtwoord
     */
    @PutMapping("/reset-password/{username}")
    public ResponseEntity<?> resetPassword(@PathVariable String username){
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Gebruiker niet gevonden.");
        }

        User user = optionalUser.get();
        String newPassword = generateRandomPassword(8);
        String hashedPassword = passwordEncoder.encode(newPassword);

        user.setPassword(hashedPassword);
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("newPassword", newPassword);

        return ResponseEntity.ok(response);
    }

    /**
     * Geeft een lijst terug van alle gebruikersnamen en hun rollen
     *
     * @return JSON lijst van gebruikers met gebruikersnaam en rol
     */
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<Map<String, String>> users = userRepository.findAll().stream()
                .map(user -> {
                    Map<String, String> u = new HashMap<>();
                    u.put("username", user.getUsername());
                    u.put("role", user.getRole());
                    return u;
                })
                .toList();

        return ResponseEntity.ok(users);
    }

    /**
     * Genereert een willekeurig wachtwoord van opgegeven lengte.
     *
     * @param lengte aantal tekens
     * @return willekeurig wachtwoord
     */
    private String generateRandomPassword(int lengte){
        String mogelijkeChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%&*";
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < lengte; i++){
            int random = (int) (Math.random() * mogelijkeChar.length());
            sb.append(mogelijkeChar.charAt(random));
        }
        return sb.toString();
    }

    /**
     * Bevat een response na het aanmaken van een gebruiker, zodat de gebruikersnaam en wachtwoord teruggegeven worden aan de frontend.
     */
    public static class CreatedUserResponse{
        public String username;
        public String password;

        public CreatedUserResponse(String username, String password){
            this.username = username;
            this.password = password;
        }
    }

}
