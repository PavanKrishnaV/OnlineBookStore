package com.bookstore.service;

import com.bookstore.model.*;
import com.bookstore.repository.CartItemRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service layer for order processing.
 * Converts cart items into orders and manages order lifecycle.
 */
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    // Place a new order from the user's cart
    @Transactional
    public Order placeOrder(Order orderRequest) {
        Long userId = orderRequest.getUserId();

        // Get user info
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get cart items
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty. Add items before checkout.");
        }

        // Create the order
        Order order = new Order();
        order.setUserId(userId);
        order.setUserName(user.getName());
        order.setUserEmail(user.getEmail());
        order.setShippingAddress(orderRequest.getShippingAddress());
        order.setCity(orderRequest.getCity());
        order.setState(orderRequest.getState());
        order.setZipCode(orderRequest.getZipCode());
        order.setPhone(orderRequest.getPhone());
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setStatus("CONFIRMED");

        // Convert cart items to order items and calculate total
        double totalAmount = 0;
        for (CartItem cartItem : cartItems) {
            Book book = cartItem.getBook();
            OrderItem orderItem = new OrderItem(
                order, book.getId(), book.getTitle(), book.getAuthor(),
                book.getImageUrl(), cartItem.getQuantity(), book.getPrice()
            );
            order.getItems().add(orderItem);
            totalAmount += book.getPrice() * cartItem.getQuantity();
        }
        order.setTotalAmount(totalAmount);

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Clear the cart after successful order
        cartItemRepository.deleteByUserId(userId);

        return savedOrder;
    }

    // Get all orders for a specific user
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Get all orders (Admin)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    // Update order status (Admin)
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
