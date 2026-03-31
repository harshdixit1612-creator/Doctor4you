// ===== Utility Functions =====

// LocalStorage helpers
export const storage = {
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

// Toast notification
export function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");

  // ✅ If container not exists → create it
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.innerText = message;

  toast.style.background = type === "error" ? "#ff4d4f" : "#4CAF50";
  toast.style.color = "#fff";
  toast.style.padding = "10px 15px";
  toast.style.marginTop = "10px";
  toast.style.borderRadius = "5px";

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Form validation
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  return password.length >= 6;
}

// Generate initials from name
export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Format date
export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

// Get current user
export function getCurrentUser() {
  return storage.get('healthvault_user');
}

export function isAuthenticated() {
  return !!getCurrentUser();
}

// Generate unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

// Debounce
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Sample health data generator
export function generateSampleHealthData() {
  const days = 7;
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      healthScore: Math.floor(70 + Math.random() * 25),
      bp_systolic: Math.floor(110 + Math.random() * 30),
      bp_diastolic: Math.floor(70 + Math.random() * 20),
      sugar: Math.floor(80 + Math.random() * 60),
      weight: (65 + Math.random() * 5).toFixed(1)
    });
  }
  return data;
}

// Sample diseases
export function getSampleDiseases() {
  return [
    {
      name: 'Type 2 Diabetes',
      severity: 'medium',
      description: 'Blood sugar levels are higher than normal. Regular monitoring and lifestyle changes are recommended.',
      symptoms: ['Fatigue', 'Increased Thirst', 'Frequent Urination', 'Blurred Vision']
    },
    {
      name: 'Hypertension Stage 1',
      severity: 'low',
      description: 'Blood pressure is slightly elevated (130-139/80-89 mmHg). Manage with diet, exercise, and stress reduction.',
      symptoms: ['Headaches', 'Dizziness', 'Shortness of Breath']
    },
    {
      name: 'Vitamin D Deficiency',
      severity: 'low',
      description: 'Vitamin D levels are below the recommended range. Consider supplements and increased sun exposure.',
      symptoms: ['Bone Pain', 'Fatigue', 'Muscle Weakness']
    },
    {
      name: 'High Cholesterol',
      severity: 'high',
      description: 'LDL cholesterol levels are significantly elevated, increasing cardiovascular risk. Medication may be required.',
      symptoms: ['No direct symptoms', 'Detected via blood test']
    }
  ];
}
