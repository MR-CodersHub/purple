/* Shop Page Logic - Premium Filterable Grid */
document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    const categoryFilters = document.querySelectorAll('.filter-pill');
    const priceRange = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');
    const applyBtn = document.getElementById('apply-filters');

    // Mobile Drawer Elements
    const openDrawerBtn = document.getElementById('open-filters');
    const closeDrawerBtn = document.getElementById('close-filters');
    const filterDrawer = document.getElementById('filter-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerCategoryBtns = document.querySelectorAll('#drawer-category-filters .filter-pill');
    const drawerPriceRange = document.getElementById('drawer-price-range');
    const drawerPriceDisplay = document.getElementById('drawer-price-display');
    const drawerApplyBtn = document.getElementById('drawer-apply-filters');

    let currentCategory = 'all';
    let currentMaxPrice = 1000;

    // Initial Render
    syncFilters(currentCategory, currentMaxPrice);
    renderProducts(products);

    // Filter Functionality
    function filterProducts() {
        let filtered = products.filter(p => {
            const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
            const matchesPrice = p.price <= currentMaxPrice;
            return matchesCategory && matchesPrice;
        });
        renderProducts(filtered);
    }

    function renderProducts(productsList) {
        if (!productsGrid) return;
        productsGrid.innerHTML = '';

        if (productsList.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 100px 0; color: var(--white);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h2 style="font-family: var(--font-heading);">No products found</h2>
                    <p style="opacity: 0.8;">Try adjusting your filters to find what you're looking for.</p>
                </div>
            `;
            return;
        }

        productsList.forEach(product => {
            const card = createProductCard(product);
            productsGrid.appendChild(card);
        });
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        const escapedName = product.name.replace(/'/g, "\\'");
        const fallbacks = {
            'Fashion': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400&h=400',
            'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400&h=400',
            'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400&h=400',
            'Wellness': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400&h=400',
            'Home Decor': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400&h=400',
            'Accessories': 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80&w=400&h=400',
            'Smart Living': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=400&h=400',
            'Default': 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=400&h=400'
        };
        const fallbackImg = fallbacks[product.category] || fallbacks['Default'];

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='${fallbackImg}'; this.onerror=null;">
                <div class="product-actions">
                    <div class="action-btn" title="View Details" onclick="window.location.href='product-details.html?id=${product.id}'">
                        <i class="far fa-eye"></i>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title" title="${product.name}">${product.name}</h3>
                <div class="rating">
                    ${getStarRating(product.rating)}
                    <span style="color: #9c7ba1; font-size: 0.8rem; margin-left: 5px;">(${product.reviews || 0})</span>
                </div>
                <div class="price-row">
                    <div>
                        <span class="price">$${product.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart" onclick="Cart.addItem({id: ${product.id}, name: '${escapedName}', price: ${product.price}, image: '${product.image}'})">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        `;
        return card;
    }

    function getStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) stars += '<i class="fas fa-star"></i>';
            else if (i - 0.5 <= rating) stars += '<i class="fas fa-star-half-alt"></i>';
            else stars += '<i class="far fa-star"></i>';
        }
        return stars;
    }

    // Sync Helper
    function syncFilters(category, price) {
        currentCategory = category;
        currentMaxPrice = price;

        // Sync Category Pills
        const allCategoryPills = document.querySelectorAll('.filter-pill');
        allCategoryPills.forEach(pill => {
            if (pill.dataset.category === category) pill.classList.add('active');
            else pill.classList.remove('active');
        });

        // Sync Price Sliders
        if (priceRange) priceRange.value = price;
        if (drawerPriceRange) drawerPriceRange.value = price;
        if (priceDisplay) priceDisplay.innerText = `$${price}`;
        if (drawerPriceDisplay) drawerPriceDisplay.innerText = `$${price}`;
    }

    // Event Listeners (Desktop)
    categoryFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            syncFilters(btn.dataset.category, currentMaxPrice);
            filterProducts();
        });
    });

    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            syncFilters(currentCategory, parseInt(e.target.value));
        });
    }

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            filterProducts();
        });
    }

    // Event Listeners (Drawer)
    drawerCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            syncFilters(btn.dataset.category, currentMaxPrice);
            filterProducts();
        });
    });

    if (drawerPriceRange) {
        drawerPriceRange.addEventListener('input', (e) => {
            syncFilters(currentCategory, parseInt(e.target.value));
        });
    }

    if (drawerApplyBtn) {
        drawerApplyBtn.addEventListener('click', () => {
            filterProducts();
            toggleDrawer(false);
        });
    }

    // Drawer Toggle
    function toggleDrawer(isOpen) {
        if (isOpen) {
            filterDrawer.classList.add('open');
            drawerOverlay.classList.add('visible');
            document.body.style.overflow = 'hidden';
        } else {
            filterDrawer.classList.remove('open');
            drawerOverlay.classList.remove('visible');
            document.body.style.overflow = '';
        }
    }

    if (openDrawerBtn) openDrawerBtn.addEventListener('click', () => toggleDrawer(true));
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => toggleDrawer(false));
    if (drawerOverlay) drawerOverlay.addEventListener('click', () => toggleDrawer(false));
});
