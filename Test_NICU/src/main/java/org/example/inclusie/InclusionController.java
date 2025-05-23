package org.example.inclusie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Rest controller voor het beheren en ophalen van inclusie gegevens per studie en centrum.
 *
 * @author Anne Beumer en Joost Goddijn
 * @version 1.0
 * @since 14-05-2025
 */
@RestController
@RequestMapping("/api/aantal_geincludeerd")
public class InclusionController {

    @Autowired
    private InclusionRepository inclusionRepository;

    /**
     * Geeft het meest recente aantal geïncludeerde kinderen terug vooreen specifieke studie en centrum.
     *
     * @param studie naam van de studie
     * @param centrum naam van het centrum
     * @return aantal geïncludeerde kinderen in de laatste datum registratie
     */
    @GetMapping("/{studie}/{centrum}")
    public Integer getMostRecentInclusion(
            @PathVariable String studie,
            @PathVariable String centrum) {
        return inclusionRepository.findAllByStudyAndCenterOrderByDatumDesc(studie, centrum).get(0).getGeincludeerd();
    }

    /**
     * Alle inclusieregistraties voor één studie.
     *
     * @param studie naam van de studie
     * @return lijst van inclusieDTO met datum en aantallen
     */
    @GetMapping("/chart/inclusies/studie/{studie}")
    public List<InclusionDTO> getInclusionChartStudy(@PathVariable String studie) {
        return inclusionRepository.findInclusionByStudy(studie);
    }

    /**
     * Alle inclusieregistraties voor één centrum
     *
     * @param centrum naam van het centrum
     * @return lijst van  InclusioDTO met datum en aantallen
     */
    @GetMapping("/chart/inclusies/centrum/{centrum}")
    public List<InclusionDTO> getInclusionChartCentrum(@PathVariable String centrum) {
        return inclusionRepository.findInclusionByCentrum(centrum);
    }

    /**
     * Geeft de meest recente inclusieregistratie als DTO met datum
     * @param studie naam van de studie
     * @param centrum naam van het centrum
     * @return inclusionDTO met studie, centrum, datum en aantal geïncludeerd
     */
    @GetMapping("/aantal_geincludeerd/{studie}/{centrum}")
    public ResponseEntity<InclusionDTO> getMeestRecenteIncusie(@PathVariable String studie, @PathVariable String centrum) {
        List<Inclusion>  inclusies = inclusionRepository.findMostRecent(studie, centrum);
        if(inclusies.isEmpty()){return ResponseEntity.notFound().build();}
        Inclusion inclusion = inclusies.get(0);
        InclusionDTO dto = new InclusionDTO(inclusion.getNaam_studie(), inclusion.getNaam_centrum(), inclusion.getDatum(), inclusion.getGeincludeerd());
        return ResponseEntity.ok(dto);
    }
}
