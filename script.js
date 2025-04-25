// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeBtns = document.querySelectorAll('.close');
const chatToggle = document.getElementById('chatToggle');
const chatContainer = document.getElementById('chatContainer');
const minimizeChat = document.querySelector('.minimize-chat');
const moodBtns = document.querySelectorAll('.mood-btn');
const resourceFilters = document.querySelectorAll('.filter-btn');

// Authentication State
let currentUser = null;

// Form Validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

// Authentication Functions
function handleLogin(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  const password = e.target.querySelector('input[type="password"]').value;

  if (!validateEmail(email)) {
    showError('Please enter a valid email address');
    return;
  }

  if (!validatePassword(password)) {
    showError('Password must be at least 8 characters long');
    return;
  }

  // Simulate login
  simulateAuth(email, true);
}

function handleSignup(e) {
  e.preventDefault();
  const name = e.target.querySelector('input[type="text"]').value;
  const email = e.target.querySelector('input[type="email"]').value;
  const password = e.target.querySelector('input[type="password"]').value;
  const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;

  if (!name || name.length < 2) {
    showError('Please enter your full name');
    return;
  }

  if (!validateEmail(email)) {
    showError('Please enter a valid email address');
    return;
  }

  if (!validatePassword(password)) {
    showError('Password must be at least 8 characters long');
    return;
  }

  if (password !== confirmPassword) {
    showError('Passwords do not match');
    return;
  }

  // Simulate signup
  simulateAuth(email, false);
}

function simulateAuth(email, isLogin) {
  showLoading();
  
  setTimeout(() => {
    currentUser = {
      email: email,
      name: email.split('@')[0]
    };
    
    updateAuthUI();
    hideLoading();
    closeModal(isLogin ? loginModal : signupModal);
    showSuccess(`Successfully ${isLogin ? 'logged in' : 'signed up'}!`);
  }, 1500);
}

function updateAuthUI() {
  if (currentUser) {
    loginBtn.style.display = 'none';
    signupBtn.textContent = currentUser.name;
    signupBtn.onclick = handleLogout;
  } else {
    loginBtn.style.display = 'block';
    signupBtn.textContent = 'Sign Up';
    signupBtn.onclick = () => openModal(signupModal);
  }
}

function handleLogout() {
  currentUser = null;
  updateAuthUI();
  showSuccess('Successfully logged out!');
}

// UI Feedback Functions
function showError(message) {
  const toast = createToast(message, 'error');
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showSuccess(message) {
  const toast = createToast(message, 'success');
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function createToast(message, type) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.right = '20px';
  toast.style.padding = '1rem 2rem';
  toast.style.borderRadius = '8px';
  toast.style.backgroundColor = type === 'error' ? '#FEE2E2' : '#D1FAE5';
  toast.style.color = type === 'error' ? '#DC2626' : '#059669';
  toast.style.zIndex = '2000';
  return toast;
}

function showLoading() {
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.style.position = 'fixed';
  loader.style.top = '0';
  loader.style.left = '0';
  loader.style.width = '100%';
  loader.style.height = '100%';
  loader.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  loader.style.display = 'flex';
  loader.style.justifyContent = 'center';
  loader.style.alignItems = 'center';
  loader.style.zIndex = '2000';
  
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  spinner.style.width = '40px';
  spinner.style.height = '40px';
  spinner.style.border = '4px solid #f3f3f3';
  spinner.style.borderTop = '4px solid #6366F1';
  spinner.style.borderRadius = '50%';
  spinner.style.animation = 'spin 1s linear infinite';
  
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
  
  document.head.appendChild(style);
  loader.appendChild(spinner);
  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
}

// Modal Functions
function openModal(modal) {
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Event Listeners
loginBtn.addEventListener('click', () => openModal(loginModal));
signupBtn.addEventListener('click', () => openModal(signupModal));

document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('signupForm').addEventListener('submit', handleSignup);

closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(btn.closest('.modal'));
  });
});

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    closeModal(e.target);
  }
});

// Enhanced Chat Widget
let isTyping = false;
let isChatOpen = false;

// Function to toggle chat visibility with animation
function toggleChat() {
  isChatOpen = !isChatOpen;
  
  if (isChatOpen) {
    // Open chat
    chatContainer.style.display = 'flex';
    chatContainer.style.opacity = '0';
    chatContainer.style.transform = 'translateY(20px)';
    
    // Trigger animation
    setTimeout(() => {
      chatContainer.style.opacity = '1';
      chatContainer.style.transform = 'translateY(0)';
    }, 50);
    
    // Focus input
    document.querySelector('.chat-input input').focus();
    
    // Update button text
    chatToggle.querySelector('.chat-text').textContent = 'Close Chat';
  } else {
    // Close chat with animation
    chatContainer.style.opacity = '0';
    chatContainer.style.transform = 'translateY(20px)';
    
    // Hide after animation
    setTimeout(() => {
      chatContainer.style.display = 'none';
    }, 300);
    
    // Update button text
    chatToggle.querySelector('.chat-text').textContent = 'Need Help?';
  }
}

// Event listeners for chat widget
chatToggle.addEventListener('click', toggleChat);

minimizeChat.addEventListener('click', () => {
  toggleChat(); // Use the same animation for minimizing
});

// Add transition styles to chat container
chatContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

// Chat message handling
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.send-message');

const chatResponses = {
  greetings: {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    responses: [
      "Hi! How can I help you today?",
      "Hello! What brings you here today?",
      "Hey there! How are you feeling?"
    ]
  },
  anxiety: {
    patterns: ['anxiety', 'anxious', 'worried', 'stress', 'stressed'],
    responses: [
      "I understand anxiety can be overwhelming. Would you like to learn some coping techniques?",
      "It's common to feel anxious. Let's explore some calming exercises together.",
      "I'm here to help you manage your anxiety. Would you like to try a breathing exercise?"
    ]
  },
  depression: {
    patterns: ['depression', 'depressed', 'sad', 'hopeless', 'down'],
    responses: [
      "I'm sorry you're feeling this way. Would you like to talk to a counselor?",
      "Depression can be really tough. Let's explore some resources that might help.",
      "You're not alone in this. Would you like to learn about professional support options?"
    ]
  },
  help: {
    patterns: ['help', 'support', 'guidance', 'assist'],
    responses: [
      "I'm here to help! What kind of support are you looking for?",
      "I can help you with various mental health resources. What specific area interests you?",
      "Let me know what you need help with, and I'll guide you to the right resources."
    ]
  }
};

function addMessage(message, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
  messageDiv.textContent = message;
  
  // Add animation styles
  messageDiv.style.opacity = '0';
  messageDiv.style.transform = 'translateY(10px)';
  messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
  chatMessages.appendChild(messageDiv);
  
  // Trigger animation
  setTimeout(() => {
    messageDiv.style.opacity = '1';
    messageDiv.style.transform = 'translateY(0)';
  }, 50);
  
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check each category for matching patterns
  for (const category of Object.values(chatResponses)) {
    if (category.patterns.some(pattern => lowerMessage.includes(pattern))) {
      return category.responses[Math.floor(Math.random() * category.responses.length)];
    }
  }
  
  // Default response if no patterns match
  return "I'm here to support you. Would you like to explore our resources or talk to a professional?";
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot typing';
  typingDiv.textContent = '...';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typingDiv;
}

async function handleChat() {
  const message = chatInput.value.trim();
  if (message && !isTyping) {
    isTyping = true;
    addMessage(message, true);
    chatInput.value = '';
    
    const typingIndicator = showTypingIndicator();
    
    // Simulate AI thinking and typing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    typingIndicator.remove();
    const response = getAIResponse(message);
    addMessage(response);
    isTyping = false;
  }
}

sendButton.addEventListener('click', handleChat);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleChat();
  }
});

// Initialize chat with a welcome message
setTimeout(() => {
  addMessage("Hello! I'm your Nexus. How can I help you today?", false);
}, 1000);

// Mood Tracking with Chart.js
let moodData = [];
const moodChart = new Chart(
  document.querySelector('.mood-chart'),
  {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Mood History',
        data: [],
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#6366F1',
        pointBorderColor: '#fff',
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#6366F1',
        pointHoverBorderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1F2937',
          bodyColor: '#1F2937',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `Mood: ${['Very Bad', 'Bad', 'Okay', 'Good', 'Very Good'][context.raw - 1]}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              return ['Very Bad', 'Bad', 'Okay', 'Good', 'Very Good'][value - 1];
            },
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 12
            }
          }
        }
      }
    }
  }
);

// Enhanced mood tracking functionality
function handleMoodSelection(mood) {
  const timestamp = new Date();
  moodData.push({ mood, timestamp });
  
  // Keep only last 7 days of data
  if (moodData.length > 7) {
    moodData.shift();
  }
  
  updateMoodChart();
  saveMoodData();
  
  // Show feedback
  showSuccess(`Mood logged: ${mood.charAt(0).toUpperCase() + mood.slice(1)}`);
  
  // Animate selected button
  const selectedBtn = document.querySelector(`[data-mood="${mood}"]`);
  selectedBtn.classList.add('selected');
  setTimeout(() => selectedBtn.classList.remove('selected'), 1000);
}

function updateMoodChart() {
  const labels = moodData.map(d => {
    const date = new Date(d.timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
  
  const values = moodData.map(d => {
    const moodValues = {
      'great': 5,
      'good': 4,
      'okay': 3,
      'down': 2,
      'bad': 1
    };
    return moodValues[d.mood];
  });
  
  moodChart.data.labels = labels;
  moodChart.data.datasets[0].data = values;
  moodChart.update();
  
  // Update mood summary
  updateMoodSummary();
}

function updateMoodSummary() {
  if (moodData.length === 0) return;
  
  const moodSummary = document.querySelector('.mood-summary');
  if (!moodSummary) return;
  
  const latestMood = moodData[moodData.length - 1].mood;
  const averageMood = calculateAverageMood();
  
  moodSummary.innerHTML = `
    <div class="summary-item">
      <h4>Current Mood</h4>
      <p>${latestMood.charAt(0).toUpperCase() + latestMood.slice(1)}</p>
    </div>
    <div class="summary-item">
      <h4>7-Day Average</h4>
      <p>${averageMood}</p>
    </div>
  `;
}

function calculateAverageMood() {
  if (moodData.length === 0) return 'No data';
  
  const moodValues = {
    'great': 5,
    'good': 4,
    'okay': 3,
    'down': 2,
    'bad': 1
  };
  
  const sum = moodData.reduce((acc, curr) => acc + moodValues[curr.mood], 0);
  const avg = sum / moodData.length;
  
  if (avg >= 4.5) return 'Very Good';
  if (avg >= 3.5) return 'Good';
  if (avg >= 2.5) return 'Okay';
  if (avg >= 1.5) return 'Down';
  return 'Bad';
}

function saveMoodData() {
  localStorage.setItem('moodData', JSON.stringify(moodData));
}

function loadMoodData() {
  const saved = localStorage.getItem('moodData');
  if (saved) {
    moodData = JSON.parse(saved).map(item => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
    updateMoodChart();
  }
}

// Initialize mood tracking
document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    handleMoodSelection(btn.dataset.mood);
  });
});

// Load saved mood data on page load
loadMoodData();

// Smooth scroll
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

// Resources Section
const resourcesData = [
  {
    id: 1,
    type: 'articles',
    title: 'Understanding Anxiety',
    description: 'Learn about anxiety symptoms and coping strategies',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=300'
  },
  {
    id: 2,
    type: 'videos',
    title: 'Guided Meditation',
    description: 'A 10-minute meditation for stress relief',
    duration: '10 min',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300'
  },
  {
    id: 3,
    type: 'exercises',
    title: 'Breathing Techniques',
    description: 'Simple breathing exercises for anxiety relief',
    difficulty: 'Beginner',
    image: 'https://images.unsplash.com/photo-1506126969121-f9c0ebe88b47?w=300'
  },
  {
    id: 4,
    type: 'articles',
    title: 'Depression Support',
    description: 'Understanding and managing depression',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1454894760-6d7d082e3b2f?w=300'
  }
];

// Initialize resources grid
function initializeResources() {
  const resourceGrid = document.querySelector('.resource-grid');
  if (!resourceGrid) return;

  function createResourceCard(resource) {
    return `
      <div class="resource-card" data-type="${resource.type}">
        <div class="resource-image">
          <img src="${resource.image}" alt="${resource.title}">
          <span class="resource-type">${resource.type}</span>
        </div>
        <div class="resource-content">
          <h3>${resource.title}</h3>
          <p>${resource.description}</p>
          <div class="resource-meta">
            ${resource.readTime ? `<span>📚 ${resource.readTime}</span>` : ''}
            ${resource.duration ? `<span>⏱️ ${resource.duration}</span>` : ''}
            ${resource.difficulty ? `<span>📊 ${resource.difficulty}</span>` : ''}
          </div>
          <button class="resource-btn">Access Resource</button>
        </div>
      </div>
    `;
  }

  // Initial render
  resourceGrid.innerHTML = resourcesData.map(createResourceCard).join('');

  // Filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter resources
      const resources = document.querySelectorAll('.resource-card');
      resources.forEach(card => {
        if (filter === 'all' || card.dataset.type === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Resource button click handlers
  document.querySelectorAll('.resource-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.resource-card');
      const resourceTitle = card.querySelector('h3').textContent;
      showSuccess(`Opening resource: ${resourceTitle}`);
      // Add actual resource opening logic here
    });
  });
}

// Footer enhancements
function enhanceFooter() {
  const footerLinks = document.querySelectorAll('.footer-section a');
  const socialLinks = document.querySelectorAll('.social-links a');
  const emergencySupport = document.querySelector('.emergency');

  // Enhance footer links
  footerLinks.forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      const linkText = document.createElement('span');
      linkText.className = 'link-preview';
      linkText.textContent = link.getAttribute('aria-label') || 'View Page';
      link.appendChild(linkText);
    });

    link.addEventListener('mouseleave', () => {
      const preview = link.querySelector('.link-preview');
      if (preview) preview.remove();
    });
  });

  // Enhance social links
  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const platform = link.textContent;
      window.open(link.href, `_blank`, 'noopener,noreferrer');
      showSuccess(`Opening ${platform} in a new tab`);
    });
  });

  // Emergency support pulse animation
  if (emergencySupport) {
    setInterval(() => {
      emergencySupport.classList.add('pulse');
      setTimeout(() => emergencySupport.classList.remove('pulse'), 1000);
    }, 5000);
  }
}

// Enhanced CTA Section Interactions
function enhanceCTASection() {
  const ctaButtons = document.querySelectorAll('.cta-button');
  
  ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', (e) => {
      const x = e.clientX - button.getBoundingClientRect().left;
      const y = e.clientY - button.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      button.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 1000);
    });
    
    button.addEventListener('click', () => {
      if (button.classList.contains('primary')) {
        showSuccess('Starting your journey...');
        // Add journey start logic here
      } else {
        showSuccess('Opening pricing plans...');
        // Add plans display logic here
      }
    });
  });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
  initializeResources();
  enhanceFooter();
  enhanceCTASection();
});