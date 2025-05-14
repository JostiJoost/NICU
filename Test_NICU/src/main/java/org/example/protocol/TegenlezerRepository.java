package org.example.protocol;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TegenlezerRepository extends JpaRepository<Tegenlezer, TegenlezerId> {
    List<Tegenlezer> findBynaamProtocol(String naamProtocol);
}
