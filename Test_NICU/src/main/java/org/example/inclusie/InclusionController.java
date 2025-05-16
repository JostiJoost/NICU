package org.example.inclusie;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/chart/inclusies/{studie}")
    public List<InclusionDTO> getInclusionChart(@PathVariable String studie) {
        return inclusionRepository.findInclusionByStudy(studie);
    }
}
