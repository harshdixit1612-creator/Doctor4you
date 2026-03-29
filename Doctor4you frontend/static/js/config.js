// ===== API Base URL =====
// LOCAL DEV:  http://127.0.0.1:8000
// PRODUCTION: https://your-app.onrender.com  ← update this after Render deploy
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000'
  : 'https://doctor4you-backend.onrender.com';  // ← REPLACE with your real Render URL

export default BASE_URL;
