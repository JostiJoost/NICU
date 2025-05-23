package org.example.protocol;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository voor het beteren van tegenlezer entiteit
 *
 * @author Anne Beumer
 * @version 1.0
 * @since 14-05-2025
 */
public interface TegenlezerRepository extends JpaRepository<Tegenlezer, TegenlezerId> {
    List<Tegenlezer> findBynaamProtocol(String naamProtocol);
}
