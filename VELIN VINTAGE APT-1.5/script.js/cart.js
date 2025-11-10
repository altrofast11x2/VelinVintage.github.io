function formatPrice(num) {
    return '$' + num.toFixed(2);
}

function getProducts() {
    return [
        { id: 1, name: 'Cross Patch Hoodie', brand: 'CHROME HEARTS', price: 890, original: 1200, category: 'tops', badge: 'NEW', trend: 12.5, image: './assets/images/products/hoodie-1.webp' },
        { id: 2, name: '1st Camo Shark Full Zip', brand: 'BAPE', price: 650, category: 'outerwear', badge: 'HOT', trend: 8.3, image: './assets/images/products/hoodie-2.webp' },
        { id: 3, name: 'Essentials Sweatpants', brand: 'FEAR OF GOD', price: 125, category: 'bottoms', trend: 5.2, image: './assets/images/products/fear-of-god-essentials-sweatpants-ss22-dark-oatmeal-689639.webp' },
        { id: 4, name: 'Bape Sta Low Patent', brand: 'BAPE', price: 280, original: 400, category: 'footwear', badge: 'SALE', trend: -2.1, image: './assets/images/products/bapesta-black-sneakers-1.webp' },
        { id: 5, name: 'Stock Logo Cap', brand: 'STÜSSY', price: 55, category: 'accessories', trend: 3.4, image: './assets/images/products/stock-cap.webp' },
        { id: 6, name: 'Box Logo Tee', brand: 'SUPREME', price: 429, category: 'tops', badge: 'NEW', trend: -3.2, image: './assets/images/products/Supereme-Box-logo.webp' },
        { id: 7, name: 'Diagonal Arrows Bomber', brand: 'OFF-WHITE', price: 1450, category: 'outerwear', trend: 15.7, image: './assets/images/products/off-white-Diagonal Arrows Bomber.webp' },
        { id: 8, name: 'Track Pants', brand: 'PALM ANGELS', price: 395, category: 'bottoms', badge: 'HOT', trend: 7.8, image: './assets/images/products/PALM ANGELS Track Pants.webp' },
        { id: 9, name: 'Forever Ring', brand: 'CHROME HEARTS', price: 650, category: 'accessories', trend: 11.2, image: './assets/images/products/Chrome hearts Forever ring.webp' },
        { id: 10, name: 'Rebuild Flannel Shirt', brand: 'NEEDLES', price: 320, category: 'tops', badge: 'NEW', trend: 4.5, image: './assets/images/products/Needles Rebuild Flannel Shirt.webp' },
        { id: 11, name: 'Backpack FW25', brand: 'SUPREME', price: 168, category: 'accessories', trend: 2.1, image: './assets/images/products/Supereme-backpack FW25.webp' },
        { id: 12, name: 'Work Jacket', brand: 'STÜSSY', price: 195, original: 280, category: 'outerwear', badge: 'SALE', trend: -1.5, image: './assets/images/products/Stussy Work Jacket.webp' }
    ];
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('velinCart') || '[]');
    const container = document.getElementById('cartContent');

    if (cart.length === 0) {
        container.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-icon">🛒</div>
                        <div class="empty-title">Your cart is empty</div>
                        <div class="empty-text">Start shopping and add items to your cart</div>
                        <a href="main.html#new" class="continue-shopping">BROWSE PRODUCTS</a>
                    </div>`;
        return;
    }

    const itemsHtml = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="item-image">
                        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.category.toUpperCase()}
                    </div>
                    <div class="item-info">
                        <div>
                            <div class="item-brand">${item.brand}</div>
                            <div class="item-name">${item.name}</div>
                            <div class="item-details">
                                <span>Size: ${item.size}</span>
                                <span>Condition: ${item.condition}</span>
                            </div>
                        </div>
                        <div class="item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">−</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                            </div>
                            <button class="remove-btn" onclick="removeItem(${index})">REMOVE</button>
                        </div>
                    </div>
                    <div class="item-price-section">
                        <div class="item-price">${formatPrice(item.price)}</div>
                        <div class="item-subtotal">Subtotal: ${formatPrice(item.price * item.quantity)}</div>
                    </div>
                </div>`).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 200 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    container.innerHTML = `
                <div class="cart-layout">
                    <div class="cart-items">${itemsHtml}</div>
                    <div class="cart-summary">
                        <div class="summary-title">ORDER SUMMARY</div>
                        <div class="summary-row"><span class="summary-label">Subtotal (${cart.length} items)</span><span class="summary-value">${formatPrice(subtotal)}</span></div>
                        <div class="summary-row"><span class="summary-label">Shipping</span><span class="summary-value">${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                        <div class="summary-row"><span class="summary-label">Tax</span><span class="summary-value">${formatPrice(tax)}</span></div>
                        <div class="summary-divider"></div>
                        <div class="summary-total"><span>Total</span><span>${formatPrice(total)}</span></div>
                        <button class="checkout-btn" onclick="checkout()">PROCEED TO CHECKOUT</button>
                        <a href="main.html#new" class="continue-shopping">CONTINUE SHOPPING</a>
                        <div class="promo-code">
                            <input type="text" class="promo-input" id="promoInput" placeholder="Enter promo code">
                            <button class="apply-promo-btn" onclick="applyPromo()">APPLY CODE</button>
                        </div>
                    </div>
                </div>`;
}

function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('velinCart') || '[]');
    if (!cart[index]) return;
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) { removeItem(index); return; }
    localStorage.setItem('velinCart', JSON.stringify(cart));
    loadCart();
}

function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('velinCart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('velinCart', JSON.stringify(cart));
    showNotification('Item removed from cart');
    loadCart();
}

function applyPromo() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    const validCodes = { 'VELIN10': 10, 'WELCOME15': 15, 'SAVE20': 20 };
    if (validCodes[code]) showNotification(`Promo code applied! ${validCodes[code]}% discount`);
    else if (code) showNotification('Invalid promo code');
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('velinCart') || '[]');
    if (cart.length === 0) { showNotification('Your cart is empty'); return; }
    showNotification('Checkout feature coming soon!');
}

function showNotification(message) {
    const div = document.createElement('div');
    div.className = 'notification';
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2500);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('velinCart') || '[]');
    document.getElementById('cartCount').textContent = cart.length;
}

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const savedUsers = localStorage.getItem('velinUsers');
window.VELIN = savedUsers
    ? { users: JSON.parse(savedUsers), currentUser: JSON.parse(localStorage.getItem('velinCurrentUser')) || null }
    : { users: [], currentUser: null };

document.addEventListener('DOMContentLoaded', () => {
    const profileBtn = document.getElementById('profileBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!window.VELIN.currentUser) {
        window.location.href = 'login.html';
    } else {
        profileBtn.style.display = 'inline';
        logoutBtn.style.display = 'inline';
        logoutBtn.onclick = () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('velinCurrentUser');
                window.location.href = 'login.html';
            }
        };
    }

    loadCart();
    updateCartCount();
});

/* =========================
   Search panel behavior - 완전 수정 버전
   ========================= */
(function () {
    const panel = document.getElementById('searchPanel');
    const overlay = document.getElementById('searchOverlay');
    const input = document.getElementById('searchInput');
    const resultsEl = document.getElementById('searchResults');

    if (!panel || !overlay || !input || !resultsEl) {
        console.error('검색 패널 요소를 찾을 수 없습니다.');
        return;
    }

    const productsArr = window.products || getProducts();

    window.toggleSearch = function () {
        if (panel.classList.contains('active')) closeSearchPanel();
        else openSearchPanel();
    };

    window.openSearchPanel = function () {
        panel.classList.add('active');
        overlay.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        setTimeout(() => input.focus(), 300);
    };

    window.closeSearchPanel = function () {
        panel.classList.remove('active');
        overlay.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
        input.value = '';
        resultsEl.innerHTML = '';
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('active')) {
            closeSearchPanel();
        }
    });

    let debounceTimer = null;
    window.debouncedSearch = function () {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(searchProducts, 180);
    };

    input.addEventListener('input', debouncedSearch);

    function searchProducts() {
        const q = (input.value || '').trim().toLowerCase();
        if (!q) {
            resultsEl.innerHTML = '';
            return;
        }

        const filtered = productsArr.filter(p => {
            const name = (p.name || '').toString().toLowerCase();
            const brand = (p.brand || '').toString().toLowerCase();
            const cat = (p.category || '').toString().toLowerCase();
            return name.includes(q) || brand.includes(q) || cat.includes(q);
        });

        if (filtered.length === 0) {
            resultsEl.innerHTML = '<div class="search-empty">검색 결과가 없습니다.</div>';
            return;
        }

        resultsEl.innerHTML = filtered.map(p => {
            const currentPrice = getCurrentPrice(p.id);
            return `
                        <div class="search-item" onclick="searchItemClick(${p.id})">
                            <div class="name">${escapeHtml(p.name)}</div>
                            <div class="meta">${escapeHtml(p.brand)} • ${escapeHtml(p.category)}</div>
                            <div style="font-size:13px;color:#ccc;margin-top:6px;">$${currentPrice}</div>
                        </div>
                    `;
        }).join('');
    }

    window.searchItemClick = function (id) {
        const product = productsArr.find(p => p.id == id);
        if (product) {
            localStorage.setItem('selectedProduct', JSON.stringify(product));
        }
        closeSearchPanel();
        window.location.href = `product.html?id=${id}`;
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    overlay.addEventListener('click', closeSearchPanel);
    document.querySelector('.search-panel .close-btn').addEventListener('click', closeSearchPanel);
})();