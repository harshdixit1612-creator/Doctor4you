// ===== Daily Health Update Page — Connected to Doctor AI API =====
import { storage, showToast, formatDate, generateId, generateSampleHealthData } from './utils.js';
import { renderLayout } from './sidebar.js';
import { analyzeSymptoms } from './api.js';

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
            <label class="form-label">Symptoms / How are you feeling today?</label>
            <textarea class="form-input" id="healthSymptoms" rows="3"
              placeholder="e.g., I have fever, headache and body pain since 2 days..."
              style="resize:vertical;"></textarea>
          </div>
          <button type="submit" class="btn btn-primary w-full" id="analyzeBtn">
            <i class="fa-solid fa-brain"></i> Analyze with AI & Log
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
                  <th>AI Score</th>
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
                    <td>
                      ${log.ai_score != null
                        ? `<span class="badge ${log.ai_score >= 70 ? 'badge-success' : log.ai_score >= 40 ? 'badge-warning' : 'badge-danger'}">${log.ai_score}</span>`
                        : '<span style="color:var(--text-muted)">—</span>'
                      }
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>

    <!-- AI Analysis Result (hidden until analyzed) -->
    <div id="aiResultSection" style="display:none; margin-top:24px;">
      <div class="card fade-in">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          <div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#0EA573,#0ea5e9);display:flex;align-items:center;justify-content:center;font-size:18px;">🤖</div>
          <div>
            <div style="font-weight:700;font-size:1rem;">Doctor AI Analysis</div>
            <div style="font-size:0.8rem;color:var(--text-muted);">Based on your symptoms</div>
          </div>
        </div>
        <div id="aiResultContent"></div>
      </div>
    </div>
  `;

  renderLayout(pageContent);

  setTimeout(() => {
    const form = document.getElementById('dailyHealthForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const weight   = document.getElementById('healthWeight').value;
      const sugar    = document.getElementById('healthSugar').value;
      const bpSys    = document.getElementById('healthBpSys').value;
      const bpDia    = document.getElementById('healthBpDia').value;
      const symptoms = document.getElementById('healthSymptoms').value.trim();

      if (!weight && !sugar && !bpSys && !symptoms) {
        showToast('Please fill in at least one field', 'error');
        return;
      }

      const btn = document.getElementById('analyzeBtn');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing with AI...';

      let aiResult = null;

      // Call Doctor AI API if symptoms provided
      if (symptoms) {
        try {
          const logs   = storage.get('healthvault_daily_logs') || [];
          const day    = logs.length + 1;
          aiResult     = await analyzeSymptoms(symptoms, day);

          // Save AI result to storage for disease page
          storage.set('healthvault_last_ai_result', aiResult);

          // Show AI result section
          showAIResult(aiResult);
          showToast('AI analysis complete! 🤖', 'success');
        } catch (err) {
          console.error('AI API error:', err);
          showToast('AI analysis failed — logged without AI data', 'warning');
        }
      }

      // Save the log
      const log = {
        id:           generateId(),
        date:         new Date().toISOString(),
        weight:       weight    ? parseFloat(weight)  : null,
        sugar:        sugar     ? parseInt(sugar)      : null,
        bp_systolic:  bpSys     ? parseInt(bpSys)      : null,
        bp_diastolic: bpDia     ? parseInt(bpDia)      : null,
        symptoms,
        ai_score:     aiResult?.progress?.score ?? null,
        ai_condition: aiResult?.diagnosis?.condition ?? null,
      };

      const logs = storage.get('healthvault_daily_logs') || [];
      logs.push(log);
      storage.set('healthvault_daily_logs', logs);

      // Update dashboard chart data
      const healthData = storage.get('healthvault_health_data') || generateSampleHealthData();
      healthData.push({
        date:         new Date().toISOString().split('T')[0],
        healthScore:  aiResult?.progress?.score ?? Math.floor(70 + Math.random() * 25),
        bp_systolic:  log.bp_systolic  || 120,
        bp_diastolic: log.bp_diastolic || 80,
        sugar:        log.sugar        || 100,
        weight:       log.weight       || 70,
      });
      storage.set('healthvault_health_data', healthData);

      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-brain"></i> Analyze with AI & Log';

      if (!symptoms) {
        showToast('Health data logged!', 'success');
        renderDailyHealth();
      }
    });
  }, 50);
}

function showAIResult(result) {
  const section = document.getElementById('aiResultSection');
  const content = document.getElementById('aiResultContent');
  if (!section || !content) return;

  const d = result.diagnosis  || {};
  const p = result.progress   || {};
  const q = result.questions  || [];
  const r = result.routine    || [];

  const trendColor = p.trend === 'improving' ? 'var(--success)' : p.trend === 'worsening' ? 'var(--danger)' : 'var(--warning)';

  content.innerHTML = `
    <!-- Condition -->
    <div style="margin-bottom:20px;">
      <div style="font-size:0.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--primary);margin-bottom:6px;">DIAGNOSIS</div>
      <div style="font-weight:700;font-size:1rem;margin-bottom:10px;">${d.condition || 'General illness'}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${(d.matched_profiles || []).map(p => `<span class="badge badge-primary">${p.replace(/_/g,' ')}</span>`).join('')}
      </div>
    </div>

    <!-- Progress Score -->
    <div style="display:flex;align-items:center;gap:20px;background:var(--bg-secondary);border-radius:12px;padding:14px 16px;margin-bottom:20px;">
      <div style="text-align:center;">
        <div style="font-size:2rem;font-weight:800;color:${trendColor};font-family:'Nunito',sans-serif;">${p.score ?? 50}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);">Health Score</div>
      </div>
      <div style="flex:1;">
        <div style="height:8px;background:var(--border-color);border-radius:50px;overflow:hidden;margin-bottom:6px;">
          <div style="height:100%;width:${p.score ?? 50}%;background:linear-gradient(90deg,#0EA573,#0ea5e9);border-radius:50px;transition:width 1s;"></div>
        </div>
        <div style="font-size:0.82rem;color:${trendColor};font-weight:600;">📈 ${p.trend ?? 'same'}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px;">${p.summary ?? ''}</div>
      </div>
    </div>

    <!-- Medicines -->
    ${d.medicines?.length ? `
    <div style="margin-bottom:20px;">
      <div style="font-size:0.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--primary);margin-bottom:10px;">💊 MEDICINES</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${d.medicines.slice(0,4).map(m => `
          <div style="background:var(--bg-secondary);border-radius:10px;padding:12px 14px;">
            <div style="font-weight:600;font-size:0.9rem;">${m.name}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);margin:3px 0;">${m.reason}</div>
            <div style="font-size:0.73rem;background:rgba(14,165,115,0.1);color:var(--primary);border-radius:6px;padding:2px 8px;display:inline-block;">${m.dose}</div>
          </div>
        `).join('')}
      </div>
    </div>` : ''}

    <!-- Diet & Avoid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
      <div>
        <div style="font-size:0.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#0EA573;margin-bottom:8px;">✅ EAT</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;">
          ${(d.diet||[]).map(i=>`<span style="background:rgba(14,165,115,0.1);color:#0EA573;border-radius:8px;padding:4px 9px;font-size:0.75rem;">${i}</span>`).join('')}
        </div>
      </div>
      <div>
        <div style="font-size:0.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--danger);margin-bottom:8px;">❌ AVOID</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;">
          ${(d.avoid||[]).map(i=>`<span style="background:rgba(239,68,68,0.1);color:var(--danger);border-radius:8px;padding:4px 9px;font-size:0.75rem;">${i}</span>`).join('')}
        </div>
      </div>
    </div>

    <!-- Questions -->
    ${q.length ? `
    <div style="margin-bottom:20px;">
      <div style="font-size:0.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--primary);margin-bottom:10px;">🩺 DOCTOR QUESTIONS</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${q.map(q=>`<div style="background:var(--bg-secondary);border-radius:8px;padding:10px 12px;font-size:0.85rem;">${q}</div>`).join('')}
      </div>
    </div>` : ''}

    <!-- Routine (first 5 slots) -->
    ${r.length ? `
    <div>
      <div style="font-size:0.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--primary);margin-bottom:10px;">📅 TODAY'S ROUTINE</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${r.slice(0,5).map(item=>`
          <div style="display:flex;gap:12px;align-items:flex-start;background:var(--bg-secondary);border-radius:8px;padding:10px 12px;">
            <span style="font-size:0.75rem;font-weight:700;color:var(--primary);white-space:nowrap;padding-top:1px;">${item.time}</span>
            <div>
              <div style="font-size:0.85rem;font-weight:500;">${item.activity}</div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${item.note}</div>
            </div>
          </div>
        `).join('')}
        ${r.length > 5 ? `<div style="text-align:center;font-size:0.8rem;color:var(--text-muted);padding:6px;">+ ${r.length - 5} more — see Disease page for full routine</div>` : ''}
      </div>
    </div>` : ''}

    <!-- Warning -->
    ${d.warning ? `
    <div style="margin-top:16px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:10px;padding:12px 14px;font-size:0.82rem;color:var(--danger);line-height:1.6;">
      ⚠️ ${d.warning.replace(/\n\s+!/g, '<br/>⚠️')}
    </div>` : ''}
  `;

  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
