package com.bookstore.service;

import com.bookstore.model.Book;
import com.bookstore.model.Review;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service layer for book review operations.
 * Handles adding reviews and updating book average ratings.
 */
@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookRepository bookRepository;

    // Get all reviews for a book
    public List<Review> getBookReviews(Long bookId) {
        return reviewRepository.findByBookIdOrderByCreatedAtDesc(bookId);
    }

    // Add a new review and update book's average rating
    public Review addReview(Review review) {
        Review savedReview = reviewRepository.save(review);

        // Recalculate and update the book's average rating
        List<Review> allReviews = reviewRepository.findByBookIdOrderByCreatedAtDesc(review.getBookId());
        double avgRating = allReviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Book book = bookRepository.findById(review.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        book.setRating(Math.round(avgRating * 10.0) / 10.0); // Round to 1 decimal
        book.setRatingCount(allReviews.size());
        bookRepository.save(book);

        return savedReview;
    }
}
