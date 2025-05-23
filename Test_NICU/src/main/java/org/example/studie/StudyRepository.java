package org.example.studie;
import org.example.inclusie.Inclusion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 *Repository voor Study entiteiten.
 * Maakt gebruik van zowel Spring dat JPA voor het generen van sql query's als aangepaste queries
 *
 * @author Anne Beumer en Joost Goddijn
 * @version 1.0
 * @since 09-05-2025
 */
@Repository
public interface StudyRepository extends JpaRepository<Study, StudyId>{
    /**
     * Zoekt alle studies voor een specifieke studie/centrum combinatie (niet hoofdletter gevoellig)
     * @param studie naam studie
     * @param centrum het centrum
     * @return lijst van bijbehorende studie objecten
     */
    List<Study> findByStudieIgnoreCaseAndCentrumIgnoreCase(String studie, String centrum);

    /**
     * Haalt alle studies op voor een gegeven studie/centrum combinatie
     * @param studie naam studie
     * @param centrum het centrum
     * @return lijst van studie objecten
     */
    @Query("SELECT i FROM Study i WHERE i.studie = :naam_studie AND i.centrum = :naam_centrum")
    List<Study> findAllByStudyAndCenter(@Param("naam_studie") String studie, @Param("naam_centrum") String centrum);

    /**
     * Geeft een lijst met alle unieke studienamen in alfabetische volgorde.
     * @return lijst van unieke studienamen
     */
    @Query("SELECT DISTINCT i.studie from Study i ORDER BY i.studie")
    List<String> findAllDistinctStudies();

    /**
     * Geeft een lijst met alle unieke centra in alfabetische volgorde
     * @return lijst van unieke centra
     */
    @Query("SELECT DISTINCT i.centrum FROM Study i ORDER BY i.centrum")
    List<String> findAllDistinctCentra();

    /**
     * Geeft een lijst met unieke studie namen voor een specifiek centrum
     * @param centrum naam van het centrum
     * @return lijst van studienamen
     */
    @Query("SELECT DISTINCT i.studie FROM Study i WHERE i.centrum = :naam_centrum ORDER BY i.studie")
    List<String> findAllDistinctStudiesFromCentrum(@Param("naam_centrum") String centrum);

    /**
     * Geeft een lijst met StudYDTO's met allen de doorloopdatums van alle fases
     * @return lijst van studyDTO objecten
     */
    @Query("SELECT new org.example.studie.StudyDTO(i.centrum, i.studie, i.startdatum, i.juridisch_start, " +
            "i.juridisch_eind, i.apotheek_start, i.apotheek_eind, i.metc_start, i.metc_eind, " +
            "i.lab_start, i.lab_eind,  i.initiatiedatum) FROM Study i")
    List<StudyDTO> findDoorlooptijd();

    /**
     * Haalt alle initiatiedatums op voor een bepaalde studie.
     * @param studie naam van de studie
     * @return lijst van initiatiedatums
     */
    @Query("SELECT i.initiatiedatum FROM Study i WHERE i.studie = :naam_studie ORDER BY i.initiatiedatum")
    List<LocalDate> findInitiatiedatum(@Param("naam_studie") String studie);


}
