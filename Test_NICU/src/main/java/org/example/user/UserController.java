package org.example.user;

import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {
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
}
