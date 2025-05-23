package org.example.studie;
import org.example.inclusie.Inclusion;
import org.example.inclusie.InclusionRepository;
import org.example.user.User;
import org.example.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDate;
import java.util.Optional;
import java.util.List;


@RestController
@RequestMapping("/api/studie")
public class StudyController {
    @Autowired
    private StudyRepository studyRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InclusionRepository inclusionRepository;

    @PostMapping
    public ResponseEntity<Study> saveStudy(@RequestBody StudyDTO dto, Authentication authentication){
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Optional<User> optionalUser = userRepository.findByUsername(userDetails.getUsername());
        if(optionalUser.isEmpty()){
            return ResponseEntity.status(401).build();
        }
        User user = optionalUser.get();

        if("ROLE_STUDIE".equals(user.getRole())){
            String userStudie = user.getStudie();
            if(userStudie == null || userStudie.isEmpty()){return ResponseEntity.badRequest().body(null);}
            dto.setStudie(userStudie);
        }

        Study studie = new Study();
        studie.setCentrum(dto.getCentrum());
        studie.setStudie(dto.getStudie());
        studie.setStartdatum(dto.getStartdatum());
        studie.setInitiatiedatum(dto.getInitiatiedatum());
        studie.setJuridisch_start(dto.getStartJuridisch());
        studie.setJuridisch_eind(dto.getEindJuridisch());
        studie.setApotheek_start(dto.getStartApotheek());
        studie.setApotheek_eind(dto.getEindApotheek());
        studie.setMetc_start(dto.getStartMETC());
        studie.setMetc_eind(dto.getEindMETC());
        studie.setLab_start(dto.getStartLab());
        studie.setLab_eind(dto.getEindLab());
        studie.setGeincludeerde_kinderen(dto.getGeincludeerde_kinderen());
        studie.setOpgenomen_kinderen(dto.getOpgenomen_kinderen());
        studie.setReden_weigering(dto.getReden_weigering());

        Study opgeslagen = studyRepository.save(studie);

        if(dto.getInclusie_datum() != null && dto.getGeincludeerde_kinderen() != null){
            Inclusion inclusie = new Inclusion();
            inclusie.setNaam_studie(dto.getStudie());
            inclusie.setNaam_centrum(dto.getCentrum());
            inclusie.setDatum(dto.getInclusie_datum());
            inclusie.setGeincludeerd(dto.getGeincludeerde_kinderen());
            inclusionRepository.save(inclusie);
            List<Inclusion> inclusies = inclusionRepository
                    .findMostRecent(dto.getStudie(), dto.getStudie());
            if(!inclusies.isEmpty()){Inclusion meestRecent = inclusies.get(0); }
        }

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

    @GetMapping("/doorlooptijden")
    public List<StudyDTO> krijgAlleStudies() {
        return studyRepository.findDoorlooptijd();
    }

    @GetMapping("/initiatiedatum/{studie}")
    public List<LocalDate> krijgInitiatiedatums(
            @PathVariable String studie) {
        return studyRepository.findInitiatiedatum(studie);
    }

    @GetMapping("/laatste/{studie}/{centrum}")
    public ResponseEntity<Study> krijgLaatsteStudie(@PathVariable String studie, @PathVariable String centrum){
        List<Study> studies = studyRepository.findByStudieIgnoreCaseAndCentrumIgnoreCase(studie.trim(), centrum.trim());
        if(studies.isEmpty()){return ResponseEntity.notFound().build();}
        studies.sort((s1, s2) -> s2.getStartdatum().compareTo(s1.getStartdatum()));
        return ResponseEntity.ok(studies.get(0));
    }
}
