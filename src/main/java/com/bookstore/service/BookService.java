package com.bookstore.service;

import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Service layer for Book-related business logic.
 * Handles CRUD operations, search, and category filtering.
 */
@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    // Get all books
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Get a single book by ID
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    // Search books by title or author
    public List<Book> searchBooks(String query) {
        return bookRepository.searchBooks(query);
    }

    // Get books by category
    public List<Book> getBooksByCategory(String category) {
        return bookRepository.findByCategory(category);
    }

    // Get featured books for homepage carousel
    public List<Book> getFeaturedBooks() {
        return bookRepository.findByFeaturedTrue();
    }

    // Get all available categories
    public List<String> getAllCategories() {
        return bookRepository.findAllCategories();
    }

    // Add a new book (Admin)
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    // Update an existing book (Admin)
    public Book updateBook(Long id, Book updatedBook) {
        return bookRepository.findById(id).map(book -> {
            book.setTitle(updatedBook.getTitle());
            book.setAuthor(updatedBook.getAuthor());
            book.setDescription(updatedBook.getDescription());
            book.setPrice(updatedBook.getPrice());
            book.setOriginalPrice(updatedBook.getOriginalPrice());
            book.setImageUrl(updatedBook.getImageUrl());
            book.setCategory(updatedBook.getCategory());
            book.setStock(updatedBook.getStock());
            book.setIsbn(updatedBook.getIsbn());
            book.setPublisher(updatedBook.getPublisher());
            book.setPublishedYear(updatedBook.getPublishedYear());
            book.setPages(updatedBook.getPages());
            book.setFeatured(updatedBook.getFeatured());
            return bookRepository.save(book);
        }).orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    // Delete a book (Admin)
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}
