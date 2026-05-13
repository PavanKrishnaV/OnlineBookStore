package com.bookstore.repository;

import com.bookstore.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository for CartItem CRUD operations.
 * Provides methods to manage user-specific cart items.
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Get all cart items for a specific user
    List<CartItem> findByUserId(Long userId);

    // Find a specific book in user's cart
    Optional<CartItem> findByUserIdAndBookId(Long userId, Long bookId);

    // Remove all cart items for a user (used after checkout)
    void deleteByUserId(Long userId);
}
