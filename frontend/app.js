/* ============================================
   Online Bookstore - Frontend Logic (app.js)
   ============================================ */

const API_URL = 'http://localhost:8088/api';
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let cart = [];

// DOM Elements
const bookGrid = document.getElementById('bookGrid');
const bookSearch = document.getElementById('bookSearch');
const categoryFilters = document.getElementById('categoryFilters');
const cartBadge = document.getElementById('cartBadge');
const themeToggle = document.getElementById('themeToggle');
const authLinks = document.getElementById('authLinks');
const userProfile = document.getElementById('userProfile');
const userNameDisplay = document.getElementById('userNameDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    updateUserUI();
    initTheme();
    
    // Event Listeners
    bookSearch.addEventListener('input', debounce(handleSearch, 500));
    categoryFilters.addEventListener('click', handleFilter);
    themeToggle.addEventListener('click', toggleTheme);
    logoutBtn.addEventListener('click', logout);
    closeModal.addEventListener('click', () => modalOverlay.style.display = 'none');
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('signupBtn').addEventListener('click', showSignupModal);
    document.getElementById('cartBtn').addEventListener('click', showCartModal);
});

// ============================================
// Data Fetching
// ============================================

async function fetchBooks() {
    try {
        const response = await fetch(`${API_URL}/books`);
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        bookGrid.innerHTML = '<p class="error">Failed to load books. Please ensure backend is running.</p>';
    }
}

async function handleSearch() {
    const query = bookSearch.value;
    if (!query) return fetchBooks();
    
    try {
        const response = await fetch(`${API_URL}/books/search?query=${query}`);
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Search error:', error);
    }
}

async function handleFilter(e) {
    if (!e.target.classList.contains('filter-btn')) return;
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    const category = e.target.dataset.category;
    if (category === 'all') return fetchBooks();
    
    try {
        const response = await fetch(`${API_URL}/books/category/${category}`);
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Filter error:', error);
    }
}

// ============================================
// UI Rendering
// ============================================

function renderBooks(books) {
    if (books.length === 0) {
        bookGrid.innerHTML = '<p class="no-results">No books found matching your criteria.</p>';
        return;
    }

    bookGrid.innerHTML = books.map(book => `
        <div class="book-card">
            <div class="book-image">
                <img src="${book.imageUrl}" alt="${book.title}">
                ${book.featured ? '<span class="book-badge">Featured</span>' : ''}
            </div>
            <div class="book-details">
                <div class="book-category">${book.category}</div>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <div class="book-price-row">
                    <span class="price">₹${book.price}</span>
                    <span class="rating"><i class="fas fa-star"></i> ${book.rating}</span>
                </div>
                <div class="book-actions">
                    <button class="btn btn-view btn-sm" onclick="showBookDetails(${book.id})">Details</button>
                    <button class="btn btn-add btn-sm" onclick="addToCart(${book.id})">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// Cart Logic
// ============================================

async function addToCart(bookId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                bookId: bookId,
                quantity: 1
            })
        });
        
        if (response.ok) {
            updateCartBadge();
            showNotification('Book added to cart!');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
    }
}

async function updateCartBadge() {
    if (!currentUser) {
        cartBadge.innerText = '0';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/cart?userId=${currentUser.id}`);
        const items = await response.json();
        cartBadge.innerText = items.length;
    } catch (error) {
        console.error('Error updating badge:', error);
    }
}

async function showCartModal() {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart?userId=${currentUser.id}`);
        const items = await response.json();
        
        let total = items.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
        
        modalBody.innerHTML = `
            <h2 style="margin-bottom:20px;">Your Shopping Cart</h2>
            <div class="cart-list" style="max-height:400px; overflow-y:auto; margin-bottom:20px;">
                ${items.length === 0 ? '<p>Your cart is empty.</p>' : items.map(item => `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid #eee;">
                        <div style="display:flex; gap:15px; align-items:center;">
                            <img src="${item.book.imageUrl}" style="width:50px; height:70px; object-fit:cover; border-radius:4px;">
                            <div>
                                <h4 style="margin:0;">${item.book.title}</h4>
                                <small>${item.quantity} x ₹${item.book.price}</small>
                            </div>
                        </div>
                        <button onclick="removeFromCart(${item.id})" style="color:var(--danger); background:none;"><i class="fas fa-trash"></i></button>
                    </div>
                `).join('')}
            </div>
            ${items.length > 0 ? `
                <div style="display:flex; justify-content:space-between; font-weight:700; font-size:1.2rem; margin-bottom:20px;">
                    <span>Total:</span>
                    <span>₹${total}</span>
                </div>
                <button class="btn btn-primary" style="width:100%;" onclick="showCheckoutModal()">Proceed to Checkout</button>
            ` : '<button class="btn btn-primary" style="width:100%;" onclick="modalOverlay.style.display=\'none\'">Start Shopping</button>'}
        `;
        modalOverlay.style.display = 'flex';
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

async function removeFromCart(itemId) {
    try {
        await fetch(`${API_URL}/cart/${itemId}`, { method: 'DELETE' });
        showCartModal(); // Refresh cart modal
        updateCartBadge();
    } catch (error) {
        console.error('Error removing item:', error);
    }
}

// ============================================
// Auth Logic
// ============================================

function showLoginModal() {
    modalBody.innerHTML = `
        <h2 style="margin-bottom:20px;">Login to BookVerse</h2>
        <form id="loginForm" onsubmit="handleLogin(event)">
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px;">Email</label>
                <input type="email" id="loginEmail" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
            </div>
            <div style="margin-bottom:20px;">
                <label style="display:block; margin-bottom:5px;">Password</label>
                <input type="password" id="loginPass" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;">Login</button>
            <p style="text-align:center; margin-top:15px;">Don't have an account? <a href="#" onclick="showSignupModal()" style="color:var(--primary);">Sign Up</a></p>
        </form>
    `;
    modalOverlay.style.display = 'flex';
}

function showSignupModal() {
    modalBody.innerHTML = `
        <h2 style="margin-bottom:20px;">Join BookVerse</h2>
        <form id="signupForm" onsubmit="handleSignup(event)">
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px;">Full Name</label>
                <input type="text" id="regName" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px;">Email</label>
                <input type="email" id="regEmail" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
            </div>
            <div style="margin-bottom:20px;">
                <label style="display:block; margin-bottom:5px;">Password</label>
                <input type="password" id="regPass" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;">Create Account</button>
        </form>
    `;
    modalOverlay.style.display = 'flex';
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPass').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateUserUI();
            modalOverlay.style.display = 'none';
            showNotification('Welcome back, ' + currentUser.name + '!');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPass').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateUserUI();
            modalOverlay.style.display = 'none';
            showNotification('Registration successful!');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Signup error:', error);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('user');
    updateUserUI();
    showNotification('Logged out successfully');
}

function updateUserUI() {
    if (currentUser) {
        authLinks.style.display = 'none';
        userProfile.style.display = 'flex';
        userNameDisplay.innerText = currentUser.name;
        updateCartBadge();
    } else {
        authLinks.style.display = 'flex';
        userProfile.style.display = 'none';
        cartBadge.innerText = '0';
    }
}

// ============================================
// Utilities
// ============================================

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

function showNotification(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; 
        background: var(--primary); color: white; 
        padding: 12px 25px; border-radius: 30px; 
        box-shadow: var(--shadow-lg); z-index: 3000;
        animation: fadeInUp 0.3s ease;
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}
