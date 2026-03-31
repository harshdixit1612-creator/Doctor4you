// ===== Profile Page =====
import { getCurrentUser, getInitials, storage, showToast, validateEmail } from './utils.js';
import { renderLayout } from './sidebar.js';
import { navigate } from './router.js';

export function renderProfile() {
  const user = getCurrentUser();

  const pageContent = `
    <div class="profile-page-layout fade-in">
      <div class="profile-header-card">
        <div class="profile-avatar-large">${getInitials(user?.name)}</div>
        <h2>${user?.name || 'User'}</h2>
        <p>${user?.email || ''}</p>
        <div style="margin-top:var(--space-md);display:flex;justify-content:center;gap:var(--space-sm);">
          <span class="badge badge-primary">${user?.gender || 'N/A'}</span>
          <span class="badge badge-info">${user?.age ? user.age + ' years' : 'N/A'}</span>
        </div>
      </div>

      <div class="profile-details-card">
        <h3><i class="fa-solid fa-user-pen" style="color:var(--primary);margin-right:8px;"></i>Edit Profile</h3>
        <form class="profile-form" id="profileForm">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" id="profileName" value="${user?.name || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" id="profileEmail" value="${user?.email || ''}" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Age</label>
              <input type="number" class="form-input" id="profileAge" value="${user?.age || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Gender</label>
              <select class="form-select" id="profileGender">
                <option value="male" ${user?.gender === 'male' ? 'selected' : ''}>Male</option>
                <option value="female" ${user?.gender === 'female' ? 'selected' : ''}>Female</option>
                <option value="other" ${user?.gender === 'other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
          </div>
          <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-md);">
            <button type="submit" class="btn btn-primary">
              <i class="fa-solid fa-check"></i> Save Changes
            </button>
            <button type="button" class="btn btn-danger" id="logoutBtn">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  renderLayout(pageContent);

  setTimeout(() => {
    // Save profile
    const form = document.getElementById('profileForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('profileName').value.trim();
        const email = document.getElementById('profileEmail').value.trim();
        const age = parseInt(document.getElementById('profileAge').value);
        const gender = document.getElementById('profileGender').value;

        if (!name || !email) {
          showToast('Name and email are required', 'error');
          return;
        }
        if (!validateEmail(email)) {
          showToast('Please enter a valid email', 'error');
          return;
        }

        const updatedUser = { ...user, name, email, age, gender };
        storage.set('healthvault_user', updatedUser);

        // Also update in users list
        const users = storage.get('healthvault_users') || [];
        const idx = users.findIndex(u => u.id === user.id);
        if (idx >= 0) {
          users[idx] = updatedUser;
          storage.set('healthvault_users', users);
        }

        showToast('Profile updated successfully!', 'success');
        renderProfile();
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        storage.remove('healthvault_user');
        showToast('Logged out successfully', 'success');
        navigate('/login');
      });
    }
  }, 50);
}
