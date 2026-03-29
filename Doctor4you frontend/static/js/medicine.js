// ===== Medicine Reminder Page =====
import { storage, showToast, formatTime, generateId } from './utils.js';
import { renderLayout } from './sidebar.js';

export function renderMedicine() {
  const medicines = storage.get('healthvault_medicines') || [];

  const pageContent = `
    <div class="page-header">
      <h2><i class="fa-solid fa-pills" style="color:var(--primary);margin-right:10px;"></i>Medicine Reminders</h2>
    </div>

    <div class="medicine-layout">
      <!-- Add Medicine Form -->
      <div class="medicine-form-card fade-in">
        <h3><i class="fa-solid fa-plus-circle"></i> Add Medicine</h3>
        <form class="medicine-form" id="medicineForm">
          <div class="form-group">
            <label class="form-label">Medicine Name</label>
            <input type="text" class="form-input" id="medName" placeholder="e.g., Metformin" required />
          </div>
          <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-base);">
            <div class="form-group">
              <label class="form-label">Time</label>
              <input type="time" class="form-input" id="medTime" required />
            </div>
            <div class="form-group">
              <label class="form-label">Dosage</label>
              <input type="text" class="form-input" id="medDosage" placeholder="e.g., 500mg" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Frequency</label>
            <select class="form-select" id="medFrequency">
              <option value="daily">Daily</option>
              <option value="twice">Twice a Day</option>
              <option value="thrice">Three Times a Day</option>
              <option value="weekly">Weekly</option>
              <option value="as-needed">As Needed</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Notes (optional)</label>
            <input type="text" class="form-input" id="medNotes" placeholder="e.g., Take after meal" />
          </div>
          <button type="submit" class="btn btn-primary w-full">
            <i class="fa-solid fa-plus"></i> Add Medicine
          </button>
        </form>
      </div>

      <!-- Medicine List -->
      <div class="medicine-list-card fade-in">
        <h3><i class="fa-solid fa-list-check" style="color:var(--accent);"></i> Your Medicines (${medicines.length})</h3>
        ${medicines.length === 0 ? `
          <div class="empty-state">
            <i class="fa-solid fa-capsules"></i>
            <h3>No medicines added</h3>
            <p>Add your medicines to receive timely reminders.</p>
          </div>
        ` : `
          <div class="medicine-list">
            ${medicines.map(med => `
              <div class="medicine-item" data-id="${med.id}">
                <div class="medicine-item-icon">
                  <i class="fa-solid fa-capsules"></i>
                </div>
                <div class="medicine-item-info">
                  <h4>${med.name}</h4>
                  <p>${med.dosage} • ${med.frequency}${med.notes ? ' • ' + med.notes : ''}</p>
                </div>
                <div class="medicine-item-time">
                  <i class="fa-regular fa-clock"></i>
                  ${formatTime(med.time)}
                </div>
                <div class="medicine-item-actions">
                  <button class="delete" title="Delete" data-delete="${med.id}">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;

  renderLayout(pageContent);

  // Event handlers
  setTimeout(() => {
    // Add medicine
    const form = document.getElementById('medicineForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('medName').value.trim();
        const time = document.getElementById('medTime').value;
        const dosage = document.getElementById('medDosage').value.trim();
        const frequency = document.getElementById('medFrequency').value;
        const notes = document.getElementById('medNotes').value.trim();

        if (!name || !time || !dosage) {
          showToast('Please fill all required fields', 'error');
          return;
        }

        const med = { id: generateId(), name, time, dosage, frequency, notes, createdAt: new Date().toISOString() };
        const meds = storage.get('healthvault_medicines') || [];
        meds.push(med);
        storage.set('healthvault_medicines', meds);

        showToast(`${name} added to your medicines!`, 'success');
        renderMedicine();
      });
    }

    // Delete medicine
    document.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.delete;
        let meds = storage.get('healthvault_medicines') || [];
        meds = meds.filter(m => m.id !== id);
        storage.set('healthvault_medicines', meds);
        showToast('Medicine removed', 'warning');
        renderMedicine();
      });
    });
  }, 50);
}
