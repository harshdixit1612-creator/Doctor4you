// ===== Authentication Pages (Futuristic Dark Theme) =====
import { storage, showToast, validateEmail, validatePassword, getInitials, formatFileSize } from './utils.js';
import { navigate } from './router.js';
import { showHealthCheckInModal } from './checkin.js';

// ===== LOGIN PAGE =====
export function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-page">
      <!-- Left: Immersive Visual -->
      <div class="auth-visual">
        <canvas id="particleCanvas"></canvas>
        <div class="visual-content" style="opacity:0;transform:translateY(20px);transition:all 0.8s ease">
          <div class="visual-brand">
            <div class="visual-brand-icon">
              <i class="fa-solid fa-heart-pulse"></i>
            </div>
            <span>HealthVault</span>
          </div>

          <div class="floating-elements">
            <!-- Central Pulse Ring -->
            <div class="pulse-ring">
              <div class="pulse-heart">
                <i class="fa-solid fa-heart-pulse"></i>
              </div>
            </div>

            <!-- ECG Line -->
            <div class="ecg-line">
              <svg viewBox="0 0 800 60" preserveAspectRatio="none">
                <path d="M0,30 L80,30 L100,30 L110,10 L120,50 L130,5 L140,55 L150,25 L170,30 L200,30 L280,30 L300,30 L310,10 L320,50 L330,5 L340,55 L350,25 L370,30 L400,30 L480,30 L500,30 L510,10 L520,50 L530,5 L540,55 L550,25 L570,30 L600,30 L680,30 L700,30 L710,10 L720,50 L730,5 L740,55 L750,25 L770,30 L800,30" />
              </svg>
            </div>

            <!-- DNA Helix -->
            <div class="dna-helix">
              <div class="dna-strand">
                <div class="dna-node" style="left:5px;top:0;animation:floatCard1 3s ease-in-out infinite"></div>
                <div class="dna-node secondary" style="right:5px;top:0;animation:floatCard2 3s ease-in-out infinite"></div>
                <div class="dna-connector" style="top:5px;"></div>
                <div class="dna-node" style="right:5px;top:40px;animation:floatCard1 3.5s ease-in-out infinite"></div>
                <div class="dna-node secondary" style="left:5px;top:40px;animation:floatCard2 3.5s ease-in-out infinite"></div>
                <div class="dna-connector" style="top:45px;"></div>
                <div class="dna-node" style="left:5px;top:80px;animation:floatCard1 4s ease-in-out infinite"></div>
                <div class="dna-node secondary" style="right:5px;top:80px;animation:floatCard2 4s ease-in-out infinite"></div>
                <div class="dna-connector" style="top:85px;"></div>
                <div class="dna-node" style="right:5px;top:120px;animation:floatCard1 3.2s ease-in-out infinite"></div>
                <div class="dna-node secondary" style="left:5px;top:120px;animation:floatCard2 3.2s ease-in-out infinite"></div>
                <div class="dna-connector" style="top:125px;"></div>
                <div class="dna-node" style="left:5px;top:160px;animation:floatCard1 3.8s ease-in-out infinite"></div>
                <div class="dna-node secondary" style="right:5px;top:160px;animation:floatCard2 3.8s ease-in-out infinite"></div>
                <div class="dna-connector" style="top:165px;"></div>
              </div>
            </div>

            <!-- Floating Stat Cards -->
            <div class="float-card card-bp">
              <div class="float-card-icon"><i class="fa-solid fa-heart"></i></div>
              <div>
                <div class="float-card-label">Blood Pressure</div>
                <div class="float-card-value">120/80 <small style="color:rgba(0,255,200,0.7);font-size:0.7rem">Normal</small></div>
              </div>
            </div>
            <div class="float-card card-sugar">
              <div class="float-card-icon"><i class="fa-solid fa-droplet"></i></div>
              <div>
                <div class="float-card-label">Blood Sugar</div>
                <div class="float-card-value">95 mg/dL</div>
              </div>
            </div>
            <div class="float-card card-score">
              <div class="float-card-icon"><i class="fa-solid fa-shield-heart"></i></div>
              <div>
                <div class="float-card-label">Health Score</div>
                <div class="float-card-value">92% <i class="fa-solid fa-arrow-trend-up" style="color:#00ffc8;font-size:0.8rem"></i></div>
              </div>
            </div>
          </div>

          <div class="visual-tagline">
            <h2>Your Health,<br/><span>Powered by AI</span></h2>
            <p>Advanced health monitoring with real-time analytics, intelligent disease detection, and personalized insights.</p>
          </div>

          <div class="visual-features">
            <div class="feature-pill"><i class="fa-solid fa-brain"></i> AI Analysis</div>
            <div class="feature-pill"><i class="fa-solid fa-chart-line"></i> Live Tracking</div>
            <div class="feature-pill"><i class="fa-solid fa-dna"></i> Gene Insights</div>
          </div>
        </div>
      </div>

      <!-- Right: Glassmorphism Login Form -->
      <div class="auth-form-panel">
        <div class="auth-form-container" style="opacity:0;transform:translateY(20px);transition:all 0.8s ease 0.3s">
          <div class="auth-form-header">
            <h1>Welcome Back 👋</h1>
            <p>Sign in to access your health dashboard</p>
          </div>
          <form class="auth-form" id="loginForm">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-wrapper">
                <input type="email" class="form-input" id="loginEmail" placeholder="you@example.com" autofocus />
                <i class="fa-solid fa-envelope input-icon"></i>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-wrapper">
                <input type="password" class="form-input" id="loginPassword" placeholder="Enter your password" />
                <i class="fa-solid fa-eye input-icon" id="loginTogglePassword"></i>
              </div>
            </div>
            <div style="display:flex;justify-content:flex-end;">
              <span class="forgot-link">Forgot Password?</span>
            </div>
            <button type="submit" class="btn-glow">
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
              Sign In
            </button>
          </form>

          <div class="auth-divider">or continue with</div>
          <button class="social-login-btn" type="button">
            <i class="fa-brands fa-google"></i>
            Sign in with Google
          </button>

          <div class="auth-footer">
            Don't have an account? <a href="#/signup">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Animate in
  requestAnimationFrame(() => {
    const visual = document.querySelector('.visual-content');
    const form = document.querySelector('.auth-form-container');
    if (visual) { visual.style.opacity = '1'; visual.style.transform = 'translateY(0)'; }
    if (form) { form.style.opacity = '1'; form.style.transform = 'translateY(0)'; }
  });

  // Initialize particle canvas
  initParticles();

  // Toggle password
  const toggleBtn = document.getElementById('loginTogglePassword');
  const passwordInput = document.getElementById('loginPassword');
  toggleBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleBtn.className = `fa-solid ${isPassword ? 'fa-eye-slash' : 'fa-eye'} input-icon`;
  });

  // Login form handler
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (!validateEmail(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    const users = storage.get('healthvault_users') || [];
    const user = users.find(u => u.email === email);

    if (!user) {
      showToast('No account found. Please sign up first.', 'error');
      return;
    }
    if (user.password !== password) {
      showToast('Incorrect password', 'error');
      return;
    }

    storage.set('healthvault_user', user);
    showToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
    showHealthCheckInModal();
  });
}

// ===== SIGNUP PAGE =====
export function renderSignup() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-visual">
        <canvas id="particleCanvas"></canvas>
        <div class="visual-content" style="opacity:0;transform:translateY(20px);transition:all 0.8s ease">
          <div class="visual-brand">
            <div class="visual-brand-icon">
              <i class="fa-solid fa-heart-pulse"></i>
            </div>
            <span>HealthVault</span>
          </div>

          <div class="floating-elements">
            <div class="pulse-ring">
              <div class="pulse-heart"><i class="fa-solid fa-user-plus"></i></div>
            </div>
            <div class="ecg-line">
              <svg viewBox="0 0 800 60" preserveAspectRatio="none">
                <path d="M0,30 L80,30 L100,30 L110,10 L120,50 L130,5 L140,55 L150,25 L170,30 L200,30 L280,30 L300,30 L310,10 L320,50 L330,5 L340,55 L350,25 L370,30 L400,30 L480,30 L500,30 L510,10 L520,50 L530,5 L540,55 L550,25 L570,30 L600,30 L680,30 L700,30 L710,10 L720,50 L730,5 L740,55 L750,25 L770,30 L800,30" />
              </svg>
            </div>
            <div class="float-card card-bp">
              <div class="float-card-icon"><i class="fa-solid fa-shield-heart"></i></div>
              <div>
                <div class="float-card-label">Secure</div>
                <div class="float-card-value">256-bit SSL</div>
              </div>
            </div>
            <div class="float-card card-score">
              <div class="float-card-icon"><i class="fa-solid fa-brain"></i></div>
              <div>
                <div class="float-card-label">AI Powered</div>
                <div class="float-card-value">Smart Insights</div>
              </div>
            </div>
          </div>

          <div class="visual-tagline">
            <h2>Start Your<br/><span>Health Journey</span></h2>
            <p>Join thousands who trust HealthVault to monitor and improve their health every day.</p>
          </div>

          <div class="visual-features">
            <div class="feature-pill"><i class="fa-solid fa-shield-halved"></i> Private & Secure</div>
            <div class="feature-pill"><i class="fa-solid fa-bell"></i> Smart Alerts</div>
            <div class="feature-pill"><i class="fa-solid fa-chart-pie"></i> Analytics</div>
          </div>
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="auth-form-container" style="opacity:0;transform:translateY(20px);transition:all 0.8s ease 0.3s">
          <div class="auth-form-header">
            <h1>Create Account ✨</h1>
            <p>Fill in your details to get started</p>
          </div>

          <div class="step-indicator">
            <div class="step active" id="stepIndicator1">
              <div class="step-number">1</div>
              <span class="step-label">Details</span>
            </div>
            <div class="step-line" id="stepLine"></div>
            <div class="step" id="stepIndicator2">
              <div class="step-number">2</div>
              <span class="step-label">Upload Report</span>
            </div>
          </div>

          <form class="auth-form" id="signupForm">
            <!-- Step 1 -->
            <div class="auth-step active" id="signupStep1">
              <div style="display:flex;flex-direction:column;gap:20px;">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-input" id="signupName" placeholder="John Doe" />
                </div>
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-input" id="signupEmail" placeholder="you@example.com" />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Password</label>
                    <div class="input-wrapper">
                      <input type="password" class="form-input" id="signupPassword" placeholder="Min 6 characters" />
                      <i class="fa-solid fa-eye input-icon" id="signupTogglePass"></i>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Confirm Password</label>
                    <input type="password" class="form-input" id="signupConfirmPassword" placeholder="Re-enter password" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Age</label>
                    <input type="number" class="form-input" id="signupAge" placeholder="25" min="1" max="120" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Gender</label>
                    <select class="form-select" id="signupGender">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <button type="button" class="btn-glow" id="goToStep2">
                  Continue <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="auth-step" id="signupStep2">
              <div style="display:flex;flex-direction:column;gap:20px;">
                <div class="file-upload" id="fileDropZone">
                  <i class="fa-solid fa-cloud-arrow-up file-upload-icon" style="font-size:2rem;margin-bottom:8px"></i>
                  <p class="file-upload-text"><strong>Click to upload</strong> or drag and drop</p>
                  <p class="file-upload-hint">PDF, JPG, PNG (max 10MB)</p>
                  <input type="file" id="reportFile" accept=".pdf,.jpg,.jpeg,.png" style="display:none" />
                </div>
                <div id="filePreviewContainer" class="hidden"></div>
                <div style="display:flex;gap:12px;">
                  <button type="button" class="btn-secondary" id="backToStep1" style="flex:1;padding:14px;border-radius:12px;cursor:pointer;font-family:inherit;font-weight:600">
                    <i class="fa-solid fa-arrow-left"></i> Back
                  </button>
                  <button type="submit" class="btn-glow" style="flex:2;">
                    <i class="fa-solid fa-user-plus"></i> Create Account
                  </button>
                </div>
                <p style="text-align:center;font-size:0.8rem;color:rgba(255,255,255,0.35);">
                  You can skip the upload and add reports later
                </p>
              </div>
            </div>
          </form>
          <div class="auth-footer">
            Already have an account? <a href="#/login">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Animate in
  requestAnimationFrame(() => {
    const visual = document.querySelector('.visual-content');
    const form = document.querySelector('.auth-form-container');
    if (visual) { visual.style.opacity = '1'; visual.style.transform = 'translateY(0)'; }
    if (form) { form.style.opacity = '1'; form.style.transform = 'translateY(0)'; }
  });

  initParticles();

  let uploadedFile = null;

  // Toggle password
  const toggleBtn = document.getElementById('signupTogglePass');
  const passInput = document.getElementById('signupPassword');
  toggleBtn.addEventListener('click', () => {
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
    toggleBtn.className = `fa-solid ${isPass ? 'fa-eye-slash' : 'fa-eye'} input-icon`;
  });

  // Steps
  document.getElementById('goToStep2').addEventListener('click', () => {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirmPassword').value;
    const age = document.getElementById('signupAge').value;
    const gender = document.getElementById('signupGender').value;

    if (!name || !email || !password || !confirm || !age || !gender) { showToast('Please fill in all fields', 'error'); return; }
    if (!validateEmail(email)) { showToast('Please enter a valid email', 'error'); return; }
    if (!validatePassword(password)) { showToast('Password must be at least 6 characters', 'error'); return; }
    if (password !== confirm) { showToast('Passwords do not match', 'error'); return; }

    const users = storage.get('healthvault_users') || [];
    if (users.find(u => u.email === email)) { showToast('An account with this email already exists', 'error'); return; }

    document.getElementById('signupStep1').classList.remove('active');
    document.getElementById('signupStep2').classList.add('active');
    document.getElementById('stepIndicator1').classList.remove('active');
    document.getElementById('stepIndicator1').classList.add('completed');
    document.getElementById('stepLine').classList.add('completed');
    document.getElementById('stepIndicator2').classList.add('active');
  });

  document.getElementById('backToStep1').addEventListener('click', () => {
    document.getElementById('signupStep2').classList.remove('active');
    document.getElementById('signupStep1').classList.add('active');
    document.getElementById('stepIndicator2').classList.remove('active');
    document.getElementById('stepLine').classList.remove('completed');
    document.getElementById('stepIndicator1').classList.remove('completed');
    document.getElementById('stepIndicator1').classList.add('active');
  });

  // File upload
  const dropZone = document.getElementById('fileDropZone');
  const fileInput = document.getElementById('reportFile');
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault(); dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => { if (fileInput.files.length) handleFile(fileInput.files[0]); });

  function handleFile(file) {
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) { showToast('Please upload a PDF or image file', 'error'); return; }
    if (file.size > 10 * 1024 * 1024) { showToast('File size must be under 10MB', 'error'); return; }
    uploadedFile = { name: file.name, size: file.size, type: file.type, uploadDate: new Date().toISOString() };
    const previewContainer = document.getElementById('filePreviewContainer');
    previewContainer.classList.remove('hidden');
    previewContainer.innerHTML = `
      <div class="file-preview">
        <i class="fa-solid ${file.type === 'application/pdf' ? 'fa-file-pdf' : 'fa-file-image'}"></i>
        <div class="file-preview-info">
          <div class="file-preview-name">${file.name}</div>
          <div class="file-preview-size">${formatFileSize(file.size)}</div>
        </div>
        <i class="fa-solid fa-xmark remove-file" id="removeFile"></i>
      </div>
    `;
    document.getElementById('removeFile').addEventListener('click', () => {
      uploadedFile = null; previewContainer.classList.add('hidden'); fileInput.value = '';
    });
    showToast('File uploaded successfully!', 'success');
  }

  // Submit
  document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const age = parseInt(document.getElementById('signupAge').value);
    const gender = document.getElementById('signupGender').value;

    const user = { id: Date.now().toString(), name, email, password, age, gender, createdAt: new Date().toISOString() };

    const users = storage.get('healthvault_users') || [];
    users.push(user);
    storage.set('healthvault_users', users);

    if (uploadedFile) {
      const reports = storage.get('healthvault_reports') || [];
      reports.push({ ...uploadedFile, userId: user.id, id: Date.now().toString() });
      storage.set('healthvault_reports', reports);
    }

    showToast('Account created! Welcome to HealthVault 🎉', 'success');
    // Auto-login the new user
    storage.set('healthvault_user', user);
    // Show health check-in modal (upload report + basic questions)
    showHealthCheckInModal();
  });
}

// ===== PARTICLE CANVAS =====
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles;

  function resize() {
    const container = canvas.parentElement;
    width = canvas.width = container.offsetWidth;
    height = canvas.height = container.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 15000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.7 ? '0, 255, 200' : '0, 168, 255',
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 168, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}
