package com.bookstore.controller;

import com.bookstore.model.CartItem;
import com.bookstore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for shopping cart operations.
 * Handles adding, updating, removing cart items.
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // GET /api/cart?userId={userId} - Get cart items for a user
    @GetMapping
    public List<CartItem> getCartItems(@RequestParam Long userId) {
        return cartService.getCartItems(userId);
    }

    // POST /api/cart - Add item to cart
    // Request body: { "userId": 1, "bookId": 1, "quantity": 1 }
    @PostMapping
    public CartItem addToCart(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Long bookId = Long.valueOf(request.get("bookId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        return cartService.addToCart(userId, bookId, quantity);
    }

    // PUT /api/cart/{id} - Update cart item quantity
    // Request body: { "quantity": 3 }
    @PutMapping("/{id}")
    public CartItem updateQuantity(@PathVariable Long id, @RequestBody Map<String, Integer> request) {
        return cartService.updateQuantity(id, request.get("quantity"));
    }

    // DELETE /api/cart/{id} - Remove item from cart
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/cart/clear/{userId} - Clear all cart items for a user
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }
}
