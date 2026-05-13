package com.bookstore.service;

import com.bookstore.model.User;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Service layer for user authentication.
 * Handles registration, login validation, and user lookup.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Register a new user
    public Map<String, Object> register(User user) {
        Map<String, Object> response = new HashMap<>();

        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already registered. Please login instead.");
            return response;
        }

        // Set default role if not specified
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        // Save the new user
        User savedUser = userRepository.save(user);

        response.put("success", true);
        response.put("message", "Registration successful!");
        response.put("user", createUserResponse(savedUser));
        return response;
    }

    // Login with email and password
    public Map<String, Object> login(String email, String password) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "No account found with this email.");
            return response;
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Incorrect password. Please try again.");
            return response;
        }

        response.put("success", true);
        response.put("message", "Login successful!");
        response.put("user", createUserResponse(user));
        return response;
    }

    // Helper: Create a safe user response (no password)
    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());
        return userData;
    }
}
