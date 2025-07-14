const AppState = {
    isLoggedIn: false,
    userType: null,
    currentUser: null
};

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
    }
};

// Authentication Module
const Auth = {
    login: function(email, password, userType) {
        return new Promise((resolve) => {
            // Simulate API call
            setTimeout(() => {
                if (email && password) {
                    AppState.isLoggedIn = true;
                    AppState.userType = userType;
                    AppState.currentUser = { email, userType };
                    
                    Utils.updateNavigationUI();
                    Utils.toggleSections(true);
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
        
        Utils.updateNavigationUI();
        Utils.toggleSections(false);
        Utils.showNotification('You have been logged out successfully.', 'success');
    },

    register: function(email, password, userType) {
        return new Promise((resolve) => {
            setTimeout(() => {
                Utils.showNotification('Registration successful! Please login.', 'success');
                resolve({ success: true });
            }, 1000);
        });
    }
};

// Dashboard Module
const Dashboard = {
    uploadPrescription: function() {
        Utils.showNotification('Prescription upload feature activated!', 'success');
        // Simulate file upload
        setTimeout(() => {
            Utils.showNotification('Prescription uploaded successfully!', 'success');
        }, 2000);
    },

    requestRefill: function() {
        Utils.showNotification('Refill request submitted!', 'success');
        // Add to notifications
        const notificationsList = document.getElementById('notificationsList');
        const newNotification = document.createElement('div');
        newNotification.className = 'alert alert-success';
        newNotification.innerHTML = '<i class="fas fa-check-circle"></i> Refill request processed';
        notificationsList.appendChild(newNotification);
    },

    viewHistory: function() {
        Utils.showNotification('Loading order history...', 'success');
        // Simulate loading history
        setTimeout(() => {
            Utils.showNotification('Order history loaded!', 'success');
        }, 1500);
    },

    scheduleDelivery: function() {
        Utils.showNotification('Delivery scheduling interface opened!', 'success');
        // Simulate scheduling
        setTimeout(() => {
            Utils.showNotification('Delivery scheduled for tomorrow!', 'success');
        }, 2000);
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

        const button = this;
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner"></span>Logging in...';
        button.disabled = true;

        const result = await Auth.login(email, password, userType);
        
        if (result.success) {
            elements.loginModal.hide();
            // Clear form
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

    // Dashboard button event listeners
    document.getElementById('uploadPrescriptionBtn').addEventListener('click', Dashboard.uploadPrescription);
    document.getElementById('requestRefillBtn').addEventListener('click', Dashboard.requestRefill);
    document.getElementById('viewHistoryBtn').addEventListener('click', Dashboard.viewHistory);
    document.getElementById('scheduleDeliveryBtn').addEventListener('click', Dashboard.scheduleDelivery);
    document.getElementById('updateStatusBtn').addEventListener('click', Dashboard.updateStatus);
    document.getElementById('recoverPasswordBtn').addEventListener('click', Dashboard.recoverPassword);

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

    // Add animation on scroll
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

    // Observe service cards and feature items
    document.querySelectorAll('.service-card, .feature-item').forEach(el => {
        observer.observe(el);
    });

    // Initialize navigation
    Utils.updateNavigationUI();
});

// Additional interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero h1');
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

    // Add counter animation for statistics (if needed)
    const animateCounter = function(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const counter = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(counter);
            }
        }, 16);
    };

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

    // Enhanced login with validation
    document.getElementById('loginSubmitBtn').addEventListener('click', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const userType = document.getElementById('userType').value;

        if (!validateForm(email, password)) {
            return;
        }

        const button = this;
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner"></span>Logging in...';
        button.disabled = true;

        try {
            const result = await Auth.login(email, password, userType);
            
            if (result.success) {
                elements.loginModal.hide();
                // Clear form
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
            }
        } catch (error) {
            Utils.showNotification('Login failed. Please try again.', 'error');
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });

    // Add Enter key support for login form
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginSubmitBtn').click();
        }
    });

    // Dynamic notification system
    const NotificationSystem = {
        queue: [],
        isShowing: false,

        add: function(message, type = 'success') {
            this.queue.push({ message, type });
            this.processQueue();
        },

        processQueue: function() {
            if (this.isShowing || this.queue.length === 0) return;
            
            const { message, type } = this.queue.shift();
            this.show(message, type);
        },

        show: function(message, type) {
            this.isShowing = true;
            const notification = elements.notification;
            
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
                this.isShowing = false;
                
                // Process next in queue
                setTimeout(() => this.processQueue(), 500);
            }, 3000);
        }
    };

    // Replace the existing showNotification with the new system
    Utils.showNotification = NotificationSystem.add.bind(NotificationSystem);

    // Add some demo functionality for staff features
    const StaffFeatures = {
        sendNotifications: function() {
            Utils.showNotification('Notifications sent to all customers!', 'success');
        },

        manageInventory: function() {
            Utils.showNotification('Inventory management system opened!', 'success');
        },

        viewRefillRequests: function() {
            Utils.showNotification('Viewing all refill requests...', 'success');
        }
    };

    // Add staff-specific features to dashboard when staff logs in
    const originalLogin = Auth.login;
    Auth.login = async function(email, password, userType) {
        const result = await originalLogin.call(this, email, password, userType);
        
        if (result.success && userType === 'staff') {
            // Add staff-specific buttons to dashboard
            setTimeout(() => {
                const staffCard = document.createElement('div');
                staffCard.className = 'dashboard-card';
                staffCard.innerHTML = `
                    <h3><i class="fas fa-user-tie"></i> Staff Functions</h3>
                    <div class="row">
                        <div class="col-md-6">
                            <button class="btn btn-dashboard mb-2" id="sendNotificationsBtn">
                                <i class="fas fa-bell"></i> Send Notifications
                            </button>
                        </div>
                        <div class="col-md-6">
                            <button class="btn btn-dashboard mb-2" id="manageInventoryBtn">
                                <i class="fas fa-boxes"></i> Manage Inventory
                            </button>
                        </div>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-dashboard" id="viewRefillRequestsBtn">
                            <i class="fas fa-list"></i> View Refill Requests
                        </button>
                    </div>
                `;
                
                document.querySelector('.dashboard .container .row .col-md-8').appendChild(staffCard);
                
                // Add event listeners for staff buttons
                document.getElementById('sendNotificationsBtn').addEventListener('click', StaffFeatures.sendNotifications);
                document.getElementById('manageInventoryBtn').addEventListener('click', StaffFeatures.manageInventory);
                document.getElementById('viewRefillRequestsBtn').addEventListener('click', StaffFeatures.viewRefillRequests);
            }, 100);
        }
        
        return result;
    };

    // Add search functionality (placeholder)
    const searchHTML = `
        <div class="dashboard-card">
            <h3><i class="fas fa-search"></i> Search Products</h3>
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Search medications..." id="searchInput">
                <button class="btn btn-dashboard" id="searchBtn">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    `;

    // Initialize search when dashboard loads
    const originalToggleSections = Utils.toggleSections;
    Utils.toggleSections = function(showDashboard = false) {
        originalToggleSections.call(this, showDashboard);
        
        if (showDashboard) {
            setTimeout(() => {
                const searchContainer = document.querySelector('.dashboard .container .row .col-md-4');
                if (searchContainer && !document.getElementById('searchInput')) {
                    searchContainer.insertAdjacentHTML('beforeend', searchHTML);
                    
                    document.getElementById('searchBtn').addEventListener('click', function() {
                        const query = document.getElementById('searchInput').value;
                        if (query) {
                            Utils.showNotification(`Searching for "${query}"...`, 'success');
                            setTimeout(() => {
                                Utils.showNotification(`Found 5 results for "${query}"`, 'success');
                            }, 1500);
                        }
                    });
                }
            }, 100);
        }
    };

    // Add real-time clock to dashboard
    const addClock = function() {
        const clockHTML = `
            <div class="dashboard-card">
                <h3><i class="fas fa-clock"></i> Current Time</h3>
                <div class="text-center">
                    <h4 id="currentTime" style="color: var(--primary-color);"></h4>
                </div>
            </div>
        `;
        
        const clockContainer = document.querySelector('.dashboard .container .row .col-md-4');
        if (clockContainer) {
            clockContainer.insertAdjacentHTML('beforeend', clockHTML);
            
            // Update time every second
            const updateTime = () => {
                const now = new Date();
                const timeString = now.toLocaleTimeString();
                const dateString = now.toLocaleDateString();
                document.getElementById('currentTime').innerHTML = `${timeString}<br><small>${dateString}</small>`;
            };
            
            updateTime();
            setInterval(updateTime, 1000);
        }
    };

    // Add clock when dashboard is shown
    const originalToggleSections2 = Utils.toggleSections;
    Utils.toggleSections = function(showDashboard = false) {
        originalToggleSections2.call(this, showDashboard);
        
        if (showDashboard) {
            setTimeout(addClock, 200);
        }
    };
});

// Service Worker registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Note: In a real deployment, you would register a service worker here
        console.log('Service Worker support detected');
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+L for login
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        if (!AppState.isLoggedIn) {
            elements.loginModal.show();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        elements.loginModal.hide();
    }
});

// Add print functionality
const printPage = function() {
    window.print();
};

// Add accessibility features
document.addEventListener('DOMContentLoaded', function() {
    // Focus management for modals
    document.getElementById('loginModal').addEventListener('shown.bs.modal', function() {
        document.getElementById('email').focus();
    });
    
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only sr-only-focusable';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
    `;
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id
    document.getElementById('home').id = 'main-content';
});