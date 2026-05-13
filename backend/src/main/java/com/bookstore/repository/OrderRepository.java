package com.bookstore.repository;

import com.bookstore.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Order entity CRUD operations.
 * Supports fetching orders by user or by status.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Get all orders for a specific user
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Get all orders sorted by creation date (for admin)
    List<Order> findAllByOrderByCreatedAtDesc();
}
