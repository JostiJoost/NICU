package org.example.inclusie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aantal_geincludeerd")
public class InclusionController {

    @Autowired
    private InclusionRepository inclusionRepository;

    @GetMapping("/{studie}/{centrum}")
    public Integer getMostRecentInclusion(
            @PathVariable String studie,
            @PathVariable String centrum) {
        return inclusionRepository.findAllByStudyAndCenterOrderByDatumDesc(studie, centrum).get(0).getGeincludeerd();
    }

    @GetMapping("/chart/inclusies/studie/{studie}")
    public List<InclusionDTO> getInclusionChartStudy(@PathVariable String studie) {
        return inclusionRepository.findInclusionByStudy(studie);
    }

    @GetMapping("/chart/inclusies/centrum/{centrum}")
    public List<InclusionDTO> getInclusionChartCentrum(@PathVariable String centrum) {
        return inclusionRepository.findInclusionByCentrum(centrum);
    }

    @GetMapping("/aantal_geincludeerd/{studie}/{centrum}")
    public ResponseEntity<InclusionDTO> getMeestRecenteIncusie(@PathVariable String studie, @PathVariable String centrum) {
        List<Inclusion>  inclusies = inclusionRepository.findMostRecent(studie, centrum);
        if(inclusies.isEmpty()){return ResponseEntity.notFound().build();}
        Inclusion inclusion = inclusies.get(0);
        InclusionDTO dto = new InclusionDTO(inclusion.getNaam_studie(), inclusion.getNaam_centrum(), inclusion.getDatum(), inclusion.getGeincludeerd());
        return ResponseEntity.ok(dto);
    }
}
