package org.example.user;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;


public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByUsername(String username);
    List<User> findAllByRole(String role);
    Optional<User> findByStudie(String studie);
}
