package org.example.inclusie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository voor toegang tot de Inclusion entiteit
 *
 * @author Anne Beumer en Joost Goddijn
 * @version 1.5, 20-05-2025
 * @since 14-05-2025
 */
@Repository
public interface InclusionRepository extends JpaRepository<Inclusion, InclusionId> {

    /**
     * Haalt alle inclusies op voor een specifieke studie en centrum gesorteerd op aflopende datum
     *
     * @param naamStudie naam van de studie
     * @param naamCentrum naam van het centrum
     * @return lijst van Inclusion objecten
     */
    @Query("SELECT i FROM Inclusion i WHERE i.naam_studie = :naam_studie AND i.naam_centrum = :naam_centrum ORDER BY i.datum DESC")
    List<Inclusion> findAllByStudyAndCenterOrderByDatumDesc(@Param("naam_studie") String naamStudie, @Param("naam_centrum") String naamCentrum);

    /**
     * Haalt alle inclusies op voor een bepaalde studie als InclusionDTO gesorteerd op centrum en datum
     *
     * @param studie naam van de studie
     * @return lijst met InclusionDTO's
     */
    @Query("SELECT new org.example.inclusie.InclusionDTO(i.naam_studie, i.naam_centrum, i.datum, i.geincludeerd) " +
            "FROM Inclusion i " +
            "WHERE i.naam_studie = :studie " +
            "ORDER BY i.naam_centrum, i.datum")
    List<InclusionDTO> findInclusionByStudy(@Param("studie") String studie);

    /**
     * Haalt alle inclusies op voor een bepaald centrum als InclusionDTO gesorteerd op studie en datum
     *
     * @param centrum naam van het centrum
     * @return lijst van InclusionDTO's
     */
    @Query("SELECT new org.example.inclusie.InclusionDTO(i.naam_studie, i.naam_centrum, i.datum, i.geincludeerd) " +
            "FROM Inclusion i " +
            "WHERE i.naam_centrum = :centrum " +
            "ORDER BY i.naam_studie, i.datum")
    List<InclusionDTO> findInclusionByCentrum(@Param("centrum") String centrum);

    /**
     * Haalt de meest recente inclusie op voor een specifieke studie en centrum
     *
     * @param studie naam van de studie
     * @param centrum naam van het centrum
     * @return lijst van Inclusion objecten gesorteerd op aflopende datum
     */
    @Query("SELECT i FROM Inclusion i WHERE i.naam_studie = :studie AND i.naam_centrum = :centrum ORDER BY i.datum DESC")
    List<Inclusion> findMostRecent(@Param("studie") String studie, @Param("centrum") String centrum);
}