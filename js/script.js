// DOM ready function
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Initialize based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'rooms.html':
            initializeRoomsPage();
            break;
        case 'booking.html':
            initializeBookingPage();
            break;
        case 'login.html':
            initializeLoginPage();
            break;
        case 'signup.html':
            initializeSignupPage();
            break;
        case 'user-dashboard.html':
            initializeUserDashboard();
            break;
        case 'admin-dashboard.html':
            initializeAdminDashboard();
            break;
        case 'contact.html':
            initializeContactPage();
            break;
        case 'about.html':
            initializeAboutPage();
            break;
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

function showLoading(button, show = true) {
    if (show) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || 'Submit';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Navigation
function updateNavigation() {
    const navButtons = document.getElementById('navButtons');
    const mobileNavButtons = document.querySelector('.navbar-nav.d-lg-none');
    
    if (!AuthService.isAuthenticated()) {
        return; // Keep default login/signup buttons
    }
    
    const userData = AuthService.getUserData();
    
    // Update desktop navigation
    if (navButtons) {
        navButtons.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-light rounded-pill dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>${userData.firstName}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="user-dashboard.html">My Dashboard</a></li>
                    ${AuthService.isAdmin() ? '<li><a class="dropdown-item" href="admin-dashboard.html">Admin Panel</a></li>' : ''}
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
                </ul>
            </div>
        `;
    }
    
    // Update mobile navigation
    if (mobileNavButtons) {
        const existingButtons = mobileNavButtons.querySelectorAll('.nav-item:has(.btn)');
        existingButtons.forEach(btn => btn.remove());
        
        const userItem = document.createElement('li');
        userItem.className = 'nav-item';
        userItem.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-light w-100 rounded-pill dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>${userData.firstName}
                </button>
                <ul class="dropdown-menu w-100">
                    <li><a class="dropdown-item" href="user-dashboard.html">My Dashboard</a></li>
                    ${AuthService.isAdmin() ? '<li><a class="dropdown-item" href="admin-dashboard.html">Admin Panel</a></li>' : ''}
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logoutBtnMobile">Logout</a></li>
                </ul>
            </div>
        `;
        mobileNavButtons.appendChild(userItem);
    }
    
    // Add logout event listeners
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    document.getElementById('logoutBtnMobile')?.addEventListener('click', handleLogout);
}

function handleLogout(e) {
    e.preventDefault();
    AuthAPI.logout();
}

// Page Initializers
function initializeHomePage() {
    loadFeaturedRooms();
}

function initializeRoomsPage() {
    loadAllRooms();
}

function initializeBookingPage() {
    setupBookingForm();
}

function initializeLoginPage() {
    setupLoginForm();
}

function initializeSignupPage() {
    setupSignupForm();
}

function initializeContactPage() {
    setupContactForm();
}

function initializeAboutPage() {
    // About page doesn't need special initialization
}

function initializeUserDashboard() {
    if (!AuthService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    loadUserDashboard();
}

function initializeAdminDashboard() {
    if (!AuthService.isAuthenticated() || !AuthService.isAdmin()) {
        window.location.href = 'login.html';
        return;
    }
    loadAdminDashboard();
}

// Chat Widget
function initializeChatWidget() {
    const chatBtn = document.getElementById('chatbot-btn');
    const chatWindow = document.getElementById('chatbot-window');
    const chatClose = document.getElementById('chat-close');
    
    if (chatBtn && chatWindow && chatClose) {
        chatBtn.addEventListener('click', () => {
            chatWindow.style.display = 'block';
            chatBtn.style.display = 'none';
        });
        
        chatClose.addEventListener('click', () => {
            chatWindow.style.display = 'none';
            chatBtn.style.display = 'block';
        });
        
        // Setup chat option buttons
        const optButtons = document.querySelectorAll('.opt-btn');
        optButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const value = this.getAttribute('data-val');
                await handleChatOption(value);
            });
        });
    }
}

async function handleChatOption(option) {
    const messages = {
        '1': 'Showing all rooms...',
        '2': 'Showing available rooms...',
        '3': 'Showing recent bookings...',
        '4': 'Showing room type statistics...'
    };
    
    showToast(messages[option] || 'Processing your request...', 'info');
    
    try {
        const response = await ChatAPI.sendMessage(`Option ${option}`);
        console.log('Chat response:', response);
    } catch (error) {
        console.error('Chat error:', error);
    }
}

// Home Page Functions
async function loadFeaturedRooms() {
    try {
        if (!AuthService.isAuthenticated()) {
            return; // Don't load rooms if not authenticated
        }
        
        const rooms = await RoomsAPI.getAllRooms();
        // You can display featured rooms in a carousel or section
        console.log('Featured rooms loaded:', rooms);
    } catch (error) {
        console.error('Failed to load featured rooms:', error);
    }
}

// Rooms Page Functions
async function loadAllRooms() {
    try {
        if (!AuthService.isAuthenticated()) {
            showToast('Please login to view rooms', 'warning');
            window.location.href = 'login.html';
            return;
        }
        
        const rooms = await RoomsAPI.getAllRooms();
        displayRooms(rooms);
    } catch (error) {
        console.error('Failed to load rooms:', error);
        showToast('Failed to load rooms. Please try again.', 'error');
    }
}

function displayRooms(rooms) {
    const roomsContainer = document.querySelector('.row.g-4');
    if (!roomsContainer) return;
    
    roomsContainer.innerHTML = rooms.map(room => `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card room-card h-100 reveal">
                <div class="card-img-container">
                    <img src="image/room-${room.id}.jpg" class="card-img-top" alt="${room.type} Room" 
                         onerror="this.src='image/room-placeholder.jpg'">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${room.type} Room</h5>
                    <p class="card-text text-muted">Room ${room.roomNumber} • ${room.hotelName}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price fw-bold">$${room.pricePerNight}/night</span>
                        <button class="btn btn-accent" onclick="bookRoom(${room.id})" ${!room.isAvailable ? 'disabled' : ''}>
                            ${room.isAvailable ? 'Book Now' : 'Not Available'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function bookRoom(roomId) {
    window.location.href = `booking.html?roomId=${roomId}`;
}

// Booking Page Functions
async function setupBookingForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    
    // Set minimum dates for check-in/check-out
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin').min = today;
    document.getElementById('checkout').min = today;
    
    if (roomId) {
        try {
            const room = await RoomsAPI.getRoomById(roomId);
            updateRoomInfo(room);
        } catch (error) {
            console.error('Failed to load room details:', error);
            showToast('Failed to load room details. Please try again.', 'error');
        }
    } else {
        // Default room if no roomId provided
        updateRoomInfo({
            type: 'Deluxe Sea View',
            pricePerNight: 120,
            roomNumber: '101'
        });
    }
    
    // Setup form submission
    document.getElementById('showPayment')?.addEventListener('click', async function(e) {
        e.preventDefault();
        await submitBooking();
    });
    
    // Setup payment cancellation
    document.getElementById('cancelPayment')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('payment-block').style.display = 'none';
    });
    
    setupDateValidation();
}

function updateRoomInfo(room) {
    document.getElementById('roomName').textContent = `${room.type} Room ${room.roomNumber ? `- ${room.roomNumber}` : ''}`;
    document.getElementById('roomPrice').textContent = `$${room.pricePerNight} USD`;
    document.getElementById('roomPrice').setAttribute('data-amount', room.pricePerNight);
}

function setupDateValidation() {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    checkinInput.addEventListener('change', function() {
        if (this.value) {
            checkoutInput.min = this.value;
            if (checkoutInput.value && checkoutInput.value < this.value) {
                checkoutInput.value = '';
            }
        }
    });
}

async function submitBooking() {
    // Basic form validation
    if (!validateBookingForm()) {
        return;
    }
    
    if (!AuthService.isAuthenticated()) {
        showToast('Please login to book a room', 'warning');
        window.location.href = 'login.html';
        return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = parseInt(urlParams.get('roomId')) || 1;
    
    const bookingData = {
        roomId: roomId,
        checkIn: document.getElementById('checkin').value + 'T12:00:00.000Z',
        checkOut: document.getElementById('checkout').value + 'T12:00:00.000Z'
    };
    
    try {
        const showPaymentBtn = document.getElementById('showPayment');
        showLoading(showPaymentBtn, true);
        
        const booking = await BookingsAPI.createBooking(bookingData);
        
        showToast('Booking created successfully! Proceeding to payment...', 'success');
        
        // Store booking info for payment
        localStorage.setItem('currentBooking', JSON.stringify(booking));
        
        // Setup payment with the created booking
        await setupPayment(booking);
        
    } catch (error) {
        console.error('Booking failed:', error);
        showToast('Failed to create booking. Please try again.', 'error');
    } finally {
        const showPaymentBtn = document.getElementById('showPayment');
        showLoading(showPaymentBtn, false);
    }
}

function validateBookingForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const guests = document.getElementById('guests').value;

    if (!fullName) {
        showToast('Please enter your full name', 'error');
        return false;
    }
    
    if (!email || !isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!phone) {
        showToast('Please enter your phone number', 'error');
        return false;
    }
    
    if (!checkin) {
        showToast('Please select check-in date', 'error');
        return false;
    }
    
    if (!checkout) {
        showToast('Please select check-out date', 'error');
        return false;
    }
    
    if (checkout <= checkin) {
        showToast('Check-out date must be after check-in date', 'error');
        return false;
    }
    
    if (!guests) {
        showToast('Please select number of guests', 'error');
        return false;
    }
    
    return true;
}

async function setupPayment(booking) {
    // Show payment block
    const paymentBlock = document.getElementById('payment-block');
    paymentBlock.style.display = 'block';
    
    // Prefill payment form with booking info
    document.getElementById('cardholder-name').value = document.getElementById('fullName').value.trim();
    document.getElementById('cardholder-email').value = document.getElementById('email').value.trim();
    
    // Calculate total amount
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * booking.pricePerNight;
    
    // Setup Stripe payment
    await initializeStripePayment(booking.id, totalAmount);
}

async function initializeStripePayment(bookingId, amount) {
    if (typeof Stripe === 'undefined') {
        console.error('Stripe.js not loaded');
        showToast('Payment system not available. Please try again later.', 'error');
        return;
    }
    
    if (!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY.includes('REPLACE_ME')) {
        console.warn('Stripe publishable key not configured');
        showToast('Payment configuration missing. Please contact support.', 'error');
        return;
    }
    
    const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
    const elements = stripe.elements();
    
    const style = {
        base: {
            fontSize: '16px',
            color: '#111827',
            '::placeholder': { color: '#9ca3af' },
            fontFamily: 'Open Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
        },
        invalid: { color: '#dc2626' }
    };
    
    const card = elements.create('card', { style, hidePostalCode: true });
    card.mount('#card-element');
    
    const cardErrors = document.getElementById('card-errors');
    card.on('change', event => {
        cardErrors.textContent = event.error ? event.error.message : '';
    });
    
    const payBtn = document.getElementById('payBtn');
    payBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        await processPayment(stripe, card, bookingId, amount);
    });
}

async function processPayment(stripe, card, bookingId, amount) {
    const payBtn = document.getElementById('payBtn');
    const cardholderName = document.getElementById('cardholder-name').value.trim();
    const cardholderEmail = document.getElementById('cardholder-email').value.trim();
    
    if (!cardholderName || !cardholderEmail) {
        showToast('Please enter name and email for the card', 'error');
        return;
    }
    
    try {
        showLoading(payBtn, true);
        
        const paymentData = {
            bookingId: bookingId,
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            description: `Hotel Booking #${bookingId}`
        };
        
        const paymentIntent = await PaymentAPI.createPaymentIntent(paymentData);
        
        const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
            paymentIntent.clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: cardholderName,
                        email: cardholderEmail,
                    },
                }
            }
        );
        
        if (error) {
            throw new Error(error.message);
        }
        
        if (confirmedPayment.status === 'succeeded') {
            await handleSuccessfulPayment(bookingId, confirmedPayment.id);
        } else {
            throw new Error('Payment not completed');
        }
        
    } catch (error) {
        console.error('Payment failed:', error);
        showToast(`Payment failed: ${error.message}`, 'error');
    } finally {
        showLoading(payBtn, false);
    }
}

async function handleSuccessfulPayment(bookingId, paymentIntentId) {
    try {
        const paymentStatus = await PaymentAPI.checkPaymentStatus(paymentIntentId);
        
        if (paymentStatus.success) {
            const successModal = new bootstrap.Modal(document.getElementById('bookingSuccessModal'));
            successModal.show();
            
            localStorage.removeItem('currentBooking');
            
            setTimeout(() => {
                window.location.href = 'user-dashboard.html';
            }, 3000);
            
        } else {
            throw new Error(paymentStatus.message || 'Payment verification failed');
        }
        
    } catch (error) {
        console.error('Payment verification failed:', error);
        showToast('Payment verification failed. Please contact support.', 'error');
    }
}

// Login Page Functions
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleLogin();
    });
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        const loginBtn = document.querySelector('#loginForm button[type="submit"]');
        showLoading(loginBtn, true);
        
        const result = await AuthAPI.login({
            email: email,
            password: password
        });
        
        if (result.success) {
            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'user-dashboard.html';
            }, 1000);
        } else {
            throw new Error(result.message || 'Login failed');
        }
        
    } catch (error) {
        console.error('Login failed:', error);
        showToast(error.message || 'Login failed. Please try again.', 'error');
    } finally {
        const loginBtn = document.querySelector('#loginForm button[type="submit"]');
        showLoading(loginBtn, false);
    }
}

// Signup Page Functions
function setupSignupForm() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;
    
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleSignup();
    });
    
    // Password confirmation validation
    const passwordInput = document.getElementById('signupPassword');
    const confirmInput = document.getElementById('signupConfirm');
    
    confirmInput.addEventListener('input', function() {
        if (passwordInput.value !== confirmInput.value) {
            confirmInput.setCustomValidity('Passwords do not match');
        } else {
            confirmInput.setCustomValidity('');
        }
    });
}

async function handleSignup() {
    const formData = new FormData(document.getElementById('signupForm'));
    const userData = {
        firstName: formData.get('signupFullName').split(' ')[0],
        lastName: formData.get('signupFullName').split(' ').slice(1).join(' ') || '',
        email: formData.get('signupEmail'),
        phoneNumber: formData.get('signupPhone') || '',
        password: formData.get('signupPassword'),
        confirmPassword: formData.get('signupConfirm')
    };
    
    if (!userData.firstName || !userData.email || !userData.password) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(userData.email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (userData.password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (userData.password !== userData.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    try {
        const signupBtn = document.querySelector('#signupForm button[type="submit"]');
        showLoading(signupBtn, true);
        
        const result = await AuthAPI.register(userData);
        
        if (result.success) {
            if (result.requiresOtp) {
                showToast('Registration successful! Please check your email for verification code.', 'success');
                // Redirect to OTP verification page or show OTP input
                setTimeout(() => {
                    window.location.href = `otp-verification.html?email=${encodeURIComponent(userData.email)}`;
                }, 2000);
            } else {
                showToast('Registration successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'user-dashboard.html';
                }, 1000);
            }
        } else {
            throw new Error(result.message || 'Registration failed');
        }
        
    } catch (error) {
        console.error('Registration failed:', error);
        showToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        const signupBtn = document.querySelector('#signupForm button[type="submit"]');
        showLoading(signupBtn, false);
    }
}

// Contact Page Functions
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleContactSubmit();
    });
}

async function handleContactSubmit() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    if (!name || !email || !message) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Since there's no contact API endpoint, we'll simulate success
    showToast('Thank you for your message! We will get back to you soon.', 'success');
    document.getElementById('contactForm').reset();
}

// User Dashboard Functions
async function loadUserDashboard() {
    try {
        const [stats, recentBookings, upcomingBookings] = await Promise.all([
            DashboardAPI.getUserStats(),
            DashboardAPI.getUserRecentBookings(),
            DashboardAPI.getUserUpcomingBookings()
        ]);
        
        displayUserStats(stats);
        displayUserBookings(recentBookings, upcomingBookings);
    } catch (error) {
        console.error('Failed to load user dashboard:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

function displayUserStats(stats) {
    // Update stats in the dashboard
    console.log('User stats:', stats);
    // You can create elements to display these stats
}

function displayUserBookings(recentBookings, upcomingBookings) {
    // Display bookings in the dashboard
    console.log('Recent bookings:', recentBookings);
    console.log('Upcoming bookings:', upcomingBookings);
    // You can create tables or cards to display these bookings
}

// Admin Dashboard Functions
async function loadAdminDashboard() {
    try {
        const [stats, recentBookings, roomStats] = await Promise.all([
            DashboardAPI.getAdminStats(),
            DashboardAPI.getAdminRecentBookings(),
            DashboardAPI.getAdminRoomTypeStats()
        ]);
        
        displayAdminStats(stats);
        displayAdminBookings(recentBookings);
        displayRoomStats(roomStats);
    } catch (error) {
        console.error('Failed to load admin dashboard:', error);
        showToast('Failed to load admin dashboard data', 'error');
    }
}

function displayAdminStats(stats) {
    // Update admin stats
    console.log('Admin stats:', stats);
}

function displayAdminBookings(bookings) {
    // Display admin bookings
    console.log('Admin bookings:', bookings);
}

function displayRoomStats(roomStats) {
    // Display room statistics
    console.log('Room stats:', roomStats);
}
// Add this to your existing script.js

function initializeUserDashboard() {
    if (!AuthService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    loadUserDashboard();
}

async function loadUserDashboard() {
    try {
        const [stats, recentBookings, upcomingBookings] = await Promise.all([
            DashboardAPI.getUserStats(),
            DashboardAPI.getUserRecentBookings(),
            DashboardAPI.getUserUpcomingBookings()
        ]);
        
        displayUserDashboard(stats, recentBookings, upcomingBookings);
    } catch (error) {
        console.error('Failed to load user dashboard:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

function displayUserDashboard(stats, recentBookings, upcomingBookings) {
    // Update user welcome message
    const userData = AuthService.getUserData();
    if (userData && userData.firstName) {
        document.getElementById('welcomeMessage').textContent = `Hello, ${userData.firstName}!`;
    }
    
    // Update stats
    if (stats) {
        document.getElementById('totalBookings').textContent = stats.totalBookings || 0;
        document.getElementById('activeBookings').textContent = stats.activeBookings || 0;
        document.getElementById('upcomingBookings').textContent = stats.upcomingCheckIns || 0;
        document.getElementById('totalSpent').textContent = stats.totalSpent || 0;
    }
    
    // Display bookings
    displayUserBookings(recentBookings, upcomingBookings);
}