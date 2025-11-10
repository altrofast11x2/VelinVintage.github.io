// Price System Functions
function initializePriceSystem() {
    const priceData = JSON.parse(localStorage.getItem('velinPriceData') || '{}');
    const now = Date.now();

    if (!priceData.lastUpdate || now - priceData.lastUpdate > 24 * 60 * 60 * 1000) {
        updateAllPrices();
    }
}

function updateAllPrices() {
    const products = getProducts();
    const priceData = JSON.parse(localStorage.getItem('velinPriceData') || '{}');
    const now = Date.now();

    products.forEach(product => {
        if (!priceData[product.id]) {
            priceData[product.id] = {
                history: generateInitialPriceHistory(product.price),
                lastUpdate: now
            };
        } else {
            const lastPrice = priceData[product.id].history[priceData[product.id].history.length - 1].price;
            const newPrice = calculateNewPrice(lastPrice);
            priceData[product.id].history.push({
                date: now,
                price: newPrice
            });
            priceData[product.id].lastUpdate = now;
        }
    });

    priceData.lastUpdate = now;
    localStorage.setItem('velinPriceData', JSON.stringify(priceData));
}

function generateInitialPriceHistory(basePrice) {
    const history = [];
    const now = Date.now();
    const daysBack = 365;

    for (let i = daysBack; i >= 0; i--) {
        const date = now - (i * 24 * 60 * 60 * 1000);
        const variation = (Math.random() - 0.5) * 0.1;
        const price = Math.round(basePrice * (1 + variation));
        history.push({ date, price });
    }

    return history;
}

function calculateNewPrice(lastPrice) {
    const changePercent = (Math.random() - 0.48) * 0.05;
    return Math.round(lastPrice * (1 + changePercent));
}

function getCurrentPrice(productId) {
    const priceData = JSON.parse(localStorage.getItem('velinPriceData') || '{}');
    if (priceData[productId] && priceData[productId].history && priceData[productId].history.length > 0) {
        return priceData[productId].history[priceData[productId].history.length - 1].price;
    }
    return getProducts().find(p => p.id == productId)?.price || 0;
}

function getPriceTrend(productId) {
    const priceData = JSON.parse(localStorage.getItem('velinPriceData') || '{}');
    if (!priceData[productId] || !priceData[productId].history || priceData[productId].history.length < 2) {
        return 0;
    }

    const history = priceData[productId].history;
    const currentPrice = history[history.length - 1].price;
    const weekAgoPrice = history[Math.max(0, history.length - 7)]?.price || currentPrice;

    return ((currentPrice - weekAgoPrice) / weekAgoPrice * 100).toFixed(1);
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
// LOOKBOOK 데이터 (실제 사진 경로로 교체)
const lookbooks = [
    { id: 1, style: 'STREET CASUAL', name: 'Urban Edge', products: 'Chrome Hearts Hoodie, Bape Pants, Supreme Cap', image: './assets/images/lookbook/lookbook1.webp' },
    { id: 2, style: 'VINTAGE CLASSIC', name: 'Timeless Vibes', products: 'Stüssy Jacket, Off-White Tee, Palm Angels Shoes', image: './assets/images/lookbook/lookbook2-1.webp' },
    { id: 3, style: 'HIGH FASHION', name: 'Luxury Street', products: 'Fear of God Essentials, Needles Shirt, Supreme Backpack', image: './assets/images/lookbook/lookbook2-2.webp' },
    { id: 4, style: 'MINIMALIST', name: 'Clean Lines', products: 'Chrome Hearts Ring, Bape Sta Sneakers, Stüssy Work Jacket', image: './assets/images/lookbook/lookbook2-3.webp' },
    // 더 추가 가능 (image 경로 실제로 맞춰서)
];

function renderLookbook() {
    const html = lookbooks.map(l => `
                <div class="lookbook-item" onclick="showDetails(${l.id})">
                    <div class="lookbook-image">
                        ${l.image ? `<img src="${l.image}" alt="${l.name}">` : 'LOOKBOOK IMAGE'}
                    </div>
                    <div class="lookbook-info">
                        <div class="lookbook-style">${l.style}</div>
                        <div class="lookbook-name">${l.name}</div>
                        <div class="lookbook-products">${l.products}</div>
                    </div>
                </div>
            `).join('');
    document.getElementById('lookbookGrid').innerHTML = html;
}

function showDetails(id) {
    const look = lookbooks.find(l => l.id === id);
    showNotification(`${look.name} clicked - Shop similar items!`);
    // 실제로는 product.html로 리다이렉트 가능
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

    renderLookbook();
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