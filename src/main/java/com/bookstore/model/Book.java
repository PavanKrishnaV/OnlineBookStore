package com.bookstore.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Book entity representing a book in the bookstore catalog.
 * Contains all book details including pricing, categorization, and ratings.
 */
@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(name = "original_price")
    private Double originalPrice;

    @Column(name = "image_url")
    private String imageUrl;

    private String category;

    private Double rating = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    private Integer stock = 100;

    private String isbn;

    private String publisher;

    @Column(name = "published_year")
    private Integer publishedYear;

    private Integer pages;

    private Boolean featured = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Default constructor required by JPA
    public Book() {}

    public Book(String title, String author, String description, Double price,
                Double originalPrice, String imageUrl, String category, Double rating,
                Integer ratingCount, Integer stock, String isbn, String publisher,
                Integer publishedYear, Integer pages, Boolean featured) {
        this.title = title;
        this.author = author;
        this.description = description;
        this.price = price;
        this.originalPrice = originalPrice;
        this.imageUrl = imageUrl;
        this.category = category;
        this.rating = rating;
        this.ratingCount = ratingCount;
        this.stock = stock;
        this.isbn = isbn;
        this.publisher = publisher;
        this.publishedYear = publishedYear;
        this.pages = pages;
        this.featured = featured;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getRatingCount() { return ratingCount; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public Integer getPublishedYear() { return publishedYear; }
    public void setPublishedYear(Integer publishedYear) { this.publishedYear = publishedYear; }

    public Integer getPages() { return pages; }
    public void setPages(Integer pages) { this.pages = pages; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
