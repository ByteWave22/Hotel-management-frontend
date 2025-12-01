// js/rooms.js
// Rooms page functionality with API integration

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🏨 Rooms page loading...');
  
  // Update navigation to show logged-in user
  updateNavigation();
  
  // Show loading state
  showLoadingState();

  try {
    // Fetch rooms from API (works without login, but some features require login)
    const rooms = await API.getRooms();
    console.log('✅ Rooms fetched:', rooms.length, 'rooms');
    
    if (!rooms || rooms.length === 0) {
      showNoRooms();
      return;
    }

    // Display rooms
    displayRooms(rooms);
    
  } catch (error) {
    console.error('❌ Error loading rooms:', error);
    showError(error.message);
  }
});

// Update navigation based on login status
function updateNavigation() {
  if (typeof Storage === 'undefined' || !Storage.isLoggedIn()) {
    return; // Keep default login/signup buttons
  }
  
  const userData = Storage.getUser();
  if (!userData) return;
  
  // Update desktop navigation
  const navButtons = document.getElementById('navButtons');
  if (navButtons) {
    navButtons.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-light rounded-pill dropdown-toggle" type="button" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle me-1"></i>${userData.firstName}
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="user-dashboard.html"><i class="bi bi-speedometer2 me-2"></i>My Dashboard</a></li>
          ${Storage.isAdmin() ? '<li><a class="dropdown-item" href="admin-dashboard.html"><i class="bi bi-shield-check me-2"></i>Admin Panel</a></li>' : ''}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logoutBtn"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
        </ul>
      </div>
    `;
    
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      Storage.logout();
    });
  }
  
  // Update mobile navigation
  const mobileNav = document.querySelector('.navbar-nav.d-lg-none');
  if (mobileNav) {
    // Remove default login/signup buttons
    const mobileButtons = mobileNav.querySelectorAll('.nav-item');
    mobileButtons.forEach(btn => {
      if (btn.querySelector('a.btn')) {
        btn.remove();
      }
    });
    
    // Add user dropdown for mobile
    const userItem = document.createElement('li');
    userItem.className = 'nav-item mt-2';
    userItem.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-light w-100 rounded-pill dropdown-toggle" type="button" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle me-1"></i>${userData.firstName}
        </button>
        <ul class="dropdown-menu w-100">
          <li><a class="dropdown-item" href="user-dashboard.html"><i class="bi bi-speedometer2 me-2"></i>My Dashboard</a></li>
          ${Storage.isAdmin() ? '<li><a class="dropdown-item" href="admin-dashboard.html"><i class="bi bi-shield-check me-2"></i>Admin Panel</a></li>' : ''}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logoutBtnMobile"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
        </ul>
      </div>
    `;
    mobileNav.appendChild(userItem);
    
    document.getElementById('logoutBtnMobile')?.addEventListener('click', (e) => {
      e.preventDefault();
      Storage.logout();
    });
  }
}

// Show loading state
function showLoadingState() {
  const loading = document.getElementById('roomsLoading');
  const container = document.getElementById('roomsContainer');
  const noRooms = document.getElementById('noRooms');
  const error = document.getElementById('roomsError');
  
  if (loading) loading.classList.remove('d-none');
  if (container) container.innerHTML = '';
  if (noRooms) noRooms.classList.add('d-none');
  if (error) error.classList.add('d-none');
}

// Show no rooms message
function showNoRooms() {
  const loading = document.getElementById('roomsLoading');
  const noRooms = document.getElementById('noRooms');
  
  if (loading) loading.classList.add('d-none');
  if (noRooms) noRooms.classList.remove('d-none');
}

// Show error message
function showError(message) {
  const loading = document.getElementById('roomsLoading');
  const error = document.getElementById('roomsError');
  const errorMsg = document.getElementById('errorMessage');
  
  if (loading) loading.classList.add('d-none');
  if (error) error.classList.remove('d-none');
  if (errorMsg) errorMsg.textContent = message || 'Failed to load rooms';
}

// Display rooms
function displayRooms(rooms) {
  const container = document.getElementById('roomsContainer');
  const loading = document.getElementById('roomsLoading');
  
  // Hide loading
  if (loading) loading.classList.add('d-none');
  
  if (!container) return;
  
  // Group rooms by type
  const roomsByType = groupRoomsByType(rooms);
  
  // Clear container
  container.innerHTML = '';
  
  // Create cards for each room type
  let index = 0;
  for (const [type, roomsOfType] of Object.entries(roomsByType)) {
    const room = roomsOfType[0]; // Use first room of this type
    const availableCount = roomsOfType.filter(r => r.isAvailable).length;
    
    const cardHTML = `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card room-card h-100 reveal">
          <div id="roomCarousel${index}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#roomCarousel${index}" data-bs-slide-to="0" class="active"></button>
              <button type="button" data-bs-target="#roomCarousel${index}" data-bs-slide-to="1"></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="${getRoomImage(type, 1)}" class="d-block w-100" alt="${type} Room" onerror="this.src='image/Hotel.jpg'">
              </div>
              <div class="carousel-item">
                <img src="${getRoomImage(type, 2)}" class="d-block w-100" alt="${type} Room" onerror="this.src='image/hotel-lobby.jpg'">
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#roomCarousel${index}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#roomCarousel${index}" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
          <div class="card-body">
            <h5 class="card-title">${type}</h5>
            <p class="card-text text-muted">${getRoomDescription(type)}</p>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="price fw-bold">$${room.pricePerNight}/night</span>
              <span class="badge ${availableCount > 0 ? 'bg-success' : 'bg-danger'}">
                ${availableCount > 0 ? `${availableCount} Available` : 'Fully Booked'}
              </span>
            </div>
            <small class="text-muted d-block mb-3">${roomsOfType.length} room(s) of this type</small>
            <div class="d-grid">
              <button class="btn btn-accent" onclick="selectRoom(${room.id}, '${type}', ${room.pricePerNight}, ${availableCount > 0})" ${availableCount === 0 ? 'disabled' : ''}>
                ${availableCount > 0 ? 'Book Now' : 'Not Available'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML += cardHTML;
    index++;
  }
  
  // Trigger reveal animation
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);
}

// Helper function to group rooms by type
function groupRoomsByType(rooms) {
  const grouped = {};
  rooms.forEach(room => {
    const type = room.type || 'Standard';
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(room);
  });
  return grouped;
}

// Helper function to get room image based on type
function getRoomImage(type, imageNumber) {
  const typeMap = {
    'Standard': 'standard-room',
    'standard': 'standard-room',
    'Deluxe': 'Deluxe-room',
    'Delux': 'Deluxe-room',
    'Suite': 'executive-room',
    'Premium Suite': 'family-suite',
    'Superior': 'superior-room',
    'Twin': 'twin-room'
  };

  const baseImage = typeMap[type] || 'standard-room';
  
  // Always return valid image numbers (most have 2-3 images)
  const validImageNumber = imageNumber <= 3 ? imageNumber : 1;
  
  return `image/${baseImage}${validImageNumber}.jpg`;
}

// Helper function to get room description
function getRoomDescription(type) {
  const descriptions = {
    'Standard': 'Cozy room with essential amenities.',
    'standard': 'Cozy room with essential amenities.',
    'Deluxe': 'King bed, city view, complimentary breakfast.',
    'Delux': 'King bed, city view, complimentary breakfast.',
    'Suite': 'Spacious suite with lounge and balcony.',
    'Premium Suite': 'Luxury suite with premium amenities.',
    'Superior': 'Queen bed, garden view, workspace area.',
    'Twin': 'Two twin beds, ideal for friends and family.',
    'Family Suite': 'Two bedrooms, kitchenette, and living area.'
  };

  return descriptions[type] || 'Comfortable accommodation for your stay.';
}

// Select room and redirect to booking page
window.selectRoom = function(roomId, roomType, pricePerNight, isAvailable) {
  console.log('🎯 Room selected:', { roomId, roomType, pricePerNight, isAvailable });
  
  if (!isAvailable) {
    alert('This room type is currently fully booked');
    return;
  }
  
  // Check if user is logged in
  if (typeof Storage === 'undefined' || !Storage.isLoggedIn()) {
    alert('Please login to book a room');
    
    // Save selected room for after login
    sessionStorage.setItem('selectedRoom', JSON.stringify({
      id: roomId,
      type: roomType,
      price: pricePerNight
    }));
    sessionStorage.setItem('redirectAfterLogin', 'booking.html');
    
    window.location.href = 'login.html';
    return;
  }
  
  // Save selected room to session storage
  sessionStorage.setItem('selectedRoom', JSON.stringify({
    id: roomId,
    type: roomType,
    price: pricePerNight
  }));
  
  // Redirect to booking page
  window.location.href = `booking.html?roomId=${roomId}`;
};

console.log('✅ Rooms.js loaded successfully');