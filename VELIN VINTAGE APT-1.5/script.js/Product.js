// Price System Functions (from main.html)
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

        // Similar Products (updated with dynamic prices)
        const similarProducts = [
            { id: 2, name: '1st Camo Shark Full Zip', brand: 'BAPE', category: 'JACKET' },
            { id: 3, name: 'Essentials Sweatpants', brand: 'FEAR OF GOD', category: 'PANTS' },
            { id: 7, name: 'Diagonal Arrows Bomber', brand: 'OFF-WHITE', category: 'BOMBER' },
            { id: 10, name: 'Rebuild Flannel Shirt', brand: 'NEEDLES', category: 'SHIRT' }
        ];

        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id')) || 1;
        const allProducts = getProducts();
        const product = allProducts.find(p => p.id === productId) || allProducts[0];

        // Load product data with dynamic price
        function loadProduct() {
            const currentPrice = getCurrentPrice(productId);
            const trend = getPriceTrend(productId);

            document.getElementById('productName').textContent = product.name;
            document.getElementById('brand').textContent = product.brand;
            document.getElementById('currentPrice').textContent = '$' + currentPrice;

            // Update main image
            const mainImageDiv = document.getElementById('mainImage');
            if (product.image) {
                mainImageDiv.innerHTML = `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                mainImageDiv.textContent = product.category.toUpperCase();
            }

            document.getElementById('breadcrumb-product').textContent = product.name.toUpperCase();

            if (product.original) {
                document.getElementById('originalPrice').textContent = '$' + product.original;
            } else {
                document.getElementById('originalPrice').style.display = 'none';
                document.querySelector('.discount').style.display = 'none';
            }

            if (product.badge) {
                document.getElementById('badge').textContent = product.badge;
            } else {
                document.getElementById('badge').style.display = 'none';
            }

            // Update trend values
            document.querySelectorAll('.trend-value')[0].textContent = (trend >= 0 ? '↑' : '↓') + ' $' + Math.abs(Math.round(currentPrice * trend / 100)) + ' (' + Math.abs(trend) + '%)';
            document.querySelectorAll('.trend-value')[1].textContent = (trend >= 0 ? '↑' : '↓') + ' $' + Math.abs(Math.round(currentPrice * trend * 4 / 100)) + ' (' + Math.abs(trend * 4) + '%)';
        }

        // Add to Cart Function
        function addToCart() {
            const selectedSize = document.querySelector('.option-btn.selected[data-type="size"]');
            const selectedCondition = document.querySelector('.option-btn.selected[data-type="condition"]');

            if (!selectedSize || !selectedCondition) {
                showNotification('Please select size and condition');
                return;
            }

            const cart = JSON.parse(localStorage.getItem('velinCart') || '[]');
            const currentPrice = getCurrentPrice(productId);

            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(item =>
                item.id === productId &&
                item.size === selectedSize.textContent &&
                item.condition === selectedCondition.textContent
            );

            if (existingItemIndex > -1) {
                // Update quantity if item exists
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item
                const cartItem = {
                    id: productId,
                    name: product.name,
                    brand: product.brand,
                    price: currentPrice,
                    size: selectedSize.textContent,
                    condition: selectedCondition.textContent,
                    category: product.category,
                    image: product.image || null,
                    quantity: 1,
                    addedAt: new Date().toISOString()
                };
                cart.push(cartItem);
            }

            localStorage.setItem('velinCart', JSON.stringify(cart));
            updateCartCount();
            showNotification('Added to cart!');
        }

        // Add to Wishlist Function
        function addToWishlist() {
            const currentUser = window.VELIN.currentUser;
            if (!currentUser.wishlist) currentUser.wishlist = [];

            if (currentUser.wishlist.includes(productId)) {
                showNotification('Already in wishlist');
                return;
            }

            currentUser.wishlist.push(productId);
            localStorage.setItem('velinCurrentUser', JSON.stringify(currentUser));

            // Update in users array
            const users = JSON.parse(localStorage.getItem('velinUsers') || '[]');
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('velinUsers', JSON.stringify(users));
            }

            showNotification('Added to wishlist!');
        }

        // Tab switching
        function switchTab(index) {
            const tabs = document.querySelectorAll('.tab');
            const contents = document.querySelectorAll('.tab-content');

            tabs.forEach((tab, i) => {
                tab.classList.toggle('active', i === index);
            });

            contents.forEach((content, i) => {
                content.classList.toggle('active', i === index);
            });
        }

        // Chart period change
        function changeChartPeriod(period) {
            const buttons = document.querySelectorAll('.chart-btn');
            buttons.forEach(btn => {
                btn.classList.toggle('active', btn.textContent === period);
            });
            drawChart(period);
        }

        // Draw price chart using history from localStorage
        function drawChart(period) {
            const canvas = document.getElementById('priceChart');
            const ctx = canvas.getContext('2d');

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const priceData = JSON.parse(localStorage.getItem('velinPriceData') || '{}');
            const history = priceData[productId]?.history || [];
            const data = filterHistoryByPeriod(history, period).map(entry => entry.price);

            if (data.length < 2) {
                ctx.fillStyle = '#888';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('No price history available', canvas.width / 2, canvas.height / 2);
                return;
            }

            const padding = 40;
            const width = canvas.width - padding * 2;
            const height = canvas.height - padding * 2;
            const maxPrice = Math.max(...data);
            const minPrice = Math.min(...data);

            // Draw grid
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 5; i++) {
                const y = padding + (height / 5) * i;
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(canvas.width - padding, y);
                ctx.stroke();
            }

            // Draw line
            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 2;
            ctx.beginPath();

            data.forEach((price, i) => {
                const x = padding + (width / (data.length - 1)) * i;
                const y = padding + height - ((price - minPrice) / (maxPrice - minPrice)) * height;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });

            ctx.stroke();

            // Draw points
            ctx.fillStyle = '#4ade80';
            data.forEach((price, i) => {
                const x = padding + (width / (data.length - 1)) * i;
                const y = padding + height - ((price - minPrice) / (maxPrice - minPrice)) * height;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw labels
            ctx.fillStyle = '#888';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            for (let i = 0; i <= 5; i++) {
                const value = Math.round(minPrice + (maxPrice - minPrice) * (1 - i / 5));
                const y = padding + (height / 5) * i;
                ctx.fillText('$' + value, padding - 10, y + 5);
            }
        }

        // Helper to filter history by period
        function filterHistoryByPeriod(history, period) {
            const now = Date.now();
            const periods = {
                '1W': 7 * 24 * 60 * 60 * 1000,
                '1M': 30 * 24 * 60 * 60 * 1000,
                '3M': 90 * 24 * 60 * 60 * 1000,
                '6M': 180 * 24 * 60 * 60 * 1000,
                '1Y': 365 * 24 * 60 * 60 * 1000,
                'ALL': Infinity
            };
            const cutoff = now - (periods[period] || periods['1M']);
            return history.filter(entry => entry.date >= cutoff);
        }

        // Load similar products with dynamic prices
        function loadSimilarProducts() {
            const html = similarProducts.map(p => {
                const currentPrice = getCurrentPrice(p.id);
                const prod = getProducts().find(pr => pr.id === p.id);
                return `
            <div class="similar-card" onclick="window.location.href='product.html?id=${p.id}'">
                <div class="similar-image">
                    ${prod.image ? `<img src="${prod.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">` : p.category}
                </div>
                <div class="similar-info">
                    <div class="similar-brand">${p.brand}</div>
                    <div class="similar-name">${p.name}</div>
                    <div class="similar-price">$${currentPrice}</div>
                </div>
            </div>
        `;
            }).join('');
            document.getElementById('similarGrid').innerHTML = html;
        }

        // Option selection - Update to add data attributes
        function setupOptionButtons() {
            // Size buttons
            const sizeButtons = document.querySelectorAll('.option-group:first-child .option-btn');
            sizeButtons.forEach(btn => {
                btn.setAttribute('data-type', 'size');
                btn.addEventListener('click', function () {
                    sizeButtons.forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });

            // Condition buttons
            const conditionButtons = document.querySelectorAll('.option-group:last-child .option-btn');
            conditionButtons.forEach(btn => {
                btn.setAttribute('data-type', 'condition');
                btn.addEventListener('click', function () {
                    conditionButtons.forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });
        }

        // Show notification
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

        document.addEventListener("DOMContentLoaded", () => {
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

            initializePriceSystem();
            loadProduct();
            loadSimilarProducts();
            setupOptionButtons();
            drawChart('1M');
            updateCartCount();
        });
        /* =========================
          Search panel behavior - 수정 버전
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