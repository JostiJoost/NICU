package org.example.protocol;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Repository voor het beheren van protocol entiteiten
 *
 * @author Joost Goddijn
 * @version 1.3, 22-05-2025
 * @since 14-05-2025
 */
public interface ProtocolRepository extends JpaRepository<Protocol, String> {

    /**
     * Haalt het aantal protocollen per centrum op
     * @return een lijst waarbij index 0 het centrum is en index 1 het aantal prtocollen
     */
    @Query("SELECT i.naamCentrum, COUNT (i) FROM Protocol i GROUP BY i.naamCentrum ORDER BY i.naamCentrum")
    List<Object[]> findProtocolCount();

    /**
     * Haalt het aantal geaccordeerde protcollen per centrum op.
     * @return een lijst waarbij index 0 het centrum is en index 1 het aan geaccordeerde protocollen is
     */
    @Query("SELECT i.naamCentrum, COUNT (i) FROM Protocol i WHERE i.datumAccordering IS NOT NULL GROUP BY i.naamCentrum ORDER BY i.naamCentrum")
    List<Object[]> findProtocolFinishedCount();

    /**
     * Haalt een lijst van datums op van alle protocolen, met bijbehorende aanvraagdatum, eerste versie en accordering.
     * @return een lijst met datumvelden per protocol
     */
    @Query("SELECT new org.example.protocol.ProtocolDTO(i.naamCentrum, i.naamProtocol, i.datumAanvraag, i.datumEersteVersie, i.datumAccordering) " +
            "FROM Protocol i ORDER BY i.naamCentrum")
    List<ProtocolDTO> findAllDatums();
}
