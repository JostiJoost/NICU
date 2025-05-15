package org.example.studie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studie")
public class StudyController {
    @Autowired
    private StudyRepository studyRepository;

    @PostMapping
    public ResponseEntity<Study> saveStudy(@RequestBody Study studie){
        System.out.println("Ontvangen studie: " + studie.getStudie() + ", centrum: " + studie.getCentrum());
        Study opgeslagen = studyRepository.save(studie);
        return ResponseEntity.ok(opgeslagen);
    }

    @GetMapping("/{studie}/{centrum}")
    public List<Study> krijgDoorlooptijd(
            @PathVariable String studie,
            @PathVariable String centrum) {

        return studyRepository.findAllByStudyAndCenter(studie, centrum);
    }
}
