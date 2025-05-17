package org.example.studie;
import org.example.inclusie.Inclusion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyRepository extends JpaRepository<Study, StudyId>{
    @Query("SELECT i FROM Study i WHERE i.studie = :naam_studie AND i.centrum = :naam_centrum")
    List<Study> findAllByStudyAndCenter(@Param("naam_studie") String studie, @Param("naam_centrum") String centrum);

    @Query("SELECT DISTINCT i.studie from Study i")
    List<String> findAllDistinctStudies();
}
