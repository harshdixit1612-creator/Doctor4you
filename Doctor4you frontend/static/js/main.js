// ===== Main App Entry Point ===== 

import { registerRoute, initRouter, navigate } from './router.js';
import { isAuthenticated } from './utils.js';

import { renderLanding } from './landing.js';
import { renderLogin, renderSignup } from './auth.js';
import { renderDashboard } from './dashboard.js';
import { renderDisease } from './disease.js';
import { renderDailyHealth } from './daily-health.js';
import { renderMedicine } from './medicine.js';
import { renderReports } from './reports.js';
import { renderProfile } from './profile.js';
import { renderReportAnalyzer } from './report-analyzer.js';


// Auth guard wrapper
function authGuard(renderFn) {
  return () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    renderFn();
  };
}



// ===== ROUTES =====

// Default route
registerRoute('/', () => {
  if (isAuthenticated()) {
    navigate('/dashboard');
    return;
  }
  renderLanding();
});

// Auth routes
registerRoute('/login', () => {
  if (isAuthenticated()) {
    navigate('/dashboard');
    return;
  }
  renderLogin();
});

registerRoute('/signup', () => {
  if (isAuthenticated()) {
    navigate('/dashboard');
    return;
  }
  renderSignup();
});

// Protected routes
registerRoute('/dashboard', authGuard(renderDashboard));
registerRoute('/disease', authGuard(renderDisease));
registerRoute('/daily-health', authGuard(renderDailyHealth));
registerRoute('/medicine', authGuard(renderMedicine));
registerRoute('/reports', authGuard(renderReports));
registerRoute('/report-analyzer', authGuard(renderReportAnalyzer));
registerRoute('/profile', authGuard(renderProfile));


// ===== INITIAL LOAD FIX =====

// If no hash/path → force default route
if (!window.location.hash) {
  window.location.hash = '#/';
}

// Initialize router AFTER setting default route
initRouter();