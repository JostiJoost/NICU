package org.example.studie;
import org.example.inclusie.Inclusion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudyRepository extends JpaRepository<Study, StudyId>{
    List<Study> findByStudieIgnoreCaseAndCentrumIgnoreCase(String studie, String centrum);

    @Query("SELECT i FROM Study i WHERE i.studie = :naam_studie AND i.centrum = :naam_centrum")
    List<Study> findAllByStudyAndCenter(@Param("naam_studie") String studie, @Param("naam_centrum") String centrum);

    @Query("SELECT DISTINCT i.studie from Study i ORDER BY i.studie")
    List<String> findAllDistinctStudies();

    @Query("SELECT DISTINCT i.centrum FROM Study i ORDER BY i.centrum")
    List<String> findAllDistinctCentra();

    @Query("SELECT DISTINCT i.studie FROM Study i WHERE i.centrum = :naam_centrum ORDER BY i.studie")
    List<String> findAllDistinctStudiesFromCentrum(@Param("naam_centrum") String centrum);

    @Query("SELECT new org.example.studie.StudyDTO(i.centrum, i.studie, i.startdatum, i.juridisch_start, " +
            "i.juridisch_eind, i.apotheek_start, i.apotheek_eind, i.metc_start, i.metc_eind, " +
            "i.lab_start, i.lab_eind,  i.initiatiedatum) FROM Study i")
    List<StudyDTO> findDoorlooptijd();

    @Query("SELECT i.initiatiedatum FROM Study i WHERE i.studie = :naam_studie ORDER BY i.initiatiedatum")
    List<LocalDate> findInitiatiedatum(@Param("naam_studie") String studie);


}
