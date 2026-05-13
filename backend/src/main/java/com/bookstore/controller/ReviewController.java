package com.bookstore.controller;

import com.bookstore.model.Review;
import com.bookstore.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for book review operations.
 * Handles fetching and adding reviews for books.
 */
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // GET /api/reviews/book/{bookId} - Get all reviews for a book
    @GetMapping("/book/{bookId}")
    public List<Review> getBookReviews(@PathVariable Long bookId) {
        return reviewService.getBookReviews(bookId);
    }

    // POST /api/reviews - Add a new review
    @PostMapping
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }
}
