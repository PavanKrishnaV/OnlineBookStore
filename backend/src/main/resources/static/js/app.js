/* ================================================
   BookVerse - Shared Application Logic (app.js)
   ================================================ */

const API = '/api';
let currentUser = JSON.parse(localStorage.getItem('bookverse_user')) || null;

// ============ Init ============
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderAuthArea();
    updateCartBadge();

    // Theme toggle (present on every page)
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Modal close
    const mc = document.getElementById('modalClose');
    if (mc) mc.addEventListener('click', closeModal);
    const mo = document.getElementById('modal');
    if (mo) mo.addEventListener('click', e => { if (e.target === mo) closeModal(); });

    // Home page specific
    const heroSearch = document.getElementById('heroSearch');
    if (heroSearch) {
        heroSearch.addEventListener('input', debounce(() => {
            const q = heroSearch.value.trim();
            if (q.length === 0) fetchBooks();
            else searchBooks(q);
        }, 400));
    }

    const catGrid = document.getElementById('categoryFilters');
    if (catGrid) catGrid.addEventListener('click', handleCategoryClick);

    // Load books if on home page
    if (document.getElementById('bookGrid')) {
        fetchBooks();
    }
});

// ============ Books API ============
async function fetchBooks() {
    try {
        const res = await fetch(`${API}/books`);
        const books = await res.json();
        document.getElementById('totalBooks').textContent = books.length;
        renderBookGrid(books);
    } catch (err) {
        document.getElementById('bookGrid').innerHTML =
            '<p class="loader" style="color:var(--danger)">Could not load books. Is the backend running?</p>';
    }
}

async function searchBooks(query) {
    const res = await fetch(`${API}/books/search?query=${encodeURIComponent(query)}`);
    const books = await res.json();
    document.getElementById('gridTitle').textContent = `Search: "${query}"`;
    document.getElementById('gridSubtitle').textContent = `${books.length} result(s) found`;
    renderBookGrid(books);
}

function handleCategoryClick(e) {
    const card = e.target.closest('.category-card');
    if (!card) return;
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const cat = card.dataset.cat;
    if (cat === 'all') {
        document.getElementById('gridTitle').textContent = 'All Books';
        document.getElementById('gridSubtitle').textContent = 'Showing all available books';
        fetchBooks();
    } else {
        fetch(`${API}/books/category/${encodeURIComponent(cat)}`).then(r => r.json()).then(books => {
            document.getElementById('gridTitle').textContent = cat;
            document.getElementById('gridSubtitle').textContent = `${books.length} book(s) in ${cat}`;
            renderBookGrid(books);
        });
    }
}

function renderBookGrid(books) {
    const grid = document.getElementById('bookGrid');
    if (!books.length) { grid.innerHTML = '<p class="loader">No books found.</p>'; return; }
    grid.innerHTML = books.map((b, i) => `
        <div class="book-card fade-in" style="animation-delay:${i * .05}s">
            <div class="book-img">
                <img src="${b.imageUrl}" alt="${b.title}" onerror="this.src='https://via.placeholder.com/260x320?text=No+Cover'">
                ${b.featured ? '<span class="book-featured"><i class="fas fa-star"></i> Featured</span>' : ''}
            </div>
            <div class="book-info">
                <div class="book-cat">${b.category || ''}</div>
                <div class="book-title" title="${b.title}">${b.title}</div>
                <div class="book-author">by ${b.author}</div>
                <div class="book-meta">
                    <span class="book-price">₹${b.price}<span class="original">${b.originalPrice ? '₹' + b.originalPrice : ''}</span></span>
                    <span class="book-rating"><i class="fas fa-star"></i> ${b.rating || 0}</span>
                </div>
                <div class="book-actions">
                    <button class="btn btn-secondary btn-sm" onclick="viewBook(${b.id})"><i class="fas fa-eye"></i> Details</button>
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${b.id})"><i class="fas fa-cart-plus"></i> Add</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============ Book Details Modal ============
async function viewBook(id) {
    const book = await fetch(`${API}/books/${id}`).then(r => r.json());
    const reviews = await fetch(`${API}/reviews/book/${id}`).then(r => r.json());

    document.getElementById('modalBody').innerHTML = `
        <div style="display:flex;gap:20px;flex-wrap:wrap">
            <img src="${book.imageUrl}" style="width:160px;height:220px;object-fit:cover;border-radius:10px;flex-shrink:0" onerror="this.src='https://via.placeholder.com/160x220?text=No+Cover'">
            <div style="flex:1;min-width:200px">
                <div class="book-cat">${book.category}</div>
                <h2 style="margin-bottom:4px">${book.title}</h2>
                <p style="color:var(--text-muted);margin-bottom:10px">by ${book.author}</p>
                <p style="margin-bottom:12px;font-size:.9rem">${book.description || ''}</p>
                <div style="display:flex;gap:16px;align-items:center;margin-bottom:16px">
                    <span class="book-price" style="font-size:1.5rem">₹${book.price}</span>
                    <span class="book-rating"><i class="fas fa-star"></i> ${book.rating} (${book.ratingCount} reviews)</span>
                </div>
                <div style="display:flex;gap:10px;flex-wrap:wrap">
                    <button class="btn btn-primary" onclick="addToCart(${book.id})"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                    <button class="btn btn-accent" onclick="addToCart(${book.id});window.location='/cart.html'"><i class="fas fa-bolt"></i> Buy Now</button>
                </div>
            </div>
        </div>
        <hr style="margin:20px 0;border:0;border-top:1px solid var(--border)">
        <h3 style="margin-bottom:12px">Reviews (${reviews.length})</h3>
        ${currentUser ? `
            <div style="margin-bottom:16px;display:flex;gap:10px">
                <select id="revRating" style="padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text)">
                    <option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option>
                    <option value="3">⭐⭐⭐</option><option value="2">⭐⭐</option><option value="1">⭐</option>
                </select>
                <input id="revComment" placeholder="Write a review..." style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text)">
                <button class="btn btn-primary btn-sm" onclick="submitReview(${book.id})">Post</button>
            </div>
        ` : '<p style="color:var(--text-muted);margin-bottom:12px">Login to write a review.</p>'}
        <div id="reviewsList">
            ${reviews.length === 0 ? '<p style="color:var(--text-muted)">No reviews yet.</p>' :
              reviews.map(r => `
                <div style="background:var(--bg);padding:12px 16px;border-radius:10px;margin-bottom:8px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                        <strong>${r.userName}</strong>
                        <span class="book-rating"><i class="fas fa-star"></i> ${r.rating}</span>
                    </div>
                    <p style="font-size:.9rem;color:var(--text-muted)">${r.comment || ''}</p>
                </div>
            `).join('')}
        </div>
    `;
    openModal();
}

async function submitReview(bookId) {
    const rating = parseInt(document.getElementById('revRating').value);
    const comment = document.getElementById('revComment').value;
    await fetch(`${API}/reviews`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, userId: currentUser.id, userName: currentUser.name, rating, comment })
    });
    toast('Review posted!');
    viewBook(bookId); // refresh
}

// ============ Cart ============
async function addToCart(bookId) {
    if (!currentUser) { showLogin(); return; }
    await fetch(`${API}/cart`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, bookId, quantity: 1 })
    });
    updateCartBadge();
    toast('Added to cart!');
}

async function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    if (!currentUser) { badge.textContent = '0'; return; }
    try {
        const items = await fetch(`${API}/cart?userId=${currentUser.id}`).then(r => r.json());
        badge.textContent = items.length;
    } catch { badge.textContent = '0'; }
}

// ============ Auth ============
function renderAuthArea() {
    const area = document.getElementById('authArea');
    if (!area) return;
    if (currentUser) {
        area.innerHTML = `
            <div class="user-pill">
                <i class="fas fa-user-circle"></i> ${currentUser.name}
                <button class="icon-btn" onclick="logout()" title="Logout"><i class="fas fa-sign-out-alt"></i></button>
            </div>`;
    } else {
        area.innerHTML = `
            <button class="auth-btn auth-btn-outline" onclick="showLogin()">Login</button>
            <button class="auth-btn auth-btn-fill" onclick="showSignup()">Sign Up</button>`;
    }
}

function showLogin() {
    document.getElementById('modalBody').innerHTML = `
        <h2 style="margin-bottom:20px">Login to BookVerse</h2>
        <form onsubmit="handleLogin(event)">
            <div class="form-group"><label>Email</label><input type="email" id="loginEmail" required placeholder="e.g. user@demo.com"></div>
            <div class="form-group"><label>Password</label><input type="password" id="loginPass" required placeholder="e.g. user123"></div>
            <button class="btn btn-primary btn-block" type="submit">Login</button>
            <p style="text-align:center;margin-top:14px;font-size:.9rem">No account? <a href="#" style="color:var(--primary);font-weight:600" onclick="showSignup()">Sign Up</a></p>
        </form>`;
    openModal();
}

function showSignup() {
    document.getElementById('modalBody').innerHTML = `
        <h2 style="margin-bottom:20px">Create Account</h2>
        <form onsubmit="handleSignup(event)">
            <div class="form-group"><label>Full Name</label><input type="text" id="regName" required></div>
            <div class="form-group"><label>Email</label><input type="email" id="regEmail" required></div>
            <div class="form-group"><label>Password</label><input type="password" id="regPass" required></div>
            <button class="btn btn-primary btn-block" type="submit">Create Account</button>
        </form>`;
    openModal();
}

async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: document.getElementById('loginEmail').value, password: document.getElementById('loginPass').value })
    });
    const data = await res.json();
    if (data.success) {
        currentUser = data.user;
        localStorage.setItem('bookverse_user', JSON.stringify(currentUser));
        renderAuthArea(); updateCartBadge(); closeModal();
        toast('Welcome, ' + currentUser.name + '!');
    } else { alert(data.message); }
}

async function handleSignup(e) {
    e.preventDefault();
    const res = await fetch(`${API}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: document.getElementById('regName').value, email: document.getElementById('regEmail').value, password: document.getElementById('regPass').value })
    });
    const data = await res.json();
    if (data.success) {
        currentUser = data.user;
        localStorage.setItem('bookverse_user', JSON.stringify(currentUser));
        renderAuthArea(); updateCartBadge(); closeModal();
        toast('Account created!');
    } else { alert(data.message); }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('bookverse_user');
    renderAuthArea(); updateCartBadge();
    toast('Logged out');
}

// ============ Theme ============
function toggleTheme() {
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    document.body.setAttribute('data-theme', t);
    localStorage.setItem('bookverse_theme', t);
    document.getElementById('themeToggle').innerHTML = t === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
function initTheme() {
    const t = localStorage.getItem('bookverse_theme') || 'light';
    document.documentElement.setAttribute('data-theme', t);
    document.body.setAttribute('data-theme', t);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.innerHTML = t === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// ============ Modal ============
function openModal() { document.getElementById('modal').classList.add('open'); }
function closeModal() { document.getElementById('modal').classList.remove('open'); }

// ============ Toast ============
function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ============ Utility ============
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
