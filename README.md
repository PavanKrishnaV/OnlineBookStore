# BookVerse - Professional Full Stack Online Bookstore

A modern, responsive, and fully functional online bookstore built with **Java Spring Boot** and **Vanilla JavaScript**.

## 🚀 Features
- **Modern UI:** Clean design with smooth animations and dark/light mode toggle.
- **Dynamic Catalog:** Browse books by category, search by title/author.
- **Shopping Cart:** Add/remove items, quantity management, and total calculation.
- **Authentication:** Login and Signup system (Session handled via LocalStorage/State).
- **Checkout:** Order placement with shipping details.
- **Admin Ready:** REST APIs for adding, updating, and deleting books.
- **Sample Data:** Comes pre-loaded with 12 books across 6 categories.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6 Fetch API)
- **Backend:** Java 17+, Spring Boot 3.2.5, Spring Data JPA, REST API
- **Database:** H2 (In-memory for easy demo) or MySQL (Configurable)
- **Build Tool:** Maven

## 📂 Project Structure
```text
Minor Project 2/
├── backend/
│   ├── src/main/java/com/bookstore/   # Spring Boot Source
│   └── pom.xml                        # Maven Dependencies
└── frontend/
    ├── index.html                     # Main UI
    ├── style.css                      # Design & Styles
    └── app.js                         # API & UI Logic
```

## 🏁 How to Run

### 1. Start the Backend
1. Open a terminal in the `backend` folder.
2. Run: `mvn spring-boot:run`
3. Wait until you see: `Online Bookstore is running!`
4. API Base: `http://localhost:8080/api`
5. DB Console: `http://localhost:8080/h2-console` (User: `sa`, Pass: empty)

### 2. Start the Frontend
1. Open `frontend/index.html` in any modern web browser.
2. Alternatively, use a "Live Server" extension in VS Code.

## 🧪 Default Login Credentials
- **Admin:** `admin@bookstore.com` / `admin123`
- **Demo User:** `user@demo.com` / `user123`

## 📝 Database Setup (MySQL - Optional)
To switch from H2 to MySQL:
1. Open `backend/src/main/resources/application.properties`.
2. Comment out the H2 section.
3. Uncomment the MySQL section and update your credentials.
4. Restart the backend.
