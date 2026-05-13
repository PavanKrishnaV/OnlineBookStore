package com.bookstore.config;

import com.bookstore.model.Book;
import com.bookstore.model.User;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Initializes the database with sample books and a default admin user on startup.
 * This data is loaded into the H2 in-memory database each time the app starts.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        // Create default admin user
        if (!userRepository.existsByEmail("admin@bookstore.com")) {
            userRepository.save(new User("Admin", "admin@bookstore.com", "admin123", "ADMIN"));
        }
        // Create a demo customer
        if (!userRepository.existsByEmail("user@demo.com")) {
            userRepository.save(new User("Demo User", "user@demo.com", "user123", "USER"));
        }

        // Only seed books if database is empty
        if (bookRepository.count() > 0) return;

        // ── Fiction ──
        bookRepository.save(new Book(
            "The Great Gatsby", "F. Scott Fitzgerald",
            "A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan, set in the Jazz Age on Long Island. A masterpiece of American fiction exploring themes of decadence, idealism, and social upheaval.",
            599.0, 799.0, "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
            "Fiction", 4.5, 2847, 150, "9780743273565", "Scribner", 1925, 180, true
        ));
        bookRepository.save(new Book(
            "To Kill a Mockingbird", "Harper Lee",
            "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Through the young eyes of Scout and Jem Finch, Harper Lee explores racial injustice and moral growth.",
            499.0, 699.0, "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
            "Fiction", 4.8, 3521, 200, "9780061120084", "HarperCollins", 1960, 281, true
        ));

        // ── Science Fiction ──
        bookRepository.save(new Book(
            "1984", "George Orwell",
            "A dystopian masterpiece about a totalitarian regime that controls every aspect of life. Winston Smith struggles against the omnipresent surveillance of Big Brother in this chilling prophecy of the future.",
            399.0, 549.0, "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
            "Science Fiction", 4.7, 4102, 300, "9780451524935", "Signet Classics", 1949, 328, true
        ));
        bookRepository.save(new Book(
            "Dune", "Frank Herbert",
            "Set on the desert planet Arrakis, Dune is the story of Paul Atreides who would become the mysterious Muad'Dib. A sweeping tale of politics, religion, ecology, and human potential.",
            699.0, 899.0, "https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg",
            "Science Fiction", 4.6, 1893, 120, "9780441013593", "Ace Books", 1965, 688, false
        ));

        // ── Fantasy ──
        bookRepository.save(new Book(
            "The Hobbit", "J.R.R. Tolkien",
            "Bilbo Baggins enjoys a comfortable life until the wizard Gandalf and a company of dwarves arrive and whisk him away on an unexpected journey to reclaim a stolen treasure guarded by the dragon Smaug.",
            549.0, 749.0, "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
            "Fantasy", 4.7, 2567, 180, "9780547928227", "Mariner Books", 1937, 310, true
        ));
        bookRepository.save(new Book(
            "Harry Potter and the Sorcerer's Stone", "J.K. Rowling",
            "The first book in the beloved Harry Potter series. An orphaned boy discovers he is a wizard on his eleventh birthday and begins his magical education at Hogwarts School of Witchcraft and Wizardry.",
            799.0, 999.0, "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg",
            "Fantasy", 4.9, 5834, 250, "9780590353427", "Scholastic", 1997, 309, true
        ));

        // ── Mystery / Thriller ──
        bookRepository.save(new Book(
            "The Da Vinci Code", "Dan Brown",
            "A murder inside the Louvre and clues in Da Vinci paintings lead to the discovery of a religious mystery protected by a secret society for two thousand years. A breathtaking thriller of codes and conspiracy.",
            449.0, 599.0, "https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg",
            "Mystery", 4.1, 3210, 190, "9780307474278", "Anchor", 2003, 489, false
        ));
        bookRepository.save(new Book(
            "Gone Girl", "Gillian Flynn",
            "On the morning of their fifth wedding anniversary, Nick Dunne's wife Amy disappears. Under mounting pressure from the police and a media frenzy, Nick's portrait of a blissful union begins to crumble.",
            529.0, 699.0, "https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg",
            "Mystery", 4.3, 1876, 160, "9780307588371", "Crown Publishing", 2012, 432, false
        ));

        // ── Non-Fiction ──
        bookRepository.save(new Book(
            "Sapiens: A Brief History of Humankind", "Yuval Noah Harari",
            "A groundbreaking narrative of humanity's creation and evolution that explores how biology and history have defined us and enhanced our understanding of what it means to be human.",
            649.0, 849.0, "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
            "Non-Fiction", 4.6, 2934, 140, "9780062316097", "Harper", 2015, 464, true
        ));
        bookRepository.save(new Book(
            "Atomic Habits", "James Clear",
            "A revolutionary guide to building good habits and breaking bad ones. James Clear reveals practical strategies that will teach you how to make small changes that will transform your habits and deliver remarkable results.",
            499.0, 699.0, "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
            "Non-Fiction", 4.8, 4567, 220, "9780735211292", "Avery", 2018, 320, true
        ));

        // ── Romance ──
        bookRepository.save(new Book(
            "Pride and Prejudice", "Jane Austen",
            "The story of Elizabeth Bennet and Mr. Darcy navigating through manners, morality, education, and marriage in early 19th-century England. One of the most popular novels in English literature.",
            349.0, 499.0, "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
            "Romance", 4.7, 3890, 300, "9780141439518", "Penguin Classics", 1813, 279, false
        ));
        bookRepository.save(new Book(
            "The Notebook", "Nicholas Sparks",
            "A beautiful love story of Noah Calhoun and Allie Nelson. Set amid the austere beauty of the coastal South, this is a tender story of love found and love remembered, from the bestselling author.",
            399.0, 549.0, "https://covers.openlibrary.org/b/isbn/9781455582877-L.jpg",
            "Romance", 4.2, 2105, 170, "9781455582877", "Grand Central", 1996, 214, false
        ));

        System.out.println("Database initialized with " + bookRepository.count() + " sample books.");
    }
}
