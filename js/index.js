const AppState = {
    isLoggedIn: false,
    userType: null,
    currentUser: null,
    cart: [],
    orders: []
};

// Product database
const products = [
    { id: 1, name: "Omega 3 Fish Oil", price: 1250, description: "High-quality omega-3 supplement", stock: 50 },
    { id: 2, name: "Calcium + Vitamin D Tablets", price: 890, description: "Essential calcium and vitamin D supplement", stock: 30 },
    { id: 3, name: "Vitamin C 1000mg", price: 650, description: "Immune system support tablets", stock: 45 },
    { id: 4, name: "Multivitamin Complex", price: 1480, description: "Complete daily nutrition supplement", stock: 25 },
    { id: 5, name: "Iron + Folic Acid", price: 720, description: "For anemia prevention and treatment", stock: 35 },
    { id: 6, name: "Magnesium Tablets", price: 580, description: "Muscle and nerve function support", stock: 40 },
    { id: 7, name: "Probiotics Capsules", price: 1650, description: "Digestive health support", stock: 20 },
    { id: 8, name: "Zinc Sulfate Tablets", price: 450, description: "Immune system and wound healing", stock: 55 },
    { id: 9, name: "Vitamin B Complex", price: 780, description: "Energy metabolism support", stock: 38 },
    { id: 10, name: "Glucosamine Chondroitin", price: 1890, description: "Joint health and mobility support", stock: 15 }
];

// DOM Elements
const elements = {
    loginBtn: document.getElementById('loginBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    logoutItem: document.getElementById('logoutItem'),
    loginModal: new bootstrap.Modal(document.getElementById('loginModal')),
    dashboard: document.getElementById('dashboard'),
    hero: document.querySelector('.hero'),
    services: document.getElementById('services'),
    features: document.getElementById('features'),
    contact: document.getElementById('contact'),
    notification: document.getElementById('notification')
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

    toggleSections: function(showDashboard = false) {
        if (showDashboard) {
            elements.dashboard.style.display = 'block';
            elements.hero.style.display = 'none';
            elements.services.style.display = 'none';
            elements.features.style.display = 'none';
            elements.contact.style.display = 'none';
        } else {
            elements.dashboard.style.display = 'none';
            elements.hero.style.display = 'block';
            elements.services.style.display = 'block';
            elements.features.style.display = 'block';
            elements.contact.style.display = 'block';
        }
    },

    updateNavigationUI: function() {
        if (AppState.isLoggedIn) {
            elements.loginBtn.parentElement.classList.add('d-none');
            elements.logoutItem.classList.remove('d-none');
        } else {
            elements.loginBtn.parentElement.classList.remove('d-none');
            elements.logoutItem.classList.add('d-none');
        }
    },

    formatPrice: function(price) {
        return `Rs. ${price.toLocaleString()}`;
    }
};

// Authentication Module
const Auth = {
    login: function(email, password, userType) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email && password) {
                    AppState.isLoggedIn = true;
                    AppState.userType = userType;
                    AppState.currentUser = { email, userType };
                    
                    Utils.updateNavigationUI();
                    Utils.toggleSections(true);
                    
                    if (userType === 'customer') {
                        Dashboard.renderCustomerDashboard();
                    } else {
                        Dashboard.renderStaffDashboard();
                    }
                    
                    Utils.showNotification(`Welcome back! Logged in as ${userType}.`, 'success');
                    resolve({ success: true });
                } else {
                    Utils.showNotification('Please enter valid credentials.', 'error');
                    resolve({ success: false });
                }
            }, 1000);
        });
    },

    logout: function() {
        AppState.isLoggedIn = false;
        AppState.userType = null;
        AppState.currentUser = null;
        AppState.cart = [];
        
        Utils.updateNavigationUI();
        Utils.toggleSections(false);
        Utils.showNotification('You have been logged out successfully.', 'success');
    }
};

// Shopping Cart Module
const Cart = {
    add: function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = AppState.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            AppState.cart.push({ ...product, quantity: 1 });
        }
        
        this.updateCartDisplay();
        Utils.showNotification(`${product.name} added to cart!`, 'success');
    },

    remove: function(productId) {
        AppState.cart = AppState.cart.filter(item => item.id !== productId);
        this.updateCartDisplay();
        Utils.showNotification('Item removed from cart', 'success');
    },

    updateQuantity: function(productId, quantity) {
        const item = AppState.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.updateCartDisplay();
        }
    },

    getTotal: function() {
        return AppState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    updateCartDisplay: function() {
        const cartContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartContainer) return;
        
        if (AppState.cart.length === 0) {
            cartContainer.innerHTML = '<p class="text-muted">Your cart is empty</p>';
            cartTotal.textContent = Utils.formatPrice(0);
            return;
        }
        
        cartContainer.innerHTML = AppState.cart.map(item => `
            <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                <div>
                    <h6>${item.name}</h6>
                    <small class="text-muted">${Utils.formatPrice(item.price)} each</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="Cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="Cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="btn btn-sm btn-danger ms-2" onclick="Cart.remove(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        cartTotal.textContent = Utils.formatPrice(this.getTotal());
    },

    checkout: function() {
        if (AppState.cart.length === 0) {
            Utils.showNotification('Your cart is empty!', 'error');
            return;
        }
        
        const order = {
            id: Date.now(),
            items: [...AppState.cart],
            total: this.getTotal(),
            date: new Date().toLocaleDateString(),
            status: 'Processing'
        };
        
        AppState.orders.push(order);
        AppState.cart = [];
        
        this.updateCartDisplay();
        Dashboard.showShippingInfo(order);
        Utils.showNotification('Order placed successfully!', 'success');
    }
};

// Dashboard Module
const Dashboard = {
    renderCustomerDashboard: function() {
        const dashboardContainer = document.querySelector('.dashboard .container');
        dashboardContainer.innerHTML = `
            <div class="row">
                <div class="col-md-8">
                    <div class="dashboard-card">
                        <h3><i class="fas fa-search"></i> Search Products</h3>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="Search medications..." id="searchInput">
                            <button class="btn btn-dashboard" id="searchBtn">
                                <i class="fas fa-search"></i> Search
                            </button>
                        </div>
                        <div id="searchResults">
                            ${this.renderProductGrid()}
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="dashboard-card">
                        <h3><i class="fas fa-shopping-cart"></i> Shopping Cart</h3>
                        <div id="cartItems">
                            <p class="text-muted">Your cart is empty</p>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-between">
                            <strong>Total: <span id="cartTotal">${Utils.formatPrice(0)}</span></strong>
                        </div>
                        <button class="btn btn-primary w-100 mt-3" onclick="Cart.checkout()">
                            <i class="fas fa-credit-card"></i> Checkout
                        </button>
                    </div>
                    
                    <div class="dashboard-card">
                        <h3><i class="fas fa-cog"></i> Account Settings</h3>
                        <button class="btn btn-dashboard mb-2 w-100" onclick="Dashboard.updateStatus()">
                            <i class="fas fa-user-edit"></i> Update Status
                        </button>
                        <button class="btn btn-dashboard w-100" onclick="Dashboard.recoverPassword()">
                            <i class="fas fa-key"></i> Change Password
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="shippingModal" class="modal fade" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Shipping Information</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="shippingContent">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.attachEventListeners();
    },

    renderStaffDashboard: function() {
        const dashboardContainer = document.querySelector('.dashboard .container');
        dashboardContainer.innerHTML = `
            <div class="row">
                <div class="col-md-8">
                    <div class="dashboard-card">
                        <h3><i class="fas fa-pills"></i> Prescription Management</h3>
                        <div class="row">
                            <div class="col-md-6">
                                <button class="btn btn-dashboard mb-2" onclick="Dashboard.uploadPrescription()">
                                    <i class="fas fa-upload"></i> Upload Prescription
                                </button>
                            </div>
                            <div class="col-md-6">
                                <button class="btn btn-dashboard mb-2" onclick="Dashboard.requestRefill()">
                                    <i class="fas fa-redo"></i> Request Refill
                                </button>
                            </div>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-dashboard" onclick="Dashboard.viewHistory()">
                                <i class="fas fa-history"></i> View Order History
                            </button>
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <h3><i class="fas fa-truck"></i> Delivery Management</h3>
                        <button class="btn btn-dashboard" onclick="Dashboard.scheduleDelivery()">
                            <i class="fas fa-calendar-alt"></i> Schedule Delivery
                        </button>
                    </div>
                    
                    <div class="dashboard-card">
                        <h3><i class="fas fa-user-tie"></i> Staff Functions</h3>
                        <div class="row">
                            <div class="col-md-6">
                                <button class="btn btn-dashboard mb-2" onclick="Dashboard.sendNotifications()">
                                    <i class="fas fa-bell"></i> Send Notifications
                                </button>
                            </div>
                            <div class="col-md-6">
                                <button class="btn btn-dashboard mb-2" onclick="Dashboard.manageInventory()">
                                    <i class="fas fa-boxes"></i> Manage Inventory
                                </button>
                            </div>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-dashboard" onclick="Dashboard.viewRefillRequests()">
                                <i class="fas fa-list"></i> View Refill Requests
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="dashboard-card">
                        <h3><i class="fas fa-bell"></i> Notifications</h3>
                        <div id="notificationsList">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Prescription refill available for Medication A
                            </div>
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle"></i> Delivery scheduled for tomorrow
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <h3><i class="fas fa-cog"></i> Account Settings</h3>
                        <button class="btn btn-dashboard mb-2" onclick="Dashboard.updateStatus()">
                            <i class="fas fa-user-edit"></i> Update Status
                        </button>
                        <button class="btn btn-dashboard" onclick="Dashboard.recoverPassword()">
                            <i class="fas fa-key"></i> Change Password
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderProductGrid: function(filteredProducts = products) {
        return `
            <div class="row">
                ${filteredProducts.map(product => `
                    <div class="col-md-6 mb-3">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">${product.description}</p>
                                <p class="card-text"><strong>${Utils.formatPrice(product.price)}</strong></p>
                                <p class="card-text"><small class="text-muted">Stock: ${product.stock}</small></p>
                                <button class="btn btn-primary btn-sm" onclick="Cart.add(${product.id})">
                                    <i class="fas fa-cart-plus"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    attachEventListeners: function() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', this.searchProducts);
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchProducts();
                }
            });
        }
    },

    searchProducts: function() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
        
        document.getElementById('searchResults').innerHTML = Dashboard.renderProductGrid(filteredProducts);
        Utils.showNotification(`Found ${filteredProducts.length} products`, 'success');
    },

    showShippingInfo: function(order) {
        const shippingModal = new bootstrap.Modal(document.getElementById('shippingModal'));
        const shippingContent = document.getElementById('shippingContent');
        
        shippingContent.innerHTML = `
            <div class="text-center">
                <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
                <h4 class="mt-3">Order Confirmed!</h4>
                <p class="text-muted">Order ID: #${order.id}</p>
            </div>
            
            <div class="mt-4">
                <h5>Order Summary:</h5>
                <div class="border rounded p-3">
                    ${order.items.map(item => `
                        <div class="d-flex justify-content-between">
                            <span>${item.name} x${item.quantity}</span>
                            <span>${Utils.formatPrice(item.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                    <hr>
                    <div class="d-flex justify-content-between">
                        <strong>Total: ${Utils.formatPrice(order.total)}</strong>
                    </div>
                </div>
            </div>
            
            <div class="mt-4">
                <h5>Shipping Information:</h5>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> Your order will be delivered within 2-3 business days.
                </div>
                <ul class="list-unstyled">
                    <li><i class="fas fa-truck"></i> Standard Delivery</li>
                    <li><i class="fas fa-map-marker-alt"></i> Delivery Address: 28/1 BELLANTHARA ROAD, NEDIMALA, DEHIWALA</li>
                    <li><i class="fas fa-phone"></i> Contact: +94 77 412 2776</li>
                </ul>
            </div>
            
            <div class="mt-4">
                <h5>Tracking Information:</h5>
                <div class="progress mb-2">
                    <div class="progress-bar" role="progressbar" style="width: 25%"></div>
                </div>
                <small class="text-muted">Status: Order Processing</small>
            </div>
        `;
        
        shippingModal.show();
    },

    // Staff functions
    uploadPrescription: function() {
        Utils.showNotification('Prescription upload feature activated!', 'success');
    },

    requestRefill: function() {
        Utils.showNotification('Refill request submitted!', 'success');
    },

    viewHistory: function() {
        Utils.showNotification('Loading order history...', 'success');
    },

    scheduleDelivery: function() {
        Utils.showNotification('Delivery scheduling interface opened!', 'success');
    },

    sendNotifications: function() {
        Utils.showNotification('Notifications sent to all customers!', 'success');
    },

    manageInventory: function() {
        Utils.showNotification('Inventory management system opened!', 'success');
    },

    viewRefillRequests: function() {
        Utils.showNotification('Viewing all refill requests...', 'success');
    },

    updateStatus: function() {
        Utils.showNotification('Status update interface opened!', 'success');
    },

    recoverPassword: function() {
        Utils.showNotification('Password recovery email sent!', 'success');
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Login button click
    elements.loginBtn.addEventListener('click', function() {
        elements.loginModal.show();
    });

    // Logout button click
    elements.logoutBtn.addEventListener('click', function() {
        Auth.logout();
    });

    // Login form submission
    document.getElementById('loginSubmitBtn').addEventListener('click', async function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const userType = document.getElementById('userType').value;

        if (!email || !password) {
            Utils.showNotification('Please enter valid credentials.', 'error');
            return;
        }

        const button = this;
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
    });

    // Register button click
    document.getElementById('registerBtn').addEventListener('click', function() {
        Utils.showNotification('Registration form would open here!', 'success');
    });

    // Get Started button
    document.getElementById('getStartedBtn').addEventListener('click', function() {
        elements.loginModal.show();
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Added animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .feature-item').forEach(el => {
        observer.observe(el);
    });

    // Initialize navigation
    Utils.updateNavigationUI();

    // Added Enter key support for login form
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginSubmitBtn').click();
        }
    });

    // Added typing effect to hero title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = function() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
});

// keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        if (!AppState.isLoggedIn) {
            elements.loginModal.show();
        }
    }
    
    if (e.key === 'Escape') {
        elements.loginModal.hide();
    }
});

// Form validation
const validateForm = function(email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
        Utils.showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!password || password.length < 6) {
        Utils.showNotification('Password must be at least 6 characters long.', 'error');
        return false;
    }
    return true;
};