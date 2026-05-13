package com.bookstore.service;

import com.bookstore.model.CartItem;
import com.bookstore.model.Book;
import com.bookstore.repository.CartItemRepository;
import com.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Service layer for shopping cart operations.
 * Handles adding, updating, removing items and clearing the cart.
 */
@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private BookRepository bookRepository;

    // Get all cart items for a user
    public List<CartItem> getCartItems(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    // Add a book to the cart (or increase quantity if already present)
    public CartItem addToCart(Long userId, Long bookId, Integer quantity) {
        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndBookId(userId, bookId);

        if (existingItem.isPresent()) {
            // Update quantity of existing item
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        } else {
            // Add new item to cart
            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
            CartItem newItem = new CartItem(userId, book, quantity);
            return cartItemRepository.save(newItem);
        }
    }

    // Update cart item quantity
    public CartItem updateQuantity(Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    // Remove a single item from cart
    public void removeFromCart(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    // Clear all items from a user's cart (used after checkout)
    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
