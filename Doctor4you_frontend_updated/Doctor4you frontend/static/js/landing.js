// ===== Landing Page =====
import { navigate } from './router.js';
import { isAuthenticated } from './utils.js';

export function renderLanding() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="landing-page">
      <!-- Particle Background -->
      <canvas id="landingParticles"></canvas>

      <!-- Navigation -->
      <nav class="landing-nav">
        <div class="landing-nav-inner">
          <div class="landing-brand">
            <i class="fa-solid fa-heart-pulse"></i>
            <span>HealthVault</span>
          </div>
          <div class="landing-nav-links">
            <a href="#features" class="nav-link">Features</a>
            <a href="#how-it-works" class="nav-link">How It Works</a>
            <a href="#stats" class="nav-link">Stats</a>
          </div>
          <div class="landing-nav-actions">
            <button class="nav-btn-ghost" id="landingLogin">Sign In</button>
            <button class="nav-btn-glow" id="landingSignup">
              Get Started <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">
            <i class="fa-solid fa-bolt"></i> AI-Powered Health Platform
          </div>
          <h1 class="hero-title">
            Monitor Your Health<br/>
            With <span class="gradient-text">Intelligence</span>
          </h1>
          <p class="hero-subtitle">
            Advanced AI-driven health analytics, real-time tracking, disease detection, 
            and personalized insights — all in one beautiful platform.
          </p>
          <div class="hero-actions">
            <button class="btn-glow hero-cta" id="heroCta">
              <i class="fa-solid fa-rocket"></i> Start For Free
            </button>
            <button class="btn-glass hero-demo">
              <i class="fa-solid fa-play"></i> Watch Demo
            </button>
          </div>
          <div class="hero-trust">
            <div class="trust-avatars">
              <div class="trust-avatar" style="background:linear-gradient(135deg,#ff6b6b,#ee5a24)">JD</div>
              <div class="trust-avatar" style="background:linear-gradient(135deg,#00a8ff,#0097e6)">AS</div>
              <div class="trust-avatar" style="background:linear-gradient(135deg,#00ffc8,#00b894)">MK</div>
              <div class="trust-avatar" style="background:linear-gradient(135deg,#ffa502,#e17055)">RP</div>
              <div class="trust-avatar more">+2k</div>
            </div>
            <span>Trusted by <strong>2,000+</strong> users worldwide</span>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-dashboard-preview">
            <div class="preview-topbar">
              <div class="preview-dots">
                <span style="background:#ff5f57"></span>
                <span style="background:#ffbd2e"></span>
                <span style="background:#28ca41"></span>
              </div>
              <div class="preview-title">HealthVault Dashboard</div>
            </div>
            <div class="preview-body">
              <div class="preview-stat-row">
                <div class="preview-stat">
                  <div class="preview-stat-icon" style="background:rgba(0,255,200,0.15);color:#00ffc8">
                    <i class="fa-solid fa-heart-pulse"></i>
                  </div>
                  <div class="preview-stat-text">
                    <small>Health Score</small>
                    <strong>92%</strong>
                  </div>
                </div>
                <div class="preview-stat">
                  <div class="preview-stat-icon" style="background:rgba(255,71,87,0.15);color:#ff4757">
                    <i class="fa-solid fa-heart"></i>
                  </div>
                  <div class="preview-stat-text">
                    <small>Heart Rate</small>
                    <strong>72 bpm</strong>
                  </div>
                </div>
                <div class="preview-stat">
                  <div class="preview-stat-icon" style="background:rgba(0,168,255,0.15);color:#00a8ff">
                    <i class="fa-solid fa-droplet"></i>
                  </div>
                  <div class="preview-stat-text">
                    <small>Blood Sugar</small>
                    <strong>95 mg</strong>
                  </div>
                </div>
              </div>
              <div class="preview-chart">
                <div class="preview-chart-title">Health Trend</div>
                <svg viewBox="0 0 300 80" class="preview-chart-svg">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="rgba(0,168,255,0.3)"/>
                      <stop offset="100%" stop-color="rgba(0,168,255,0)"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,60 Q30,50 60,45 T120,30 T180,35 T240,20 T300,25" stroke="#00a8ff" stroke-width="2" fill="none" class="chart-line-anim"/>
                  <path d="M0,60 Q30,50 60,45 T120,30 T180,35 T240,20 T300,25 L300,80 L0,80 Z" fill="url(#chartGrad)" class="chart-area-anim"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="hero-glow-orb"></div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section" id="features">
        <div class="section-header">
          <div class="section-badge"><i class="fa-solid fa-sparkles"></i> Features</div>
          <h2>Everything You Need for<br/><span class="gradient-text">Smarter Health Monitoring</span></h2>
          <p>Comprehensive tools designed to keep you informed and in control of your wellness journey.</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-card-icon" style="background:rgba(0,168,255,0.12);color:#00a8ff">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <h3>Real-Time Analytics</h3>
            <p>Interactive charts and graphs that visualize your health data trends over time.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card-icon" style="background:rgba(0,255,200,0.12);color:#00ffc8">
              <i class="fa-solid fa-brain"></i>
            </div>
            <h3>AI Disease Detection</h3>
            <p>Machine learning algorithms analyze your reports to detect potential health conditions early.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card-icon" style="background:rgba(255,165,2,0.12);color:#ffa502">
              <i class="fa-solid fa-pills"></i>
            </div>
            <h3>Medicine Reminders</h3>
            <p>Never miss a dose with smart, customizable medication reminders and tracking.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card-icon" style="background:rgba(255,71,87,0.12);color:#ff4757">
              <i class="fa-solid fa-file-medical"></i>
            </div>
            <h3>Report Management</h3>
            <p>Upload, store, and analyze your health reports in one secure, accessible location.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card-icon" style="background:rgba(116,103,240,0.12);color:#7467f0">
              <i class="fa-solid fa-shield-heart"></i>
            </div>
            <h3>Health Score</h3>
            <p>Get an AI-calculated overall health score based on your vital metrics and lifestyle.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card-icon" style="background:rgba(46,213,115,0.12);color:#2ed573">
              <i class="fa-solid fa-bell"></i>
            </div>
            <h3>Smart Alerts</h3>
            <p>Receive intelligent notifications about anomalies in your health patterns.</p>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-section" id="how-it-works">
        <div class="section-header">
          <div class="section-badge"><i class="fa-solid fa-route"></i> How It Works</div>
          <h2>Get Started in<br/><span class="gradient-text">Three Simple Steps</span></h2>
        </div>
        <div class="steps-row">
          <div class="step-card">
            <div class="step-card-number">01</div>
            <div class="step-card-icon"><i class="fa-solid fa-user-plus"></i></div>
            <h3>Create Account</h3>
            <p>Sign up in seconds and set up your health profile with ease.</p>
          </div>
          <div class="step-connector">
            <i class="fa-solid fa-chevron-right"></i>
          </div>
          <div class="step-card">
            <div class="step-card-number">02</div>
            <div class="step-card-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>
            <h3>Upload Reports</h3>
            <p>Upload your health reports and let our AI analyze them for insights.</p>
          </div>
          <div class="step-connector">
            <i class="fa-solid fa-chevron-right"></i>
          </div>
          <div class="step-card">
            <div class="step-card-number">03</div>
            <div class="step-card-icon"><i class="fa-solid fa-chart-pie"></i></div>
            <h3>Track & Improve</h3>
            <p>Monitor your health metrics and follow personalized recommendations.</p>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section" id="stats">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">2K+</div>
            <div class="stat-label">Active Users</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50K+</div>
            <div class="stat-label">Reports Analyzed</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">98%</div>
            <div class="stat-label">Accuracy Rate</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Health Monitoring</div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>Ready to Take Control of<br/>Your <span class="gradient-text">Health?</span></h2>
          <p>Join thousands of users who trust HealthVault for smarter, AI-powered health monitoring.</p>
          <button class="btn-glow hero-cta" id="ctaSignup">
            <i class="fa-solid fa-rocket"></i> Get Started Free
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="footer-inner">
          <div class="footer-brand">
            <i class="fa-solid fa-heart-pulse"></i>
            <span>HealthVault</span>
          </div>
          <p>© 2026 HealthVault. All rights reserved.</p>
          <div class="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  `;

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Navigation buttons
  document.getElementById('landingLogin')?.addEventListener('click', () => navigate('/login'));
  document.getElementById('landingSignup')?.addEventListener('click', () => navigate('/signup'));
  document.getElementById('heroCta')?.addEventListener('click', () => navigate('/signup'));
  document.getElementById('ctaSignup')?.addEventListener('click', () => navigate('/signup'));

  // Init particles
  initLandingParticles();

  // Scroll-based fade-in animations
  initScrollAnimations();
}

function initLandingParticles() {
  const canvas = document.getElementById('landingParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight * 1.2;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 20000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.3 + 0.05,
        color: Math.random() > 0.6 ? '0, 255, 200' : '0, 168, 255',
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 168, 255, ${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }

  resize(); createParticles(); draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .step-card, .stat-item, .section-header').forEach(el => {
    el.classList.add('scroll-fade');
    observer.observe(el);
  });
}
