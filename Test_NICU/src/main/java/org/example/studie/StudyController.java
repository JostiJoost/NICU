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

/**
 * Rest controller voor het beheren vna studiegegevens.
 *
 * @author Anne Beumer en Joost Goddijn
 * @version 1.0
 * @since 16-05-2025
 */
@RestController
@RequestMapping("/api/studie")
public class StudyController {
    @Autowired
    private StudyRepository studyRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InclusionRepository inclusionRepository;

    /**
     * Slaat een nieuwe of bijgewerkte studie op, met mogelijk een inclusie.
     * Alleen gebruikers met een geldige authenticatie/rol kunnen gegevens indienen.
     *
     * @param dto door de gebruikers ingevulde gegevens uit StudyDTO
     * @param authentication authenticatie van de ingelogde gebruiker
     * @return de opgeslagen studie of een 400 status als het ongeldig is
     */
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

    /**
     * Haalt alle studiegegevens op voor een specifieke combinatie van studienaam en centrum.
     * @param studie de studie naam
     * @param centrum het centrum
     * @return een lijst van studie gegevens
     */
    @GetMapping("/{studie}/{centrum}")
    public List<Study> krijgDoorlooptijd(
            @PathVariable String studie,
            @PathVariable String centrum) {

        return studyRepository.findAllByStudyAndCenter(studie, centrum);
    }

    /**
     * Geeft een lijst van alle unieke studienamen
     *
     * @return lijst van alle studienamen
     */
    @GetMapping("/studies")
    public List<String> krijgStudies() {
        return studyRepository.findAllDistinctStudies();
    }

    /**
     * Geeft een lijst van alle unieke centra
     * @return lijst van centra.
     */
    @GetMapping("/centra")
    public List<String> krijgCentra() {
        return studyRepository.findAllDistinctCentra();
    }

    /**
     * Haalt alle unieke studies op die zijn gekoppeld aan een specifiek centrum
     *
     * @param centrum het centrum
     * @return lijst van studienamen
     */
    @GetMapping("/{centrum}/studies")
    public List<String> krijgStudiesVanCentrum(
            @PathVariable String centrum) {
        return studyRepository.findAllDistinctStudiesFromCentrum(centrum);
    }

    /**
     * Haalt alle studies op inclusief de bijbehorende startdata voor alle fasen.
     *
     * @return de studyDTO lijst
     */
    @GetMapping("/doorlooptijden")
    public List<StudyDTO> krijgAlleStudies() {
        return studyRepository.findDoorlooptijd();
    }

    /**
     * Geeft alle intitiatiedatums terug voor een bepaalde studie.
     *
     * @param studie de studie naam
     * @return lijst van inititatiedatums
     */
    @GetMapping("/initiatiedatum/{studie}")
    public List<LocalDate> krijgInitiatiedatums(
            @PathVariable String studie) {
        return studyRepository.findInitiatiedatum(studie);
    }

    /**
     * Geeft de meest recent toegevoegde studie terug voor een studie/centrum combinatie
     * @param studie naam studie
     * @param centrum centrum
     * @return studie met de meest recente startdatum of een 404 foutmelding (niet gevonden)
     */
    @GetMapping("/laatste/{studie}/{centrum}")
    public ResponseEntity<Study> krijgLaatsteStudie(@PathVariable String studie, @PathVariable String centrum){
        List<Study> studies = studyRepository.findByStudieIgnoreCaseAndCentrumIgnoreCase(studie.trim(), centrum.trim());
        if(studies.isEmpty()){return ResponseEntity.notFound().build();}
        studies.sort((s1, s2) -> s2.getStartdatum().compareTo(s1.getStartdatum()));
        return ResponseEntity.ok(studies.get(0));
    }
}
