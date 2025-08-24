// Enhanced product database with categories and images
const products = [
    // Vitamins
    { id: 1, name: "Vitamin C 1000mg", price: 650, description: "Immune system support tablets - 30 tablets", stock: 45, category: "vitamins", icon: "fas fa-lemon" },
    { id: 2, name: "Vitamin D3 2000 IU", price: 890, description: "Bone health and immunity support - 60 capsules", stock: 35, category: "vitamins", icon: "fas fa-sun" },
    { id: 3, name: "Vitamin B Complex", price: 780, description: "Energy metabolism support - 30 tablets", stock: 38, category: "vitamins", icon: "fas fa-bolt" },
    { id: 4, name: "Vitamin E 400 IU", price: 720, description: "Antioxidant protection - 30 soft gels", stock: 28, category: "vitamins", icon: "fas fa-seedling" },
    
    // Supplements
    { id: 5, name: "Omega 3 Fish Oil", price: 1250, description: "High-quality omega-3 supplement - 60 capsules", stock: 50, category: "supplements", icon: "fas fa-fish" },
    { id: 6, name: "Calcium + Vitamin D", price: 890, description: "Essential calcium and vitamin D supplement - 60 tablets", stock: 30, category: "supplements", icon: "fas fa-bone" },
    { id: 7, name: "Multivitamin Complex", price: 1480, description: "Complete daily nutrition supplement - 30 tablets", stock: 25, category: "supplements", icon: "fas fa-pills" },
    { id: 8, name: "Iron + Folic Acid", price: 720, description: "For anemia prevention and treatment - 30 tablets", stock: 35, category: "supplements", icon: "fas fa-heart" },
    { id: 9, name: "Magnesium Tablets", price: 580, description: "Muscle and nerve function support - 60 tablets", stock: 40, category: "supplements", icon: "fas fa-dumbbell" },
    { id: 10, name: "Probiotics Capsules", price: 1650, description: "Digestive health support - 30 capsules", stock: 20, category: "supplements", icon: "fas fa-seedling" },
    { id: 11, name: "Zinc Sulfate Tablets", price: 450, description: "Immune system and wound healing - 30 tablets", stock: 55, category: "supplements", icon: "fas fa-shield-alt" },
    { id: 12, name: "Glucosamine Chondroitin", price: 1890, description: "Joint health and mobility support - 60 capsules", stock: 15, category: "supplements", icon: "fas fa-running" },
    
    // Medicines
    { id: 13, name: "Paracetamol 500mg", price: 120, description: "Pain relief and fever reducer - 10 tablets", stock: 100, category: "medicines", icon: "fas fa-thermometer-half" },
    { id: 14, name: "Ibuprofen 400mg", price: 180, description: "Anti-inflammatory pain relief - 10 tablets", stock: 85, category: "medicines", icon: "fas fa-medkit" },
    { id: 15, name: "Antacid Tablets", price: 250, description: "Heartburn and acid indigestion relief - 20 tablets", stock: 70, category: "medicines", icon: "fas fa-stomach" },
    { id: 16, name: "Cough Syrup", price: 320, description: "Dry cough relief - 100ml bottle", stock: 45, category: "medicines", icon: "fas fa-lungs" },
    { id: 17, name: "Allergy Relief Tablets", price: 450, description: "Antihistamine for allergies - 10 tablets", stock: 60, category: "medicines", icon: "fas fa-leaf" },
    
    // Skincare
    { id: 18, name: "Sunscreen SPF 50", price: 890, description: "Broad spectrum UV protection - 75ml", stock: 40, category: "skincare", icon: "fas fa-sun" },
    { id: 19, name: "Moisturizing Cream", price: 650, description: "Daily hydrating cream - 100ml", stock: 35, category: "skincare", icon: "fas fa-tint" },
    { id: 20, name: "Anti-Acne Gel", price: 780, description: "Acne treatment gel - 30g", stock: 25, category: "skincare", icon: "fas fa-spa" },
    { id: 21, name: "Face Wash", price: 420, description: "Gentle daily cleanser - 150ml", stock: 50, category: "skincare", icon: "fas fa-pump-soap" },
    
    // Baby Care
    { id: 22, name: "Baby Lotion", price: 580, description: "Gentle moisturizing lotion - 200ml", stock: 30, category: "baby", icon: "fas fa-baby" },
    { id: 23, name: "Baby Shampoo", price: 450, description: "Tear-free gentle shampoo - 200ml", stock: 35, category: "baby", icon: "fas fa-shower" },
    { id: 24, name: "Diaper Rash Cream", price: 680, description: "Protective barrier cream - 100g", stock: 25, category: "baby", icon: "fas fa-heart" },
    { id: 25, name: "Baby Powder", price: 320, description: "Gentle talc-free powder - 200g", stock: 40, category: "baby", icon: "fas fa-feather-alt" }
];

// Application State
const AppState = {
    isLoggedIn: false,
    userType: null,
    currentUser: null,
    cart: [],
    orders: [],
    filteredProducts: products,
    currentCategory: 'all'
};

// DOM Elements
const elements = {
    loginBtn: document.getElementById('loginBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    logoutItem: document.getElementById('logoutItem'),
    cartBtn: document.getElementById('cartBtn'),
    cartBadge: document.getElementById('cartBadge'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartOverlay: document.getElementById('cartOverlay'),
    closeCartBtn: document.getElementById('closeCartBtn'),
    productsGrid: document.getElementById('productsGrid'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    notification: document.getElementById('notification'),
    loginModal: null
};

// Utility Functions
const Utils = {
    showNotification: function(message, type = 'success') {
        const notification = elements.notification;
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    },

    formatPrice: function(price) {
        return `Rs. ${price.toLocaleString()}`;
    },

    updateCartUI: function() {
        const cartCount = AppState.cart.reduce((total, item) => total + item.quantity, 0);
        
        if (cartCount > 0) {
            elements.cartBadge.textContent = cartCount;
            elements.cartBadge.classList.remove('d-none');
            elements.checkoutBtn.disabled = !AppState.isLoggedIn;
        } else {
            elements.cartBadge.classList.add('d-none');
            elements.checkoutBtn.disabled = true;
        }
    },

    updateNavigationUI: function() {
        if (AppState.isLoggedIn) {
            elements.loginBtn.parentElement.classList.add('d-none');
            elements.logoutItem.classList.remove('d-none');
            elements.checkoutBtn.disabled = AppState.cart.length === 0;
        } else {
            elements.loginBtn.parentElement.classList.remove('d-none');
            elements.logoutItem.classList.add('d-none');
            elements.checkoutBtn.disabled = true;
        }
    },

    scrollToSection: function(sectionId) {
        const section = document.querySelector(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
};

// Product Display Functions
const ProductDisplay = {
    renderProducts: function(productsToRender = AppState.filteredProducts) {
        const grid = elements.productsGrid;
        
        if (productsToRender.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info">
                        <i class="fas fa-search"></i> No products found matching your criteria.
                        <button class="btn btn-link" onclick="ProductDisplay.clearFilters()">Clear filters</button>
                    </div>
                </div>
            `;
            return;
        }

        grid.innerHTML = productsToRender.map(product => `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" data-category="${product.category}">
                <div class="product-card">
                    <div class="product-image">
                        <i class="${product.icon}"></i>
                    </div>
                    <div class="product-body">
                        <h5 class="product-title">${product.name}</h5>
                        <p class="text-muted small">${product.description}</p>
                        <div class="product-price">${Utils.formatPrice(product.price)}</div>
                        <div class="product-stock ${product.stock < 10 ? 'text-warning' : 'text-muted'}">
                            ${product.stock === 0 ? 'Out of Stock' : `Stock: ${product.stock} available`}
                            ${product.stock < 10 && product.stock > 0 ? ' (Low Stock!)' : ''}
                        </div>
                        <button class="add-to-cart-btn" onclick="Cart.add(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i> ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add animation to product cards
        const cards = grid.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.5s ease-out forwards';
            }, index * 100);
        });
    },

    filterByCategory: function(category) {
        AppState.currentCategory = category;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Filter products
        if (category === 'all') {
            AppState.filteredProducts = products;
        } else {
            AppState.filteredProducts = products.filter(product => product.category === category);
        }
        
        this.renderProducts();
        Utils.showNotification(`Showing ${AppState.filteredProducts.length} products in ${category === 'all' ? 'all categories' : category}`, 'success');
    },

    searchProducts: function() {
        const query = elements.searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            AppState.filteredProducts = AppState.currentCategory === 'all' ? 
                products : 
                products.filter(p => p.category === AppState.currentCategory);
        } else {
            let searchBase = AppState.currentCategory === 'all' ? 
                products : 
                products.filter(p => p.category === AppState.currentCategory);
                
            AppState.filteredProducts = searchBase.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
        }
        
        this.renderProducts();
        
        if (query) {
            Utils.showNotification(`Found ${AppState.filteredProducts.length} products for "${query}"`, 'success');
        } else {
            Utils.showNotification(`Showing ${AppState.filteredProducts.length} products`, 'success');
        }
    },

    clearFilters: function() {
        elements.searchInput.value = '';
        this.filterByCategory('all');
    }
};

// Shopping Cart Functions
const Cart = {
    add: function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product || product.stock === 0) {
            Utils.showNotification('Product not available!', 'error');
            return;
        }

        const existingItem = AppState.cart.find(item => item.id === productId);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity += 1;
                Utils.showNotification(`${product.name} quantity updated! (${existingItem.quantity})`, 'success');
            } else {
                Utils.showNotification('Maximum stock reached!', 'error');
                return;
            }
        } else {
            AppState.cart.push({ ...product, quantity: 1 });
            Utils.showNotification(`${product.name} added to cart!`, 'success');
        }

        this.updateDisplay();
        Utils.updateCartUI();

        // Animate cart button
        elements.cartBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            elements.cartBtn.style.transform = 'scale(1)';
        }, 200);
    },

    remove: function(productId) {
        const product = products.find(p => p.id === productId);
        AppState.cart = AppState.cart.filter(item => item.id !== productId);
        this.updateDisplay();
        Utils.updateCartUI();
        Utils.showNotification(`${product.name} removed from cart`, 'success');
    },

    updateQuantity: function(productId, newQuantity) {
        const item = AppState.cart.find(item => item.id === productId);
        const product = products.find(p => p.id === productId);
        
        if (!item || !product) return;
        
        if (newQuantity <= 0) {
            this.remove(productId);
            return;
        }
        
        if (newQuantity <= product.stock) {
            item.quantity = newQuantity;
            this.updateDisplay();
            Utils.updateCartUI();
            Utils.showNotification(`${product.name} quantity updated`, 'success');
        } else {
            Utils.showNotification('Maximum stock reached!', 'error');
        }
    },

    getTotal: function() {
        return AppState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getItemCount: function() {
        return AppState.cart.reduce((total, item) => total + item.quantity, 0);
    },

    updateDisplay: function() {
        const cartItems = elements.cartItems;
        const cartTotal = elements.cartTotal;

        if (AppState.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Your cart is empty</p>
                    <button class="btn btn-primary-custom btn-sm" onclick="Cart.closeCart(); Utils.scrollToSection('#products')">
                        <i class="fas fa-shopping-bag"></i> Start Shopping
                    </button>
                </div>
            `;
            cartTotal.textContent = Utils.formatPrice(0);
            return;
        }

        cartItems.innerHTML = AppState.cart.map(item => `
            <div class="cart-item">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">${Utils.formatPrice(item.price)} each</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="Cart.remove(${item.id})" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-secondary" onclick="Cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="btn btn-outline-secondary" style="min-width: 45px;">${item.quantity}</span>
                        <button type="button" class="btn btn-outline-secondary" onclick="Cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <strong class="text-success">${Utils.formatPrice(item.price * item.quantity)}</strong>
                </div>
                ${item.quantity >= item.stock ? '<small class="text-warning">Maximum quantity reached</small>' : ''}
            </div>
        `).join('');

        cartTotal.textContent = Utils.formatPrice(this.getTotal());
    },

    checkout: function() {
        if (!AppState.isLoggedIn) {
            elements.loginModal.show();
            Utils.showNotification('Please login to complete your purchase', 'error');
            return;
        }

        if (AppState.cart.length === 0) {
            Utils.showNotification('Your cart is empty!', 'error');
            return;
        }

        // Show processing state
        elements.checkoutBtn.disabled = true;
        elements.checkoutBtn.innerHTML = '<span class="spinner"></span>Processing...';
        
        // Simulate checkout process
        setTimeout(() => {
            const order = {
                id: Date.now(),
                items: [...AppState.cart],
                total: this.getTotal(),
                date: new Date().toLocaleDateString(),
                status: 'Processing'
            };
            
            AppState.orders.push(order);
            
            Utils.showNotification(`Order placed successfully! Order ID: #${order.id}. Total: ${Utils.formatPrice(this.getTotal())}`, 'success');
            
            // Clear cart and reset UI
            AppState.cart = [];
            this.updateDisplay();
            Utils.updateCartUI();
            this.closeCart();
            
            // Reset checkout button
            elements.checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Proceed to Checkout';
            elements.checkoutBtn.disabled = true;
        }, 2000);
    },

    openCart: function() {
        elements.cartSidebar.classList.add('open');
        elements.cartOverlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        this.updateDisplay();
    },

    closeCart: function() {
        elements.cartSidebar.classList.remove('open');
        elements.cartOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
};

// Authentication Functions
const Auth = {
    login: function(email, password, userType) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simple validation - in real app, this would be server-side
                if (email && password.length >= 6) {
                    AppState.isLoggedIn = true;
                    AppState.userType = userType;
                    AppState.currentUser = { email, userType };
                    
                    Utils.updateNavigationUI();
                    Utils.showNotification(`Welcome back${userType === 'staff' ? ' (Staff)' : ''}!`, 'success');
                    
                    resolve({ success: true });
                } else {
                    Utils.showNotification('Please enter valid credentials (password must be at least 6 characters).', 'error');
                    resolve({ success: false });
                }
            }, 1000);
        });
    },

    logout: function() {
        AppState.isLoggedIn = false;
        AppState.userType = null;
        AppState.currentUser = null;
        
        // Clear sensitive data
        AppState.cart = [];
        Cart.updateDisplay();
        Cart.closeCart();
        
        Utils.updateNavigationUI();
        Utils.updateCartUI();
        Utils.showNotification('You have been logged out successfully.', 'success');
    },

    register: function() {
        // Placeholder for registration functionality
        Utils.showNotification('Registration feature coming soon! For now, you can login with any email and password (6+ characters).', 'success');
    }
};

// Initialize Application
const App = {
    init: function() {
        this.initializeElements();
        this.attachEventListeners();
        this.loadInitialData();
        this.setupKeyboardShortcuts();
    },

    initializeElements: function() {
        // Initialize Bootstrap modal
        elements.loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    },

    attachEventListeners: function() {
        // Authentication
        elements.loginBtn.addEventListener('click', () => elements.loginModal.show());
        elements.logoutBtn.addEventListener('click', () => Auth.logout());

        // Cart functionality
        elements.cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Cart.openCart();
        });
        elements.closeCartBtn.addEventListener('click', Cart.closeCart);
        elements.cartOverlay.addEventListener('click', Cart.closeCart);
        elements.checkoutBtn.addEventListener('click', Cart.checkout);

        // Search functionality
        elements.searchBtn.addEventListener('click', ProductDisplay.searchProducts);
        elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                ProductDisplay.searchProducts();
            }
        });

        // Real-time search as user types (debounced)
        let searchTimeout;
        elements.searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(ProductDisplay.searchProducts, 500);
        });

        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                ProductDisplay.filterByCategory(category);
            });
        });

        // Login form
        document.getElementById('loginSubmitBtn').addEventListener('click', this.handleLogin);
        document.getElementById('registerBtn').addEventListener('click', Auth.register);
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin();
            }
        });

        // Smooth scrolling navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && !href.includes('cartBtn')) {
                    e.preventDefault();
                    Utils.scrollToSection(href);
                }
            });
        });
    },

    handleLogin: async function() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const userType = document.getElementById('userType').value;

        if (!email || !password) {
            Utils.showNotification('Please enter both email and password.', 'error');
            return;
        }

        const button = document.getElementById('loginSubmitBtn');
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner"></span>Logging in...';
        button.disabled = true;

        const result = await Auth.login(email, password, userType);
        
        if (result.success) {
            elements.loginModal.hide();
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        }

        button.innerHTML = originalText;
        button.disabled = false;
    },

    loadInitialData: function() {
        // Initial setup
        ProductDisplay.renderProducts();
        Utils.updateNavigationUI();
        Utils.updateCartUI();
        Cart.updateDisplay();

        // Add some sample notification for demo
        setTimeout(() => {
            Utils.showNotification('Welcome to Kingsway Healthcare! Browse our quality products.', 'success');
        }, 1000);
    },

    setupKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+L to open login
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                if (!AppState.isLoggedIn) {
                    elements.loginModal.show();
                }
            }
            
            // Escape to close modals/cart
            if (e.key === 'Escape') {
                elements.loginModal.hide();
                Cart.closeCart();
            }

            // Ctrl+K to focus search
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                elements.searchInput.focus();
            }
        });
    }
};

// Form Validation
const Validation = {
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validatePassword: function(password) {
        return password && password.length >= 6;
    },

    showFieldError: function(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add('is-invalid');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    },

    clearFieldError: function(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('is-invalid');
        
        const errorMessage = field.parentNode.querySelector('.invalid-feedback');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);

// Handle page visibility change (pause/resume functionality)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Refresh data when page becomes visible again
        ProductDisplay.renderProducts();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    Utils.showNotification('Connection restored!', 'success');
});

window.addEventListener('offline', () => {
    Utils.showNotification('No internet connection. Some features may not work.', 'error');
});

// Export functions for global access (if needed)
window.Cart = Cart;
window.Auth = Auth;
window.ProductDisplay = ProductDisplay;
window.Utils = Utils;