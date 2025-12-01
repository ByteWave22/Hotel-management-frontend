// js/chat.js - COMPLETE FIXED VERSION

console.log('🤖 Chat.js loading...');

document.addEventListener('DOMContentLoaded', () => {
  console.log('🤖 Chatbot initializing...');
  
  const chatBtn = document.getElementById('chatbot-btn');
  const chatWindow = document.getElementById('chatbot-window');
  const chatClose = document.getElementById('chat-close');
  const chatBody = document.getElementById('chat-body');
  const chatBottom = document.getElementById('chat-bottom');
  
  if (!chatBtn || !chatWindow || !chatClose) {
    console.log('⚠️ Chat elements not found on this page');
    return;
  }

  console.log('✅ Chat elements found');

  // Open chat
  chatBtn.addEventListener('click', () => {
    console.log('💬 Opening chat window');
    chatWindow.style.display = 'flex';
    chatBtn.style.display = 'none';
    chatWindow.setAttribute('aria-hidden', 'false');
  });

  // Close chat
  chatClose.addEventListener('click', () => {
    console.log('❌ Closing chat window');
    chatWindow.style.display = 'none';
    chatBtn.style.display = 'flex';
    chatWindow.setAttribute('aria-hidden', 'true');
  });

  // Handle option button clicks
  const optButtons = document.querySelectorAll('.opt-btn');
  console.log(`🔘 Found ${optButtons.length} option buttons`);
  
  optButtons.forEach(btn => {
    btn.addEventListener('click', async function() {
      const value = this.getAttribute('data-val');
      console.log(`🔘 Button clicked: ${value}`);
      
      let message = '';

      switch(value) {
        case '1':
          message = 'وريني كل الغرف';
          break;
        case '2':
          message = 'وريني الغرف المتاحة';
          break;
        case '3':
          message = 'آخر الحجوزات';
          break;
        case '4':
          message = 'إحصائيات نوع الغرفة';
          break;
      }

      if (message) {
        await sendMessage(message);
      }
    });
  });

  // Send message function
  async function sendMessage(message) {
    console.log('📤 Sending message:', message);
    
    try {
      // Check if Storage and API are available
      if (typeof Storage === 'undefined') {
        console.error('❌ Storage not available');
        displayBotMessage('⚠️ خطأ: النظام غير متاح');
        return;
      }

      if (typeof API === 'undefined') {
        console.error('❌ API not available');
        displayBotMessage('⚠️ خطأ: الاتصال بالخادم غير متاح');
        return;
      }

      // Check if user is logged in
      if (!Storage.isLoggedIn()) {
        console.log('⚠️ User not logged in');
        displayBotMessage('⚠️ يجب تسجيل الدخول أولاً للتحدث مع البوت');
        return;
      }

      // Show user message
      displayUserMessage(message);

      // Show loading
      const loadingId = showLoading();

      // Send to API
      console.log('🚀 Calling API.sendChatMessage...');
      const response = await API.sendChatMessage(message);
      console.log('📥 Chat response:', response);
      
      // Remove loading
      removeLoading(loadingId);

      // Display bot response
      if (response && response.reply) {
        displayBotMessage(response.reply);
      } else if (response && response.message) {
        displayBotMessage(response.message);
      } else {
        displayBotMessage('⚠️ عذراً، حدث خطأ في معالجة طلبك');
      }

    } catch (error) {
      console.error('💥 Chat error:', error);
      removeLoading();
      
      let errorMessage = '⚠️ عذراً، حدث خطأ في الاتصال بالخادم';
      
      if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = '⚠️ يجب تسجيل الدخول للاستمرار';
      } else if (error.message) {
        errorMessage = `⚠️ ${error.message}`;
      }
      
      displayBotMessage(errorMessage);
    }
  }

  // Display user message
  function displayUserMessage(message) {
    console.log('👤 Display user message:', message);
    const messageEl = document.createElement('div');
    messageEl.className = 'bubble user';
    messageEl.textContent = message;
    chatBody.appendChild(messageEl);
    scrollToBottom();
  }

  // Display bot message
  function displayBotMessage(message) {
    console.log('🤖 Display bot message:', message);
    const messageEl = document.createElement('div');
    messageEl.className = 'bubble bot';
    
    // Format the message (convert markdown-style formatting)
    const formattedMessage = message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    
    messageEl.innerHTML = formattedMessage;
    chatBody.appendChild(messageEl);
    scrollToBottom();
  }

  // Show loading indicator
  function showLoading() {
    const loadingId = 'loading-' + Date.now();
    const loadingEl = document.createElement('div');
    loadingEl.id = loadingId;
    loadingEl.className = 'bubble bot';
    loadingEl.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    chatBody.appendChild(loadingEl);
    scrollToBottom();
    return loadingId;
  }

  // Remove loading indicator
  function removeLoading(loadingId) {
    if (loadingId) {
      const loadingEl = document.getElementById(loadingId);
      if (loadingEl) {
        loadingEl.remove();
      }
    } else {
      // Remove any loading indicator
      const allLoading = chatBody.querySelectorAll('.typing-indicator');
      allLoading.forEach(el => el.parentElement.remove());
    }
  }

  // Scroll to bottom
  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  console.log('✅ Chatbot ready and waiting for user interaction');
});

console.log('✅ Chat.js loaded successfully');