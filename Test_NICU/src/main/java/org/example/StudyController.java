package org.example;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.StudyId;

@RestController
@RequestMapping("/api/studies")
public class StudyController {
    @Autowired
    private StudyRepository studyRepository;

    @PostMapping
    public ResponseEntity<Study> saveStudy(@RequestBody Study studie){
        System.out.println("Ontvangen studie: " + studie.getStudie() + ", centrum: " + studie.getCentrum());
        Study opgeslagen = studyRepository.save(studie);
        return ResponseEntity.ok(opgeslagen);
    }

    @GetMapping
    public ResponseEntity<?> krijgStudies() {
        return ResponseEntity.ok(studyRepository.findAll());
    }
}
