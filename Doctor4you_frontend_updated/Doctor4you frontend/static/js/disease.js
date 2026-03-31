// ===== Disease Info Page — Shows Doctor AI Results =====
import { storage } from './utils.js';
import { renderLayout } from './sidebar.js';

export function renderDisease() {
  const aiResult   = storage.get('healthvault_last_ai_result');
  const diagnosis  = aiResult?.diagnosis;
  const routine    = aiResult?.routine    || [];
  const questions  = aiResult?.questions  || [];
  const progress   = aiResult?.progress;
  const entities   = aiResult?.entities;

  let pageContent = '';

  if (!diagnosis) {
    // No AI data yet — show prompt to log symptoms
    pageContent = `
      <div class="page-header">
        <h2><i class="fa-solid fa-stethoscope" style="color:var(--primary);margin-right:10px;"></i>AI Diagnosis</h2>
      </div>
      <div style="background:var(--primary-light);border-radius:var(--radius-lg);padding:var(--space-lg) var(--space-xl);margin-bottom:var(--space-xl);display:flex;align-items:center;gap:var(--space-md);">
        <i class="fa-solid fa-circle-info" style="color:var(--primary);font-size:1.2rem;"></i>
        <p style="font-size:var(--font-sm);color:var(--text-secondary);">
          No AI analysis yet. Go to <strong>Daily Health</strong>, describe your symptoms and click <strong>"Analyze with AI"</strong> to see your diagnosis here.
        </p>
      </div>
      <div class="empty-state" style="margin-top:40px;">
        <i class="fa-solid fa-stethoscope"></i>
        <h3>No diagnosis available</h3>
        <p>Log your symptoms in the Daily Health page to get an AI-powered diagnosis.</p>
        <button class="btn btn-primary" onclick="location.hash='#/daily-health'" style="margin-top:16px;">
          <i class="fa-solid fa-calendar-check"></i> Log Symptoms Now
        </button>
      </div>
    `;
  } else {
    const trendColor = progress?.trend === 'improving'
      ? 'var(--success)' : progress?.trend === 'worsening'
      ? 'var(--danger)' : 'var(--warning)';

    pageContent = `
      <div class="page-header">
        <h2><i class="fa-solid fa-stethoscope" style="color:var(--primary);margin-right:10px;"></i>AI Diagnosis Report</h2>
        <div class="page-header-actions">
          <span class="badge badge-success">AI Powered</span>
        </div>
      </div>

      <!-- Disclaimer -->
      <div style="background:var(--primary-light);border-radius:var(--radius-lg);padding:var(--space-lg) var(--space-xl);margin-bottom:var(--space-xl);display:flex;align-items:center;gap:var(--space-md);">
        <i class="fa-solid fa-circle-info" style="color:var(--primary);font-size:1.2rem;"></i>
        <p style="font-size:var(--font-sm);color:var(--text-secondary);">
          This is an AI-generated analysis. Please consult a licensed healthcare provider for professional medical advice.
        </p>
      </div>

      <div class="disease-grid stagger-children">

        <!-- Condition Card -->
        <div class="disease-card severity-medium" style="grid-column:1/-1;">
          <div class="disease-card-header">
            <h3>${diagnosis.condition}</h3>
            <span class="badge badge-warning">AI Detected</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0;">
            ${(diagnosis.matched_profiles || []).map(p => `
              <span class="symptom-tag">${p.replace(/_/g,' ')}</span>
            `).join('')}
          </div>
          <p style="font-size:0.85rem;color:var(--text-secondary);">
            <strong>Activity:</strong> ${diagnosis.activity || '—'}
          </p>
        </div>

        <!-- Progress Score -->
        ${progress ? `
        <div class="disease-card severity-low">
          <div class="disease-card-header">
            <h3>Health Progress</h3>
            <span class="badge ${progress.trend === 'improving' ? 'badge-success' : progress.trend === 'worsening' ? 'badge-danger' : 'badge-warning'}">
              ${progress.trend}
            </span>
          </div>
          <div style="font-size:2.5rem;font-weight:800;color:${trendColor};margin:8px 0;">${progress.score}</div>
          <div style="height:8px;background:var(--border-color);border-radius:50px;overflow:hidden;margin-bottom:10px;">
            <div style="height:100%;width:${progress.score}%;background:linear-gradient(90deg,#0EA573,#0ea5e9);border-radius:50px;"></div>
          </div>
          <p style="font-size:0.82rem;color:var(--text-secondary);">${progress.summary}</p>
        </div>` : ''}

        <!-- Detected Entities -->
        ${entities ? `
        <div class="disease-card severity-low">
          <div class="disease-card-header">
            <h3>Detected Symptoms</h3>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
            ${(entities.symptoms || []).map(s => `<span class="symptom-tag">${s}</span>`).join('')}
            ${(entities.diseases || []).map(s => `<span class="symptom-tag" style="background:rgba(239,68,68,0.1);color:var(--danger);">${s}</span>`).join('')}
            ${(entities.body_parts || []).map(s => `<span class="symptom-tag" style="background:rgba(14,165,233,0.1);color:#0ea5e9;">${s}</span>`).join('')}
          </div>
        </div>` : ''}

        <!-- Medicines -->
        <div class="disease-card severity-medium" style="grid-column:1/-1;">
          <div class="disease-card-header">
            <h3>💊 Recommended Medicines</h3>
            <span class="badge badge-info">${(diagnosis.medicines || []).length} medicines</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">
            ${(diagnosis.medicines || []).map(m => `
              <div style="background:var(--bg-secondary);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:4px;">
                <div style="font-weight:700;font-size:0.95rem;">${m.name}</div>
                <div style="font-size:0.8rem;color:var(--text-secondary);">${m.reason}</div>
                <div style="font-size:0.75rem;background:rgba(14,165,115,0.1);color:var(--primary);border-radius:6px;padding:2px 8px;display:inline-block;margin-top:2px;">${m.dose}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Diet & Avoid -->
        <div class="disease-card severity-low">
          <div class="disease-card-header">
            <h3>✅ Recommended Diet</h3>
          </div>
          <div class="disease-symptoms">
            ${(diagnosis.diet || []).map(i => `<span class="symptom-tag" style="background:rgba(14,165,115,0.1);color:#0EA573;">${i}</span>`).join('')}
          </div>
        </div>

        <div class="disease-card severity-high">
          <div class="disease-card-header">
            <h3>❌ Foods to Avoid</h3>
          </div>
          <div class="disease-symptoms">
            ${(diagnosis.avoid || []).map(i => `<span class="symptom-tag" style="background:rgba(239,68,68,0.1);color:var(--danger);">${i}</span>`).join('')}
          </div>
        </div>

        <!-- Doctor Questions -->
        ${questions.length ? `
        <div class="disease-card severity-low" style="grid-column:1/-1;">
          <div class="disease-card-header">
            <h3>🩺 Follow-up Questions</h3>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;">
            ${questions.map(q => `
              <div style="background:var(--bg-secondary);border-radius:8px;padding:10px 14px;font-size:0.87rem;">${q}</div>
            `).join('')}
          </div>
        </div>` : ''}

        <!-- Full Daily Routine -->
        ${routine.length ? `
        <div class="disease-card severity-low" style="grid-column:1/-1;">
          <div class="disease-card-header">
            <h3>📅 Full Daily Routine</h3>
            <span class="badge badge-primary">${routine.length} activities</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;">
            ${routine.map(item => `
              <div style="display:flex;gap:14px;align-items:flex-start;background:var(--bg-secondary);border-radius:8px;padding:10px 14px;">
                <span style="font-size:0.75rem;font-weight:700;color:var(--primary);white-space:nowrap;padding-top:2px;min-width:60px;">${item.time}</span>
                <div>
                  <div style="font-size:0.88rem;font-weight:600;">${item.activity}</div>
                  <div style="font-size:0.77rem;color:var(--text-secondary);margin-top:2px;">${item.note}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        <!-- Warning -->
        ${diagnosis.warning ? `
        <div class="disease-card severity-high" style="grid-column:1/-1;">
          <div class="disease-card-header">
            <h3>⚠️ Medical Warning</h3>
          </div>
          <p style="font-size:0.85rem;line-height:1.7;color:var(--danger);">
            ${diagnosis.warning.replace(/\n\s+!/g, '<br/>⚠️ ')}
          </p>
        </div>` : ''}

      </div>
    `;
  }

  renderLayout(pageContent);
}
