package com.bookstore.repository;

import com.bookstore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for User entity CRUD operations.
 * Spring Data JPA auto-generates the implementation at runtime.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used for login and duplicate check)
    Optional<User> findByEmail(String email);

    // Check if email already exists (used during registration)
    boolean existsByEmail(String email);
}
