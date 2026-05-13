/* ================================================
   BookVerse - Admin Panel Logic
   ================================================ */

let activeTab = 'books';

document.addEventListener('DOMContentLoaded', () => {
    loadAdminBooks();

    document.getElementById('addBookBtn').addEventListener('click', () => showBookForm());

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTab = btn.dataset.tab;
            if (activeTab === 'books') loadAdminBooks();
            else loadOrders();
        });
    });
});

// ============ Books Management ============
async function loadAdminBooks() {
    const books = await fetch(`${API}/books`).then(r => r.json());
    document.getElementById('adminContent').innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Cover</th><th>Title</th><th>Author</th><th>Category</th>
                    <th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${books.map(b => `
                    <tr>
                        <td><img src="${b.imageUrl}" onerror="this.src='https://via.placeholder.com/50x65?text=Book'"></td>
                        <td><strong>${b.title}</strong></td>
                        <td>${b.author}</td>
                        <td>${b.category}</td>
                        <td>₹${b.price}</td>
                        <td>${b.stock}</td>
                        <td><i class="fas fa-star" style="color:var(--accent)"></i> ${b.rating}</td>
                        <td>
                            <button class="btn btn-secondary btn-sm" onclick="showBookForm(${b.id})" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-danger btn-sm" onclick="deleteBook(${b.id})" title="Delete"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

async function showBookForm(id) {
    let book = { title:'',author:'',description:'',price:'',originalPrice:'',imageUrl:'',category:'Fiction',stock:100,isbn:'',publisher:'',publishedYear:2024,pages:'',featured:false };
    if (id) book = await fetch(`${API}/books/${id}`).then(r => r.json());

    document.getElementById('modalBody').innerHTML = `
        <h2 style="margin-bottom:20px">${id ? 'Edit' : 'Add New'} Book</h2>
        <form onsubmit="${id ? `updateBook(event,${id})` : 'createBook(event)'}">
            <div class="form-row">
                <div class="form-group"><label>Title</label><input id="bTitle" value="${book.title}" required></div>
                <div class="form-group"><label>Author</label><input id="bAuthor" value="${book.author}" required></div>
            </div>
            <div class="form-group"><label>Description</label><textarea id="bDesc" rows="3">${book.description || ''}</textarea></div>
            <div class="form-row">
                <div class="form-group"><label>Price (₹)</label><input id="bPrice" type="number" value="${book.price}" required></div>
                <div class="form-group"><label>Original Price</label><input id="bOrigPrice" type="number" value="${book.originalPrice || ''}"></div>
            </div>
            <div class="form-group"><label>Image URL</label><input id="bImage" value="${book.imageUrl || ''}"></div>
            <div class="form-row">
                <div class="form-group">
                    <label>Category</label>
                    <select id="bCategory">
                        ${['Fiction','Science Fiction','Fantasy','Mystery','Non-Fiction','Romance'].map(c =>
                            `<option ${book.category===c?'selected':''}>${c}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Stock</label><input id="bStock" type="number" value="${book.stock}"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>ISBN</label><input id="bIsbn" value="${book.isbn || ''}"></div>
                <div class="form-group"><label>Publisher</label><input id="bPublisher" value="${book.publisher || ''}"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Year</label><input id="bYear" type="number" value="${book.publishedYear || ''}"></div>
                <div class="form-group"><label>Pages</label><input id="bPages" type="number" value="${book.pages || ''}"></div>
            </div>
            <div class="form-group" style="display:flex;align-items:center;gap:10px">
                <input type="checkbox" id="bFeatured" ${book.featured ? 'checked' : ''}>
                <label for="bFeatured" style="margin:0">Featured Book</label>
            </div>
            <button class="btn btn-primary btn-block" type="submit">${id ? 'Update' : 'Add'} Book</button>
        </form>`;
    openModal();
}

function getBookFormData() {
    return {
        title: document.getElementById('bTitle').value,
        author: document.getElementById('bAuthor').value,
        description: document.getElementById('bDesc').value,
        price: parseFloat(document.getElementById('bPrice').value),
        originalPrice: parseFloat(document.getElementById('bOrigPrice').value) || null,
        imageUrl: document.getElementById('bImage').value,
        category: document.getElementById('bCategory').value,
        stock: parseInt(document.getElementById('bStock').value),
        isbn: document.getElementById('bIsbn').value,
        publisher: document.getElementById('bPublisher').value,
        publishedYear: parseInt(document.getElementById('bYear').value) || null,
        pages: parseInt(document.getElementById('bPages').value) || null,
        featured: document.getElementById('bFeatured').checked
    };
}

async function createBook(e) {
    e.preventDefault();
    await fetch(`${API}/books`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getBookFormData())
    });
    closeModal(); loadAdminBooks(); toast('Book added!');
}

async function updateBook(e, id) {
    e.preventDefault();
    await fetch(`${API}/books/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getBookFormData())
    });
    closeModal(); loadAdminBooks(); toast('Book updated!');
}

async function deleteBook(id) {
    if (!confirm('Delete this book?')) return;
    await fetch(`${API}/books/${id}`, { method: 'DELETE' });
    loadAdminBooks(); toast('Book deleted');
}

// ============ Orders Management ============
async function loadOrders() {
    const orders = await fetch(`${API}/orders`).then(r => r.json());
    if (orders.length === 0) {
        document.getElementById('adminContent').innerHTML = '<p class="loader">No orders yet.</p>';
        return;
    }
    document.getElementById('adminContent').innerHTML = `
        <table class="admin-table">
            <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
                ${orders.map(o => `
                    <tr>
                        <td><strong>#${o.id}</strong></td>
                        <td>${o.userName}<br><small>${o.userEmail}</small></td>
                        <td>${o.items ? o.items.length : 0} items</td>
                        <td><strong>₹${o.totalAmount}</strong></td>
                        <td><span class="status-badge status-${o.status}">${o.status}</span></td>
                        <td>${new Date(o.createdAt).toLocaleDateString()}</td>
                        <td>
                            <select onchange="updateOrderStatus(${o.id}, this.value)" style="padding:6px;border-radius:6px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.8rem">
                                ${['PENDING','CONFIRMED','SHIPPED','DELIVERED'].map(s =>
                                    `<option ${o.status===s?'selected':''}>${s}</option>`).join('')}
                            </select>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

async function updateOrderStatus(id, status) {
    await fetch(`${API}/orders/${id}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    toast('Order status updated');
}
