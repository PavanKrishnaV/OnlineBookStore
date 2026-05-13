package com.bookstore.repository;

import com.bookstore.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Review entity CRUD operations.
 * Provides methods to fetch reviews for specific books.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Get all reviews for a specific book (newest first)
    List<Review> findByBookIdOrderByCreatedAtDesc(Long bookId);
}
