// DOM ready function
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize common components
    initializeChatWidget();
    updateNavigation();
}

// Utility Functions
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    const toastId = 'toast-' + Date.now();
    const bgColor = type === 'error' ? 'bg-danger' : 
                   type === 'success' ? 'bg-success' : 
                   type === 'warning' ? 'bg-warning' : 'bg-info';
    
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgColor} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove toast from DOM after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Navigation - Updated to use Storage from api-config.js
function updateNavigation() {
    const navButtons = document.getElementById('navButtons');
    const mobileNavButtons = document.querySelector('.navbar-nav.d-lg-none');
    
    // Check if Storage is defined (from api-config.js)
    if (typeof Storage === 'undefined' || !Storage.isLoggedIn()) {
        return; // Keep default login/signup buttons
    }
    
    const userData = Storage.getUser();
    if (!userData) return;
    
    // Update desktop navigation
    if (navButtons) {
        navButtons.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-light rounded-pill dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>${userData.firstName}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="user-dashboard.html">My Dashboard</a></li>
                    ${Storage.isAdmin() ? '<li><a class="dropdown-item" href="admin-dashboard.html">Admin Panel</a></li>' : ''}
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
                </ul>
            </div>
        `;
        
        // Add logout event listener
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
    
    // Update mobile navigation
    if (mobileNavButtons) {
        const existingButtons = mobileNavButtons.querySelectorAll('.nav-item:has(.btn)');
        existingButtons.forEach(btn => btn.remove());
        
        const userItem = document.createElement('li');
        userItem.className = 'nav-item mt-2';
        userItem.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-light w-100 rounded-pill dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>${userData.firstName}
                </button>
                <ul class="dropdown-menu w-100">
                    <li><a class="dropdown-item" href="user-dashboard.html">My Dashboard</a></li>
                    ${Storage.isAdmin() ? '<li><a class="dropdown-item" href="admin-dashboard.html">Admin Panel</a></li>' : ''}
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logoutBtnMobile">Logout</a></li>
                </ul>
            </div>
        `;
        mobileNavButtons.appendChild(userItem);
        
        // Add logout event listener for mobile
        const logoutBtnMobile = document.getElementById('logoutBtnMobile');
        if (logoutBtnMobile) {
            logoutBtnMobile.addEventListener('click', handleLogout);
        }
    }
}

function handleLogout(e) {
    e.preventDefault();
    if (typeof Storage !== 'undefined') {
        Storage.logout();
    } else {
        // Fallback if Storage is not available
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = 'index.html';
    }
}

// Chat Widget
function initializeChatWidget() {
    const chatBtn = document.getElementById('chatbot-btn');
    const chatWindow = document.getElementById('chatbot-window');
    const chatClose = document.getElementById('chat-close');
    
    if (chatBtn && chatWindow && chatClose) {
        chatBtn.addEventListener('click', () => {
            chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
            if (chatWindow.style.display === 'flex') {
                chatWindow.setAttribute('aria-hidden', 'false');
                chatBtn.style.display = 'none';
            }
        });
        
        chatClose.addEventListener('click', () => {
            chatWindow.style.display = 'none';
            chatWindow.setAttribute('aria-hidden', 'true');
            chatBtn.style.display = 'flex';
        });
    }
}

// Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contactName')?.value.trim();
        const email = document.getElementById('contactEmail')?.value.trim();
        const message = document.getElementById('contactMessage')?.value.trim();
        
        if (!name || !email || !message) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate successful submission
        showToast('Thank you for your message! We will get back to you soon.', 'success');
        contactForm.reset();
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Reveal on scroll animation
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}, { passive: true });

// Form validation helper
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Add input event listeners to remove invalid class on input
document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('is-invalid');
    });
});

// Initialize Bootstrap tooltips if present
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
if (tooltipTriggerList.length > 0) {
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Initialize Bootstrap popovers if present
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
if (popoverTriggerList.length > 0) {
    [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
}

// Auto-close alerts after 5 seconds
document.querySelectorAll('.alert:not(.alert-permanent)').forEach(alert => {
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
    }, 5000);
});

// Loading state helper
function setLoadingState(element, isLoading) {
    if (!element) return;
    
    if (isLoading) {
        element.disabled = true;
        element.dataset.originalText = element.innerHTML;
        element.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Loading...';
    } else {
        element.disabled = false;
        element.innerHTML = element.dataset.originalText || element.innerHTML;
    }
}

// Export utility functions for use in other scripts
window.hotelUtils = {
    showToast,
    isValidEmail,
    validateForm,
    setLoadingState
};

console.log('✅ Script.js loaded successfully');