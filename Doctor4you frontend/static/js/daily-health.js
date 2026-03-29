// ===== Daily Health Update Page =====
import { storage, showToast, formatDate, generateId, generateSampleHealthData } from './utils.js';
import { renderLayout } from './sidebar.js';

export function renderDailyHealth() {
  const healthLogs = storage.get('healthvault_daily_logs') || [];
  const recentLogs = healthLogs.slice(-7).reverse();

  const pageContent = `
    <div class="page-header">
      <h2><i class="fa-solid fa-calendar-check" style="color:var(--primary);margin-right:10px;"></i>Daily Health Update</h2>
    </div>

    <div class="health-update-layout">
      <!-- Log Form -->
      <div class="health-form-card fade-in">
        <h3><i class="fa-solid fa-plus-circle"></i> Log Today's Data</h3>
        <form class="health-form" id="dailyHealthForm">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Weight (kg)</label>
              <input type="number" class="form-input" id="healthWeight" placeholder="e.g., 70" step="0.1" />
            </div>
            <div class="form-group">
              <label class="form-label">Sugar Level (mg/dL)</label>
              <input type="number" class="form-input" id="healthSugar" placeholder="e.g., 100" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">BP Systolic (mmHg)</label>
              <input type="number" class="form-input" id="healthBpSys" placeholder="e.g., 120" />
            </div>
            <div class="form-group">
              <label class="form-label">BP Diastolic (mmHg)</label>
              <input type="number" class="form-input" id="healthBpDia" placeholder="e.g., 80" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Symptoms / Notes</label>
            <textarea class="form-input" id="healthSymptoms" rows="3" placeholder="Describe any symptoms or how you're feeling today..." style="resize:vertical;"></textarea>
          </div>
          <button type="submit" class="btn btn-primary w-full">
            <i class="fa-solid fa-check"></i> Log Today's Data
          </button>
        </form>
      </div>

      <!-- History -->
      <div class="health-history-card fade-in">
        <h3><i class="fa-solid fa-clock-rotate-left"></i> Recent Logs</h3>
        ${recentLogs.length === 0 ? `
          <div class="empty-state">
            <i class="fa-solid fa-clipboard-list"></i>
            <h3>No logs yet</h3>
            <p>Start logging your daily health data to see your history here.</p>
          </div>
        ` : `
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>BP</th>
                  <th>Sugar</th>
                </tr>
              </thead>
              <tbody>
                ${recentLogs.map(log => `
                  <tr>
                    <td>${formatDate(log.date)}</td>
                    <td>${log.weight || '—'} kg</td>
                    <td>${log.bp_systolic || '—'}/${log.bp_diastolic || '—'}</td>
                    <td>
                      <span style="color:${log.sugar > 140 ? 'var(--danger)' : log.sugar > 100 ? 'var(--warning)' : 'var(--success)'}; font-weight:600;">
                        ${log.sugar || '—'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `;

  renderLayout(pageContent);

  // Form submission
  setTimeout(() => {
    const form = document.getElementById('dailyHealthForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const weight = document.getElementById('healthWeight').value;
        const sugar = document.getElementById('healthSugar').value;
        const bpSys = document.getElementById('healthBpSys').value;
        const bpDia = document.getElementById('healthBpDia').value;
        const symptoms = document.getElementById('healthSymptoms').value.trim();

        if (!weight && !sugar && !bpSys) {
          showToast('Please fill in at least one health metric', 'error');
          return;
        }

        const log = {
          id: generateId(),
          date: new Date().toISOString(),
          weight: weight ? parseFloat(weight) : null,
          sugar: sugar ? parseInt(sugar) : null,
          bp_systolic: bpSys ? parseInt(bpSys) : null,
          bp_diastolic: bpDia ? parseInt(bpDia) : null,
          symptoms
        };

        const logs = storage.get('healthvault_daily_logs') || [];
        logs.push(log);
        storage.set('healthvault_daily_logs', logs);

        // Also update health data for dashboard chart
        const healthData = storage.get('healthvault_health_data') || generateSampleHealthData();
        healthData.push({
          date: new Date().toISOString().split('T')[0],
          healthScore: Math.floor(70 + Math.random() * 25),
          bp_systolic: log.bp_systolic || 120,
          bp_diastolic: log.bp_diastolic || 80,
          sugar: log.sugar || 100,
          weight: log.weight || 70
        });
        storage.set('healthvault_health_data', healthData);

        showToast('Health data logged successfully!', 'success');
        renderDailyHealth(); // Re-render
      });
    }
  }, 50);
}
