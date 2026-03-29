// ===== Sidebar & Navigation =====
import { getCurrentUser, getInitials, storage } from './utils.js';
import { navigate, getCurrentRoute } from './router.js';

let sidebarCollapsed = false;

export function renderLayout(pageContent) {
  const app = document.getElementById('app');
  const user = getCurrentUser();
  const initials = getInitials(user?.name);
  const currentPath = getCurrentRoute();

  const navItems = [
    { path: '/dashboard', icon: 'fa-house', label: 'Dashboard' },
    { path: '/disease', icon: 'fa-stethoscope', label: 'Your Diseases' },
    { path: '/daily-health', icon: 'fa-calendar-check', label: 'Daily Health' },
    { path: '/medicine', icon: 'fa-pills', label: 'Medicine Reminder' },
    { path: '/report-analyzer', icon: 'fa-file-waveform', label: 'Report Analyzer' },
    { path: '/reports', icon: 'fa-file-medical', label: 'Reports History' },
  ];

  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/disease': 'Your Diseases',
    '/daily-health': 'Daily Health Update',
    '/medicine': 'Medicine Reminders',
    '/report-analyzer': 'OCR Report Analysis',
    '/reports': 'Reports History',
    '/profile': 'My Profile'
  };

  app.innerHTML = `
    <div class="app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}">
      <aside class="sidebar ${sidebarCollapsed ? 'collapsed' : ''}" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <i class="fa-solid fa-heart-pulse"></i>
            <span>Doctor4you</span>
          </div>
        </div>

        <div class="sidebar-profile">
          <div class="profile-card dropdown" id="profileDropdownTrigger">
            <div class="avatar">${initials}</div>
            <div class="profile-info">
              <div class="profile-name">${user?.name || 'User'}</div>
              <div class="profile-role">${user?.email || ''}</div>
            </div>
            <div class="dropdown-menu" id="profileDropdown">
              <button class="dropdown-item" data-action="profile">
                <i class="fa-solid fa-user"></i> View Profile
              </button>
              <button class="dropdown-item" data-action="edit">
                <i class="fa-solid fa-pen-to-square"></i> Edit Details
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item danger" data-action="logout">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
              </button>
            </div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section">
            <div class="nav-section-title">Menu</div>
            ${navItems.map(item => `
              <button class="nav-item ${currentPath === item.path ? 'active' : ''}" data-path="${item.path}">
                <i class="fa-solid ${item.icon}"></i>
                <span>${item.label}</span>
              </button>
            `).join('')}
          </div>
        </nav>

        <div class="sidebar-footer">
          <button class="sidebar-toggle" id="sidebarToggle">
            <i class="fa-solid fa-angles-left"></i>
            <span>Collapse</span>
          </button>
        </div>
      </aside>

      <div class="sidebar-overlay" id="sidebarOverlay"></div>

      <div class="main-wrapper">
        <header class="topbar">
          <div class="topbar-left">
            <button class="topbar-hamburger" id="mobileMenuToggle" title="Menu">
              <i class="fa-solid fa-bars"></i>
            </button>
            <h1 class="topbar-title">${pageTitles[currentPath] || 'Dashboard'}</h1>
            <div class="topbar-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div class="topbar-right">
            <button class="topbar-icon-btn" title="Notifications">
              <i class="fa-solid fa-bell"></i>
              <span class="notification-dot"></span>
            </button>
            <button class="topbar-icon-btn" title="Settings">
              <i class="fa-solid fa-gear"></i>
            </button>
          </div>
        </header>

        <main class="page-content" id="pageContent">
          ${pageContent}
        </main>
      </div>
    </div>
  `;

  initSidebarEvents();
}

function initSidebarEvents() {
  // Nav item clicks
  document.querySelectorAll('.nav-item[data-path]').forEach(item => {
    item.addEventListener('click', () => {
      navigate(item.dataset.path);
    });
  });

  // Sidebar toggle
  const toggleBtn = document.getElementById('sidebarToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebarCollapsed = !sidebarCollapsed;
      const sidebar = document.getElementById('sidebar');
      const layout = sidebar.closest('.app-layout');
      sidebar.classList.toggle('collapsed', sidebarCollapsed);
      layout.classList.toggle('sidebar-collapsed', sidebarCollapsed);
    });
  }

  // Mobile hamburger toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('mobile-open');
      sidebarOverlay.classList.toggle('active');
    });
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.remove('mobile-open');
      sidebarOverlay.classList.remove('active');
    });
  }

  // Close sidebar on nav click (mobile)
  document.querySelectorAll('.nav-item[data-path]').forEach(item => {
    item.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
    });
  });

  // Profile dropdown
  const profileTrigger = document.getElementById('profileDropdownTrigger');
  const profileDropdown = document.getElementById('profileDropdown');

  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      profileDropdown.classList.remove('active');
    });

    profileDropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = item.dataset.action;
        profileDropdown.classList.remove('active');
        if (action === 'logout') {
          storage.remove('healthvault_user');
          navigate('/login');
        } else if (action === 'profile' || action === 'edit') {
          navigate('/profile');
        }
      });
    });
  }
}
