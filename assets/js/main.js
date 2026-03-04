/* Main JavaScript for PurpleNest */

// Global Cart Object
const Cart = {
    key: 'purplenest_cart',

    getItems() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    },

    addItem(product, quantity = 1) {
        const items = this.getItems();
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            items.push({ ...product, quantity });
        }

        localStorage.setItem(this.key, JSON.stringify(items));
        this.updateCartCount();
        this.showToast(`Added ${product.name} to cart!`);
    },

    removeItem(productId) {
        let items = this.getItems();
        items = items.filter(item => item.id !== productId);
        localStorage.setItem(this.key, JSON.stringify(items));
        this.updateCartCount();
        return items;
    },

    updateQuantity(productId, quantity) {
        const items = this.getItems();
        const item = items.find(i => i.id === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                return this.removeItem(productId);
            }
            localStorage.setItem(this.key, JSON.stringify(items));
        }
        this.updateCartCount();
        return items;
    },

    clear() {
        localStorage.removeItem(this.key);
        this.updateCartCount();
    },

    updateCartCount() {
        const items = this.getItems();
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        const badges = document.querySelectorAll('.cart-count');
        badges.forEach(badge => {
            badge.innerText = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        document.body.appendChild(toast);

        // Simple Toast Styles (injected here or should be in CSS)
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'var(--primary)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            transform: 'translateY(10px)'
        });

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    count() {
        return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
    }
};

const Auth = {
    userKey: 'purplenest_user',
    redirectKey: 'purplenest_redirect',

    login(email) {
        localStorage.setItem(this.userKey, JSON.stringify({ email, loggedIn: true }));
        const redirectUrl = sessionStorage.getItem(this.redirectKey);
        if (redirectUrl) {
            sessionStorage.removeItem(this.redirectKey);
            window.location.href = redirectUrl;
        } else {
            window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
        }
    },

    logout() {
        localStorage.removeItem(this.userKey);
        window.location.reload();
    },

    isLoggedIn() {
        const user = JSON.parse(localStorage.getItem(this.userKey));
        return user && user.loggedIn;
    },

    checkAccess() {
        if (!this.isLoggedIn()) {
            sessionStorage.setItem(this.redirectKey, window.location.href);
            const path = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
            window.location.href = path;
            return false;
        }
        return true;
    }
};

const Wishlist = {
    key: 'purplenest_wishlist',

    getItems() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    },

    addItem(product) {
        const items = this.getItems();
        if (!items.find(item => item.id === product.id)) {
            items.push(product);
            localStorage.setItem(this.key, JSON.stringify(items));
            Cart.showToast(`Added ${product.name} to wishlist!`);
        } else {
            Cart.showToast(`${product.name} is already in your wishlist!`);
        }
    },

    removeItem(productId) {
        let items = this.getItems();
        items = items.filter(item => item.id !== productId);
        localStorage.setItem(this.key, JSON.stringify(items));
        return items;
    }
};

const Dashboard = {
    init() {
        // Find existing user dropdown instead of creating a new dashboard grid icon
        const userIcon = document.querySelector('.user-icon');
        if (!userIcon) return;

        const userDropdown = userIcon.querySelector('.user-dropdown');
        if (!userDropdown) return;


        // Mobile touch-click dropdown logic for the native user-icon
        const profileIconTrigger = userIcon.querySelector('i.far.fa-user');
        if (profileIconTrigger) {
            profileIconTrigger.style.cursor = "pointer";
            profileIconTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
        }

        document.addEventListener('click', (e) => {
            if (!userIcon.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                userDropdown.classList.remove('show');
            }
        });
    }
};

const Footer = {
    render() {
        const footers = document.querySelectorAll('.footer');
        if (footers.length === 0) return;

        // Determine path prefix
        const isSubfolder = window.location.pathname.includes('/pages/');
        const pathPrefix = isSubfolder ? '../' : '';
        const pagesPrefix = isSubfolder ? '' : 'pages/';

        const footerHTML = `
            <div class="container">
                <div class="footer-top">
                    <div class="footer-brand">
                        <a href="${pathPrefix}index.html" class="logo">
                            <div class="logo-icon"><i class="fas fa-crown"></i></div>
                            <div class="logo-text">Purple<span>Nest</span></div>
                        </a>
                        <p class="footer-description">
                            Elevating your lifestyle with a curated collection of premium essentials. Experience the perfect blend of luxury, innovation, and artisan quality.
                        </p>
                        <div class="social-links">
                            <a href="#" class="social-icon" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="social-icon" title="Twitter"><i class="fab fa-twitter"></i></a>
                            <a href="#" class="social-icon" title="Instagram"><i class="fab fa-instagram"></i></a>
                            <a href="#" class="social-icon" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                    
                    <div class="footer-column">
                        <h3>Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="${pathPrefix}index.html">Home</a></li>
                            <li><a href="${pathPrefix}home2.html">Home2</a></li>
                            <li><a href="${pagesPrefix}about.html">About Us</a></li>
                            <li><a href="${pagesPrefix}shop.html">Shop Collection</a></li>
                            <li><a href="${pagesPrefix}services.html">Our Services</a></li>
                            <li><a href="${pagesPrefix}contact.html">Contact Us</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h3>Support</h3>
                        <ul class="footer-links">
                            <li><a href="${pagesPrefix}faq.html">Common FAQs</a></li>
                            <li><a href="${pagesPrefix}shipping.html">Shipping Info</a></li>
                            <li><a href="${pagesPrefix}privacy.html">Privacy Policy</a></li>
                            <li><a href="${pagesPrefix}contact.html">Help Desk</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h3>Categories</h3>
                        <ul class="footer-links">
                            <li><a href="${pagesPrefix}shop.html?cat=Fashion">Fashion</a></li>
                            <li><a href="${pagesPrefix}shop.html?cat=Electronics">Electronics</a></li>
                            <li><a href="${pagesPrefix}shop.html?cat=Home%20Decor">Home Decor</a></li>
                            <li><a href="${pagesPrefix}shop.html?cat=Beauty">Beauty</a></li>
                            <li><a href="${pagesPrefix}shop.html?cat=Accessories">Accessories</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h3>Contact Info</h3>
                        <ul class="footer-contact-info">
                            <li>
                                <i class="fas fa-map-marker-alt"></i>
                                <span>123 Luxury Lane, Prestige Tower, New York, NY 10001</span>
                            </li>
                            <li>
                                <i class="fas fa-phone"></i>
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li>
                                <i class="fas fa-envelope"></i>
                                <span>concierge@purplenest.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 PurpleNest Luxury Group. All Rights Reserved.</p>
                </div>
            </div>
        `;

        footers.forEach(footer => {
            footer.innerHTML = footerHTML;
        });
    }
};

// Main App Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Header and Footer if they don't exist (or if we want a single source of truth)
    // For this implementation, we will assume static HTML for better SEO/Performance initial load, 
    // but we can have a script that highlights active links or handles mobile menu.

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Create Nav Overlay
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }

    if (hamburger && navLinks) {
        // Add close button to mobile menu if it doesn't exist
        let closeBtn = navLinks.querySelector('.mobile-menu-close');
        if (!closeBtn) {
            closeBtn = document.createElement('div');
            closeBtn.className = 'mobile-menu-close';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            navLinks.insertBefore(closeBtn, navLinks.firstChild);
        }

        const toggleMenu = (open) => {
            if (open === undefined) open = !navLinks.classList.contains('active');

            if (open) {
                navLinks.classList.add('active');
                navOverlay.classList.add('visible');
                document.body.style.overflow = 'hidden';
                hamburger.style.visibility = 'hidden';
            } else {
                navLinks.classList.remove('active');
                navOverlay.classList.remove('visible');
                document.body.style.overflow = '';
                hamburger.style.visibility = 'visible';
            }
        };

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close button click
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(false);
        });

        // Close menu when clicking overlay
        navOverlay.addEventListener('click', () => toggleMenu(false));

        // Close menu when clicking a link inside
        navLinks.addEventListener('click', (e) => {
            if (e.target.closest('a.nav-link')) {
                toggleMenu(false);
            }
        });

        // Close menu when clicking outside (not strictly needed with overlay but good for safety)
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                toggleMenu(false);
            }
        });
    }

    // Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // User Dropdown Logic
    const userIcon = document.querySelector('.user-icon');
    const userDropdown = document.querySelector('.user-dropdown');

    if (userIcon && userDropdown) {
        userIcon.addEventListener('click', (e) => {
            // Only toggle if the click was on the icon or the wrapper, not on the links themselves
            if (e.target.closest('a')) return;

            e.stopPropagation();
            userDropdown.classList.toggle('show');

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        document.addEventListener('click', (e) => {
            if (userDropdown.classList.contains('show') && !userIcon.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });

        // Prevent click within dropdown from closing it unless it's a link
        userDropdown.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                e.stopPropagation();
            }
        });
    }

    // Initialize Dashboard Component
    Dashboard.init();

    // Initialize Cart Count
    Cart.updateCartCount();

    // Initialize Global Footer
    Footer.render();
});
