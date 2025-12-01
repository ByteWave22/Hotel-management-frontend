// js/api-config.js
// COMPLETE FIXED VERSION with proper authentication

const API_BASE_URL = 'https://cozyhotel.runasp.net/api';

// Storage helpers - FIXED to work properly
const Storage = {
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
    console.log('✅ Token saved:', token.substring(0, 20) + '...');
  },
  
  getToken: () => {
    const token = localStorage.getItem('auth_token');
    console.log('🔑 Token retrieved:', token ? 'EXISTS' : 'NULL');
    return token;
  },
  
  removeToken: () => {
    localStorage.removeItem('auth_token');
    console.log('🗑️ Token removed');
  },
  
  setUser: (user) => {
    localStorage.setItem('user_data', JSON.stringify(user));
    console.log('👤 User saved:', user);
  },
  
  getUser: () => {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  },
  
  removeUser: () => {
    localStorage.removeItem('user_data');
  },
  
  isAdmin: () => {
    const user = Storage.getUser();
    return user && user.roles && user.roles.includes('Admin');
  },
  
  isLoggedIn: () => {
    const token = Storage.getToken();
    const isLoggedIn = !!token;
    console.log('🔐 Is Logged In:', isLoggedIn);
    return isLoggedIn;
  },
  
  logout: () => {
    Storage.removeToken();
    Storage.removeUser();
    console.log('👋 Logged out');
    window.location.href = 'index.html';
  }
};

// Make Storage globally available
window.Storage = Storage;

// API Request wrapper
async function apiRequest(endpoint, options = {}) {
  const token = Storage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Adding auth token to request');
  } else {
    console.log('⚠️ No auth token available');
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    console.log(`📥 Response Status: ${response.status}`);
    
    // Try to parse JSON response
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text, success: response.ok };
    }
    
    if (!response.ok) {
      console.error('❌ API Error:', data);
      const errorMessage = data.message || data.error || data.title || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }
    
    console.log('✅ API Success:', data);
    return data;
  } catch (error) {
    console.error('💥 API Error:', error);
    throw error;
  }
}

// API Functions
const API = {
  // Auth
  register: async (userData) => {
    return await apiRequest('/Auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  verifyOtp: async (email, otp) => {
    return await apiRequest('/Auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    });
  },
  
  login: async (email, password) => {
    return await apiRequest('/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  forgotPassword: async (email) => {
    return await apiRequest('/Auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },
  
  resetPassword: async (email, otp, newPassword, confirmPassword) => {
    return await apiRequest('/Auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword, confirmPassword })
    });
  },
  
  // Rooms
  getRooms: async () => {
    return await apiRequest('/Rooms');
  },
  
  getAvailableRooms: async (hotelId, checkIn, checkOut) => {
    const params = new URLSearchParams({ checkIn, checkOut });
    return await apiRequest(`/Rooms/available/${hotelId}?${params}`);
  },
  
  createRoom: async (roomData) => {
    return await apiRequest('/Rooms', {
      method: 'POST',
      body: JSON.stringify(roomData)
    });
  },
  
  // Bookings
  createBooking: async (bookingData) => {
    return await apiRequest('/Bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },
  
  getMyBookings: async () => {
    return await apiRequest('/Bookings/my-bookings');
  },
  
  getBookingById: async (id) => {
    return await apiRequest(`/Bookings/${id}`);
  },
  
  cancelBooking: async (id) => {
    return await apiRequest(`/Bookings/${id}/cancel`, {
      method: 'PUT'
    });
  },
  
  updateBookingStatus: async (id, status) => {
    return await apiRequest(`/Bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(status)
    });
  },
  
  // Payment
  createPaymentIntent: async (paymentData) => {
    return await apiRequest('/Payment/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },
  
  processCardPayment: async (paymentIntentId) => {
    return await apiRequest(`/Payment/process-card-payment?PaymentIntentId=${paymentIntentId}`, {
      method: 'POST'
    });
  },
  
  checkPaymentStatus: async (paymentIntentId) => {
    return await apiRequest(`/Payment/check-payment-status/${paymentIntentId}`, {
      method: 'POST'
    });
  },
  
  // Dashboard - User
  getUserStats: async () => {
    return await apiRequest('/Dashboard/user/stats');
  },
  
  getRecentBookings: async (count = 5) => {
    return await apiRequest(`/Dashboard/user/recent-bookings?count=${count}`);
  },
  
  getUpcomingBookings: async () => {
    return await apiRequest('/Dashboard/user/upcoming-bookings');
  },
  
  getSpendingSummary: async () => {
    return await apiRequest('/Dashboard/user/spending-summary');
  },
  
  // Admin
  getAllUsers: async () => {
    return await apiRequest('/Admin/users');
  },
  
  getUserById: async (userId) => {
    return await apiRequest(`/Admin/users/${userId}`);
  },
  
  assignRole: async (userId, roleName) => {
    return await apiRequest(`/Admin/users/${userId}/assign-role`, {
      method: 'POST',
      body: JSON.stringify({ roleName })
    });
  },
  
  removeRole: async (userId, roleName) => {
    return await apiRequest(`/Admin/users/${userId}/remove-role`, {
      method: 'POST',
      body: JSON.stringify({ roleName })
    });
  },
  
  getAllBookings: async () => {
    return await apiRequest('/Admin/bookings');
  },
  
  approveBooking: async (id) => {
    return await apiRequest(`/Admin/bookings/${id}/approve`, {
      method: 'PUT'
    });
  },
  
  rejectBooking: async (id) => {
    return await apiRequest(`/Admin/bookings/${id}/reject`, {
      method: 'PUT'
    });
  },
  
  completeBooking: async (id) => {
    return await apiRequest(`/Admin/bookings/${id}/complete`, {
      method: 'PUT'
    });
  },
  
  // Dashboard - Admin
  getAdminStats: async () => {
    return await apiRequest('/Dashboard/admin/stats');
  },
  
  getAdminRecentBookings: async (count = 10) => {
    return await apiRequest(`/Dashboard/admin/recent-bookings?count=${count}`);
  },
  
  getRevenueByMonth: async (year = new Date().getFullYear()) => {
    return await apiRequest(`/Dashboard/admin/revenue-by-month?year=${year}`);
  },
  
  getRoomTypeStats: async () => {
    return await apiRequest('/Dashboard/admin/room-type-stats');
  },
  
  getBookingStatusSummary: async () => {
    return await apiRequest('/Dashboard/admin/booking-status-summary');
  },
  
  getTopCustomers: async (count = 10) => {
    return await apiRequest(`/Dashboard/admin/top-customers?count=${count}`);
  },
  
  refundPayment: async (paymentIntentId, amount) => {
    return await apiRequest(`/Payment/refund/${paymentIntentId}?amount=${amount}`, {
      method: 'POST'
    });
  },
  
  // Chat
  getChatCommands: async () => {
    return await apiRequest('/Chat/commands');
  },
  
  getChatStatus: async () => {
    return await apiRequest('/Chat/status');
  },
  
  sendChatMessage: async (message) => {
    return await apiRequest('/Chat/message', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }
};

// Make API globally available
window.API = API;

// Helper functions
function showLoading(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  }
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  }
}

function showSuccess(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
      <i class="bi bi-check-circle-fill me-2"></i>${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatCurrency(amount) {
  return `$${parseFloat(amount).toFixed(2)}`;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Toast notification function
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
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
  
  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });
}

// Make functions globally available
window.showToast = showToast;
window.showError = showError;
window.showSuccess = showSuccess;
window.formatDate = formatDate;
window.formatCurrency = formatCurrency;
window.isValidEmail = isValidEmail;

console.log('✅ API Config loaded and ready');
console.log('🔐 Current login status:', Storage.isLoggedIn());