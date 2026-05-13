/* ================================================
   BookVerse - Cart Page Logic
   ================================================ */

document.addEventListener('DOMContentLoaded', loadCart);

async function loadCart() {
    const container = document.getElementById('cartContent');
    if (!currentUser) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-user-lock"></i>
                <h2>Please Login</h2>
                <p>You need to login to view your cart.</p>
                <button class="btn btn-primary" onclick="showLogin()" style="margin-top:16px">Login Now</button>
            </div>`;
        return;
    }

    try {
        const items = await fetch(`${API}/cart?userId=${currentUser.id}`).then(r => r.json());

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Your Cart is Empty</h2>
                    <p>Looks like you haven't added any books yet.</p>
                    <a href="/" class="btn btn-primary" style="margin-top:16px"><i class="fas fa-arrow-left"></i> Browse Books</a>
                </div>`;
            return;
        }

        const subtotal = items.reduce((s, i) => s + i.book.price * i.quantity, 0);
        const shipping = subtotal > 999 ? 0 : 49;
        const total = subtotal + shipping;

        container.innerHTML = `
            <div>
                ${items.map(item => `
                    <div class="cart-item fade-in">
                        <div class="cart-item-img">
                            <img src="${item.book.imageUrl}" alt="${item.book.title}" onerror="this.src='https://via.placeholder.com/80x110?text=Book'">
                        </div>
                        <div class="cart-item-info">
                            <h3>${item.book.title}</h3>
                            <p class="author">by ${item.book.author}</p>
                            <p class="cart-item-price">₹${item.book.price}</p>
                        </div>
                        <div class="cart-item-actions">
                            <div class="qty-control">
                                <button onclick="changeQty(${item.id}, ${item.quantity - 1})">−</button>
                                <span>${item.quantity}</span>
                                <button onclick="changeQty(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                            <strong>₹${(item.book.price * item.quantity).toFixed(0)}</strong>
                            <button class="btn btn-danger btn-sm" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-summary">
                <div class="row"><span>Subtotal (${items.length} items)</span><span>₹${subtotal.toFixed(0)}</span></div>
                <div class="row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '₹' + shipping}</span></div>
                <div class="row total"><span>Total</span><span>₹${total.toFixed(0)}</span></div>
                <button class="btn btn-primary btn-block" style="margin-top:16px" onclick="showCheckout(${total})">
                    <i class="fas fa-lock"></i> Proceed to Checkout
                </button>
                <a href="/" class="btn btn-secondary btn-block" style="margin-top:10px"><i class="fas fa-arrow-left"></i> Continue Shopping</a>
            </div>`;
    } catch (err) {
        container.innerHTML = '<p class="loader" style="color:var(--danger)">Error loading cart.</p>';
    }
}

async function changeQty(itemId, newQty) {
    if (newQty < 1) { removeItem(itemId); return; }
    await fetch(`${API}/cart/${itemId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
    });
    loadCart();
    updateCartBadge();
}

async function removeItem(itemId) {
    await fetch(`${API}/cart/${itemId}`, { method: 'DELETE' });
    loadCart();
    updateCartBadge();
    toast('Item removed');
}

function showCheckout(total) {
    document.getElementById('modalBody').innerHTML = `
        <h2 style="margin-bottom:20px"><i class="fas fa-lock"></i> Checkout</h2>
        <form onsubmit="placeOrder(event)">
            <div class="form-row">
                <div class="form-group"><label>Full Name</label><input id="coName" value="${currentUser.name}" required></div>
                <div class="form-group"><label>Phone</label><input id="coPhone" type="tel" required placeholder="+91 98765 43210"></div>
            </div>
            <div class="form-group"><label>Shipping Address</label><input id="coAddress" required placeholder="123 Main Street"></div>
            <div class="form-row">
                <div class="form-group"><label>City</label><input id="coCity" required></div>
                <div class="form-group"><label>State</label><input id="coState" required></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>ZIP Code</label><input id="coZip" required></div>
                <div class="form-group">
                    <label>Payment Method</label>
                    <select id="coPayment" style="width:100%;padding:12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text)">
                        <option>Cash on Delivery</option>
                        <option>Credit/Debit Card</option>
                        <option>UPI</option>
                        <option>Net Banking</option>
                    </select>
                </div>
            </div>
            <div class="cart-summary" style="margin:20px 0">
                <div class="row total"><span>Order Total</span><span>₹${total.toFixed(0)}</span></div>
            </div>
            <button class="btn btn-accent btn-block" type="submit"><i class="fas fa-check-circle"></i> Place Order</button>
        </form>`;
    openModal();
}

async function placeOrder(e) {
    e.preventDefault();
    try {
        const res = await fetch(`${API}/orders`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                shippingAddress: document.getElementById('coAddress').value,
                city: document.getElementById('coCity').value,
                state: document.getElementById('coState').value,
                zipCode: document.getElementById('coZip').value,
                phone: document.getElementById('coPhone').value,
                paymentMethod: document.getElementById('coPayment').value
            })
        });
        const order = await res.json();

        document.getElementById('modalBody').innerHTML = `
            <div style="text-align:center;padding:20px">
                <i class="fas fa-check-circle" style="font-size:4rem;color:var(--success);margin-bottom:16px"></i>
                <h2 style="margin-bottom:8px">Order Placed!</h2>
                <p style="color:var(--text-muted);margin-bottom:6px">Order ID: <strong>#${order.id}</strong></p>
                <p style="color:var(--text-muted);margin-bottom:20px">Total: <strong>₹${order.totalAmount}</strong></p>
                <a href="/" class="btn btn-primary"><i class="fas fa-home"></i> Continue Shopping</a>
            </div>`;
        updateCartBadge();
    } catch (err) {
        alert('Error placing order. Please try again.');
    }
}
