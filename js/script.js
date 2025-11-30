/* Global Scripts for Grand Vista Hotel - Modern Theme */
$(function () {
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Navbar solid on scroll
  const nav = document.querySelector('.navbar');
  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 10) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Smooth scroll
  $(document).on('click', 'a[href^="#"]:not([data-bs-toggle])', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = nav ? nav.getBoundingClientRect().height : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.05 });
    revealEls.forEach(el => observer.observe(el));
  }

  // Alert helper
  function showAlert(containerId, message) {
    const html = `
      <div class="alert alert-success alert-dismissible fade show" role="alert" style="background-color: var(--brand-gold); color: var(--brand-dark);">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = html;
  }

  // Booking form
  const $bookingForm = $('#bookingForm');
  if ($bookingForm.length) {
    $bookingForm.on('submit', function (e) {
      e.preventDefault();
      let valid = true;
      $(this).find(':input[required]').each(function () {
        if (!$(this).val()) { $(this).addClass('is-invalid'); valid = false; } 
        else { $(this).removeClass('is-invalid'); }
      });
      if (!valid) return;

      const modalEl = document.getElementById('bookingSuccessModal');
      if (modalEl) new bootstrap.Modal(modalEl).show();
      else showAlert('bookingAlert', 'Booking submitted successfully!');

      // حفظ الحجز للـ User
      const roomInfo = document.getElementById('roomInfo');
      const roomName = roomInfo ? roomInfo.querySelector('strong').nextSibling.textContent.trim() : '';
      const roomPrice = roomInfo ? roomInfo.querySelectorAll('strong')[1].nextSibling.textContent.trim() : '';
      const date = document.getElementById('bookingDate')?.value || new Date().toLocaleDateString();

      let userBookings = JSON.parse(localStorage.getItem('user_bookings')) || [];
      userBookings.push({ room: roomName, price: roomPrice, date });
      localStorage.setItem('user_bookings', JSON.stringify(userBookings));

      this.reset();
    });

    $bookingForm.on('input change', ':input', function () { if ($(this).val()) $(this).removeClass('is-invalid'); });
  }

  // Contact form
  const $contactForm = $('#contactForm');
  if ($contactForm.length) {
    $contactForm.on('submit', function (e) {
      e.preventDefault();
      let valid = true;
      $(this).find(':input[required]').each(function () {
        if (!$(this).val()) { $(this).addClass('is-invalid'); valid = false; } 
        else { $(this).removeClass('is-invalid'); }
      });
      if (!valid) return;

      showAlert('contactAlert', 'Message sent successfully!');
      this.reset();
    });
    $contactForm.on('input change', ':input', function () { if ($(this).val()) $(this).removeClass('is-invalid'); });
  }
});

/* Room to Booking page */
document.addEventListener('DOMContentLoaded', function() {
  const bookButtons = document.querySelectorAll('.room-card .btn-accent, .room-card .btn-primary');

  bookButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const card = btn.closest('.room-card');
      const roomName = card.querySelector('.card-title').innerText;
      const roomPrice = card.querySelector('.price').innerText.replace('$','').replace('/night','').trim();
      window.location.href = `booking.html?room=${encodeURIComponent(roomName)}&price=${encodeURIComponent(roomPrice)}`;
    });
  });

  if (window.location.pathname.includes('booking.html')) {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    const price = params.get('price');

    if (room && price) {
      let roomInfoDiv = document.getElementById('roomInfo');
      if (!roomInfoDiv) {
        roomInfoDiv = document.createElement('div');
        roomInfoDiv.id = 'roomInfo';
        roomInfoDiv.className = 'mb-4 p-3 border rounded bg-light';
        const form = document.getElementById('bookingForm');
        form.parentNode.insertBefore(roomInfoDiv, form);
      }
      roomInfoDiv.innerHTML = `<strong>Room:</strong> ${room}<br><strong>Price:</strong> $${price}/night`;
    }
  }
});

/* Login + Dashboard + Navbar dynamic */
document.addEventListener("DOMContentLoaded", function () {
  // Load navbar dynamically
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  if (navbarPlaceholder) {
    fetch("navbar.html")
      .then(res => res.text())
      .then(data => {
        navbarPlaceholder.innerHTML = data;

        const isAdmin = localStorage.getItem("is_admin");
        const userEmail = localStorage.getItem("user_email");
        const navLinks = document.getElementById("navLinks");
        const navButtons = document.getElementById("navButtons");

        // مسح أزرار Login/SignUp الأصلية
        if (navButtons) navButtons.innerHTML = "";

        if (isAdmin === "true") {
          const li = document.createElement("li");
          li.className = "nav-item";
          li.innerHTML = `<a class="nav-link" href="admin-dashboard.html">Admin Dashboard</a>`;
          navLinks.appendChild(li);

          const logoutBtn = document.createElement("a");
          logoutBtn.className = "btn btn-outline-light rounded-pill";
          logoutBtn.id = "adminLogoutBtn";
          logoutBtn.textContent = "Logout";
          logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("is_admin");
            localStorage.removeItem("user_email");
            window.location.href = "index.html";
          });
          navButtons.appendChild(logoutBtn);
        } else if (userEmail) {
          const li = document.createElement("li");
          li.className = "nav-item";
          li.innerHTML = `<a class="nav-link" href="user-dashboard.html">My Dashboard</a>`;
          navLinks.appendChild(li);

          const logoutBtn = document.createElement("a");
          logoutBtn.className = "btn btn-outline-light rounded-pill";
          logoutBtn.id = "userLogoutBtn";
          logoutBtn.textContent = "Logout";
          logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("user_email");
            localStorage.removeItem("is_admin");
            window.location.href = "index.html";
          });
          navButtons.appendChild(logoutBtn);
        } else {
          const loginBtn = document.createElement("a");
          loginBtn.className = "btn btn-outline-light rounded-pill";
          loginBtn.href = "login.html";
          loginBtn.textContent = "Login";
          navButtons.appendChild(loginBtn);

          const signupBtn = document.createElement("a");
          signupBtn.className = "btn btn-accent rounded-pill";
          signupBtn.href = "signup.html";
          signupBtn.textContent = "Sign Up";
          navButtons.appendChild(signupBtn);
        }
      });
  }

  // Login handling
  const loginForm = document.getElementById("loginForm");
  const ADMIN_EMAIL = "admin@hotel.com";
  const ADMIN_PASSWORD = "admin123";
  const USER_EMAIL = "user@hotel.com";
  const USER_PASSWORD = "user123";

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      if (!email || !password) return;

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("is_admin", "true");
        localStorage.setItem("user_email", email);
        window.location.href = "admin-dashboard.html";
      } else if (email === USER_EMAIL && password === USER_PASSWORD) {
        localStorage.setItem("is_admin", "false");
        localStorage.setItem("user_email", email);
        window.location.href = "user-dashboard.html";
      } else {
        const existingAlert = document.getElementById("loginError");
        if (!existingAlert) {
          const alertDiv = document.createElement("div");
          alertDiv.id = "loginError";
          alertDiv.className = "alert alert-danger mt-3";
          alertDiv.innerText = "Incorrect email or password!";
          loginForm.appendChild(alertDiv);
        } else {
          existingAlert.innerText = "Incorrect email or password!";
        }
      }
    });
  }

  // Protect Admin Dashboard
  if (window.location.pathname.includes("admin-dashboard.html")) {
    const isAdmin = localStorage.getItem("is_admin");
    if (isAdmin !== "true") window.location.href = "login.html";
  }

  // Protect User Dashboard & show info
  if (window.location.pathname.includes("user-dashboard.html")) {
    const isAdmin = localStorage.getItem("is_admin");
    const userEmail = localStorage.getItem("user_email");
    if (!userEmail || isAdmin === "true") window.location.href = "login.html";

    const userNameSpan = document.getElementById("userName");
    if (userNameSpan) {
      const nameFromEmail = userEmail.split("@")[0];
      const formattedName = nameFromEmail.replace(/[._-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      userNameSpan.textContent = formattedName;
    }

    const bookingsContainer = document.getElementById("userBookings");
    if (bookingsContainer) {
      const userBookings = JSON.parse(localStorage.getItem("user_bookings")) || [];
      if (userBookings.length === 0) {
        bookingsContainer.innerHTML = "<p>No bookings yet.</p>";
      } else {
        const list = document.createElement("ul");
        list.className = "list-group";
        userBookings.forEach(b => {
          const li = document.createElement("li");
          li.className = "list-group-item";
          li.innerHTML = `<strong>Room:</strong> ${b.room} <br> <strong>Price:</strong> ${b.price}/night <br> <strong>Date:</strong> ${b.date}`;
          list.appendChild(li);
        });
        bookingsContainer.innerHTML = "";
        bookingsContainer.appendChild(list);
      }
    }
  }


// ===========================
// Floating Chatbot Logic
// ===========================
const chatBtn = document.getElementById("chatbot-btn");
const chatWindow = document.getElementById("chatbot-window");
const closeChat = document.getElementById("chat-close");
const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chatMessage");
const sendBtn = document.getElementById("sendMessage");

// تأكد أن عناصر الشات موجودة في الصفحة
if (chatBtn && chatWindow) {

    // فتح/قفل الشات
    chatBtn.addEventListener("click", function () {
        chatWindow.style.display = (chatWindow.style.display === "flex") ? "none" : "flex";
        chatInput.focus();
    });

    closeChat.addEventListener("click", function () {
    chatWindow.style.display = "none";
    chatBtn.style.display = "flex";
});


    // إضافة الرسائل
    function appendMessage(text, sender = "bot") {
        const msg = document.createElement("div");
        msg.classList.add("chat-message", sender);
        msg.textContent = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // ردود البوت
    function getBotReply(userText) {
        const t = userText.toLowerCase();

        if (t.includes("حجز") || t.includes("booking")) return "للحجز يمكنك زيارة صفحة الغرف Rooms أو التواصل معنا 👌";
        if (t.includes("سعر") || t.includes("price")) return "الأسعار تختلف حسب نوع الغرفة — شاهدها في قسم Rooms.";
        if (t.includes("غرف") || t.includes("room")) return "لدينا عدة أنواع من الغرف — الفردية والمزدوجة والجناح الفاخر.";
        if (t.includes("موقع") || t.includes("location")) return "الفندق يقع بالقرب من وسط المدينة والمعالم السياحية.";
        if (t.includes("مطعم") || t.includes("اكل")) return "نعم، لدينا مطعم فاخر يقدم بوفيه وأكلات عالمية.";
        if (t.includes("بسين") || t.includes("pool")) return "نعم يوجد حمام سباحة خارجي بإطلالة جميلة.";

        return "شكرًا لرسالتك 😊 كيف يمكنني مساعدتك؟";
    }

    // إرسال
    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage(text, "user");
        chatInput.value = "";

        setTimeout(() => appendMessage(getBotReply(text), "bot"), 300);
    }

    sendBtn.addEventListener("click", handleSend);
    chatInput.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    });

}

});
