package com.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Online Bookstore Spring Boot application.
 * Starts the embedded server and initializes all components.
 */
@SpringBootApplication
public class BookstoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookstoreApplication.class, args);
        System.out.println("===========================================");
        System.out.println("  Online Bookstore is running!");
        System.out.println("  Backend API: http://localhost:8080/api");
        System.out.println("  H2 Console:  http://localhost:8080/h2-console");
        System.out.println("===========================================");
    }
}
