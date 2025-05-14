package org.example.inclusie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InclusionRepository extends JpaRepository<Inclusion, InclusionId>{

    @Query("SELECT i FROM Inclusion i WHERE i.naam_studie = :naam_studie AND i.naam_centrum = :naam_centrum ORDER BY i.datum DESC")
    List<Inclusion> findAllByStudyAndCenterOrderByDatumDesc(@Param("naam_studie") String naamStudie, @Param("naam_centrum") String naamCentrum);
}
