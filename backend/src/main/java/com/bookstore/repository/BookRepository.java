package com.bookstore.repository;

import com.bookstore.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for Book entity CRUD operations.
 * Includes custom queries for search, category filtering, and featured books.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // Search books by title or author (case-insensitive)
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Book> searchBooks(@Param("query") String query);

    // Get books by category
    List<Book> findByCategory(String category);

    // Get featured books
    List<Book> findByFeaturedTrue();

    // Get all distinct categories
    @Query("SELECT DISTINCT b.category FROM Book b")
    List<String> findAllCategories();
}
