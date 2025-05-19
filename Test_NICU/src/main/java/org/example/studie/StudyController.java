package org.example.studie;
import org.example.user.User;
import org.example.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


import java.util.Optional;
import java.util.List;


@RestController
@RequestMapping("/api/studie")
public class StudyController {
    @Autowired
    private StudyRepository studyRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Study> saveStudy(@RequestBody Study studie, Authentication authentication){
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Optional<User> optionalUser = userRepository.findByUsername(userDetails.getUsername());
        if(optionalUser.isEmpty()){
            return ResponseEntity.status(401).build();
        }
        User user = optionalUser.get();

        if("ROLE_STUDIE".equals(user.getRole())){
            String userStudie = user.getStudie();
            if(userStudie == null || userStudie.isEmpty()){return ResponseEntity.badRequest().body(null);}
            studie.setStudie(userStudie);
        }
        System.out.println("Ontvange studie: " + studie.getStudie() + ", centrum: " + studie.getCentrum());
        Study opgeslagen = studyRepository.save(studie);
        return ResponseEntity.ok(opgeslagen);
    }

    @GetMapping("/{studie}/{centrum}")
    public List<Study> krijgDoorlooptijd(
            @PathVariable String studie,
            @PathVariable String centrum) {

        return studyRepository.findAllByStudyAndCenter(studie, centrum);
    }

    @GetMapping("/studies")
    public List<String> krijgStudies() {
        return studyRepository.findAllDistinctStudies();
    }

    @GetMapping("/centra")
    public List<String> krijgCentra() {
        return studyRepository.findAllDistinctCentra();
    }

    @GetMapping("/{centrum}/studies")
    public List<String> krijgStudiesVanCentrum(
            @PathVariable String centrum) {
        return studyRepository.findAllDistinctStudiesFromCentrum(centrum);
    }
}
