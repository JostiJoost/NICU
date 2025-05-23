package org.example.protocol;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProtocolRepository extends JpaRepository<Protocol, String> {
    @Query("SELECT i.naamCentrum, COUNT (i) FROM Protocol i GROUP BY i.naamCentrum ORDER BY i.naamCentrum")
    List<Object[]> findProtocolCount();

    @Query("SELECT i.naamCentrum, COUNT (i) FROM Protocol i WHERE i.datumAccordering IS NOT NULL GROUP BY i.naamCentrum ORDER BY i.naamCentrum")
    List<Object[]> findProtocolFinishedCount();

    @Query("SELECT new org.example.protocol.ProtocolDTO(i.naamCentrum, i.naamProtocol, i.datumAanvraag, i.datumEersteVersie, i.datumAccordering) " +
            "FROM Protocol i ORDER BY i.naamCentrum")
    List<ProtocolDTO> findAllDatums();
}
