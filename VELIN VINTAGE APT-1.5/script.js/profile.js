function getCurrentPrice(productId) {
            const priceData = JSON.parse(localStorage.getItem('velinPriceData') || '{}');
            if (priceData[productId] && priceData[productId].history && priceData[productId].history.length > 0) {
                return priceData[productId].history[priceData[productId].history.length - 1].price;
            }
            return getProducts().find(p => p.id == productId)?.price || 0;
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

        const savedUsers = localStorage.getItem('velinUsers');
        window.VELIN = savedUsers
            ? { users: JSON.parse(savedUsers), currentUser: JSON.parse(localStorage.getItem('velinCurrentUser')) || null }
            : { users: [], currentUser: null };

        const products = getProducts();

        if (!window.VELIN.currentUser) {
            window.location.href = 'login.html';
        }

        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('velinCart') || '[]');
            document.getElementById('cartCount').textContent = cart.length;
        }

        function showTab(tab) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            event.target.classList.add('active');
            document.getElementById(`${tab}Tab`).classList.add('active');
        }

        function getCollectionProducts() {
            const currentUser = window.VELIN.currentUser;
            if (!currentUser.ownedProducts) currentUser.ownedProducts = [];
            return currentUser.ownedProducts.map(id => products.find(p => p.id === id)).filter(p => p);
        }

        function getWishlistProducts() {
            const currentUser = window.VELIN.currentUser;
            if (!currentUser.wishlist) currentUser.wishlist = [];
            return currentUser.wishlist.map(id => products.find(p => p.id === id)).filter(p => p);
        }

        function renderCollection() {
            const collection = getCollectionProducts();
            const grid = document.getElementById('collectionGrid');

            if (collection.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1;">
                        <div class="empty-state-icon">📦</div>
                        <div class="empty-state-title">No Items in Collection</div>
                        <div class="empty-state-text">Start building your collection</div>
                        <a href="main.html#new" class="btn-browse">BROWSE PRODUCTS</a>
                    </div>
                `;
                return;
            }

            const html = collection.map(p => {
                const currentPrice = getCurrentPrice(p.id);
                const gain = currentPrice - p.price;
                const gainPercent = ((gain / p.price) * 100).toFixed(1);

                return `
                    <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'">
                        <div class="product-image">
                            <button class="remove-btn" onclick="event.stopPropagation(); removeFromCollection(${p.id})">×</button>
                            ${p.image ? `<img src="${p.image}" alt="${p.name}">` : p.category.toUpperCase()}
                        </div>
                        <div class="product-info">
                            <div class="product-brand">${p.brand}</div>
                            <div class="product-name">${p.name}</div>
                            <div class="product-price">${currentPrice}</div>
                            <div class="product-gain ${gain >= 0 ? 'up' : 'down'}">
                                ${gain >= 0 ? '↑' : '↓'} ${Math.abs(gain)} (${Math.abs(gainPercent)}%)
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            grid.innerHTML = html;
        }

        function renderWishlist() {
            const wishlist = getWishlistProducts();
            const grid = document.getElementById('wishlistGrid');

            if (wishlist.length === 0) {
                grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">💚</div>
                <div class="empty-state-title">No Items in Wishlist</div>
                <div class="empty-state-text">Add products you love to your wishlist</div>
                <a href="main.html#new" class="btn-browse">BROWSE PRODUCTS</a>
            </div>
        `;
                return;
            }

            const html = wishlist.map(p => {
                const currentPrice = getCurrentPrice(p.id);

                return `
            <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'">
                <div class="product-image">
                    <button class="remove-btn" onclick="event.stopPropagation(); removeFromWishlist(${p.id})">×</button>
                    ${p.image ? `<img src="${p.image}" alt="${p.name}">` : p.category.toUpperCase()}
                </div>
                <div class="product-info">
                    <div class="product-brand">${p.brand}</div>
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">$${currentPrice}</div>
                </div>
            </div>
        `;
            }).join('');

            grid.innerHTML = html;
        }
        function removeFromCollection(productId) {
            if (!confirm('Remove this item from your collection?')) return;

            window.VELIN.currentUser.ownedProducts = window.VELIN.currentUser.ownedProducts.filter(id => id !== productId);
            updateUserData();
            renderCollection();
            updateStats();
            showNotification('Removed from collection');
        }

        function removeFromWishlist(productId) {
            if (!confirm('Remove this item from your wishlist?')) return;

            window.VELIN.currentUser.wishlist = window.VELIN.currentUser.wishlist.filter(id => id !== productId);
            updateUserData();
            renderWishlist();
            updateStats();
            showNotification('Removed from wishlist');
        }

        function updateUserData() {
            localStorage.setItem('velinCurrentUser', JSON.stringify(window.VELIN.currentUser));

            const users = JSON.parse(localStorage.getItem('velinUsers') || '[]');
            const userIndex = users.findIndex(u => u.email === window.VELIN.currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = window.VELIN.currentUser;
                localStorage.setItem('velinUsers', JSON.stringify(users));
            }
        }

        function updateStats() {
            const collection = getCollectionProducts();
            const wishlist = getWishlistProducts();

            const collectionValue = collection.reduce((sum, p) => sum + getCurrentPrice(p.id), 0);
            const originalValue = collection.reduce((sum, p) => sum + p.price, 0);
            const totalGain = collectionValue - originalValue;

            document.getElementById('collectionCount').textContent = collection.length;
            document.getElementById('wishlistCount').textContent = wishlist.length;
            document.getElementById('totalValue').textContent = `$${collectionValue.toLocaleString()}`;
            document.getElementById('totalGain').textContent = `${totalGain >= 0 ? '+' : '-'}$${Math.abs(totalGain).toLocaleString()}`;

            const gainElement = document.getElementById('totalGain');
            gainElement.style.color = totalGain >= 0 ? '#4ade80' : '#f87171';
        }

        function openEditModal() {
            const currentUser = window.VELIN.currentUser;
            document.getElementById('editFirstName').value = currentUser.firstName || '';
            document.getElementById('editLastName').value = currentUser.lastName || '';
            document.getElementById('editEmail').value = currentUser.email || '';
            document.getElementById('editPhone').value = currentUser.phone || '';
            document.getElementById('editUsername').value = currentUser.username || '';
            document.getElementById('editModal').classList.add('active');
        }

        function closeEditModal() {
            document.getElementById('editModal').classList.remove('active');
        }

        function saveProfile(event) {
            event.preventDefault();

            window.VELIN.currentUser.firstName = document.getElementById('editFirstName').value.trim();
            window.VELIN.currentUser.lastName = document.getElementById('editLastName').value.trim();
            window.VELIN.currentUser.phone = document.getElementById('editPhone').value.trim();
            window.VELIN.currentUser.username = document.getElementById('editUsername').value.trim();

            updateUserData();
            loadProfile();
            closeEditModal();
            showNotification('Profile updated successfully!');
        }

        function loadProfile() {
            const currentUser = window.VELIN.currentUser;
            const fullName = `${currentUser.firstName} ${currentUser.lastName}`;

            document.getElementById('profileName').textContent = fullName;
            document.getElementById('profileEmail').textContent = currentUser.email;
            document.getElementById('profileJoined').textContent = `Joined: ${new Date(currentUser.createdAt).toLocaleDateString()}`;
            document.getElementById('avatarLetter').textContent = currentUser.firstName.charAt(0).toUpperCase();
        }

        function showNotification(message) {
            const div = document.createElement('div');
            div.className = 'notification';
            div.textContent = message;
            document.body.appendChild(div);
            setTimeout(() => div.remove(), 2500);
        }

        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Initialize
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

            loadProfile();
            renderCollection();
            renderWishlist();
            updateStats();
            updateCartCount();

            // Close modal when clicking outside
            document.getElementById('editModal').addEventListener('click', (e) => {
                if (e.target.id === 'editModal') {
                    closeEditModal();
                }
            });
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