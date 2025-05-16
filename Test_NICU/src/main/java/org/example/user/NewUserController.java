package org.example.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Optional;

@RestController
@RequestMapping("api/users")
public class NewUserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

        return ResponseEntity.ok(new CreatedUserResponse(username, password));
    }

    private String generateRandomPassword(int lengte){
        String mogelijkeChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%&*";
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < lengte; i++){
            int random = (int) (Math.random() * mogelijkeChar.length());
            sb.append(mogelijkeChar.charAt(random));
        }
        return sb.toString();
    }

    public static class CreatedUserResponse{
        public String username;
        public String password;

        public CreatedUserResponse(String username, String password){
            this.username = username;
            this.password = password;
        }
    }

}
