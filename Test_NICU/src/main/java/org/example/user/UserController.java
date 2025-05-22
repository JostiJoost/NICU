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

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserInfo(Authentication authenticatie){
        if(authenticatie == null){return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();}
        org.springframework.security.core.userdetails.User user = (org.springframework.security.core.userdetails.User) authenticatie.getPrincipal();

        String role = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("NONE");

        Map<String, String> result = new HashMap<>();
        result.put("username", user.getUsername());
        result.put("role", role);
        return ResponseEntity.ok(result);
    }
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

