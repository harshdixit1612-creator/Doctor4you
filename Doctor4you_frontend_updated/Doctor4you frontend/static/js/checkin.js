// ===== Health Check-In Modal (Post-Login Popup) =====
import { storage, showToast, generateId, formatFileSize } from './utils.js';
import { navigate } from './router.js';

export function showHealthCheckInModal() {
  // Don't show if already completed today
  const lastCheckin = storage.get('healthvault_last_checkin');
  const today = new Date().toISOString().split('T')[0];
  if (lastCheckin === today) {
    navigate('/dashboard');
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'healthCheckInOverlay';
  overlay.innerHTML = `
    <div class="checkin-modal">
      <!-- Header -->
      <div class="checkin-header">
        <div class="checkin-header-icon">
          <i class="fa-solid fa-heart-pulse"></i>
        </div>
        <h2>Welcome! Let's Check Your Health</h2>
        <p>Quick health check-in to keep your dashboard up to date</p>
      </div>

      <!-- Option Tabs -->
      <div class="checkin-tabs">
        <button class="checkin-tab active" data-tab="upload">
          <i class="fa-solid fa-cloud-arrow-up"></i>
          Upload Report
        </button>
        <button class="checkin-tab" data-tab="questions">
          <i class="fa-solid fa-clipboard-question"></i>
          Quick Questions
        </button>
      </div>

      <!-- Tab Content: Upload Report -->
      <div class="checkin-content active" id="checkinUpload">
        <div class="file-upload" id="checkinDropZone">
          <i class="fa-solid fa-cloud-arrow-up file-upload-icon"></i>
          <p class="file-upload-text"><strong>Click to upload</strong> or drag and drop</p>
          <p class="file-upload-hint">Upload your latest health report (PDF, JPG, PNG)</p>
          <input type="file" id="checkinFileInput" accept=".pdf,.jpg,.jpeg,.png" style="display:none" />
        </div>
        <div id="checkinFilePreview" class="hidden"></div>
      </div>

      <!-- Tab Content: Quick Questions -->
      <div class="checkin-content" id="checkinQuestions">
        <form class="checkin-form" id="checkinForm">
          <div class="checkin-question">
            <label class="checkin-question-label">
              <i class="fa-solid fa-face-smile"></i> How are you feeling today?
            </label>
            <div class="mood-selector">
              <button type="button" class="mood-btn" data-mood="great" title="Great">
                <i class="fa-solid fa-face-laugh-beam"></i>
                <span>Great</span>
              </button>
              <button type="button" class="mood-btn" data-mood="good" title="Good">
                <i class="fa-solid fa-face-smile"></i>
                <span>Good</span>
              </button>
              <button type="button" class="mood-btn" data-mood="okay" title="Okay">
                <i class="fa-solid fa-face-meh"></i>
                <span>Okay</span>
              </button>
              <button type="button" class="mood-btn" data-mood="bad" title="Not Good">
                <i class="fa-solid fa-face-frown"></i>
                <span>Not Good</span>
              </button>
              <button type="button" class="mood-btn" data-mood="terrible" title="Terrible">
                <i class="fa-solid fa-face-dizzy"></i>
                <span>Terrible</span>
              </button>
            </div>
          </div>

          <div class="checkin-question">
            <label class="checkin-question-label">
              <i class="fa-solid fa-moon"></i> How was your sleep last night?
            </label>
            <div class="sleep-options">
              <label class="radio-card">
                <input type="radio" name="sleep" value="excellent" />
                <div class="radio-card-content">
                  <i class="fa-solid fa-star"></i>
                  <span>Excellent<br/><small>7-9 hours</small></span>
                </div>
              </label>
              <label class="radio-card">
                <input type="radio" name="sleep" value="good" />
                <div class="radio-card-content">
                  <i class="fa-solid fa-bed"></i>
                  <span>Good<br/><small>5-7 hours</small></span>
                </div>
              </label>
              <label class="radio-card">
                <input type="radio" name="sleep" value="poor" />
                <div class="radio-card-content">
                  <i class="fa-solid fa-cloud-moon"></i>
                  <span>Poor<br/><small>3-5 hours</small></span>
                </div>
              </label>
              <label class="radio-card">
                <input type="radio" name="sleep" value="insomnia" />
                <div class="radio-card-content">
                  <i class="fa-solid fa-eye"></i>
                  <span>Very Poor<br/><small>&lt;3 hours</small></span>
                </div>
              </label>
            </div>
          </div>

          <div class="checkin-question">
            <label class="checkin-question-label">
              <i class="fa-solid fa-notes-medical"></i> Any symptoms today? <small style="color:var(--text-muted);font-weight:400;">(select all that apply)</small>
            </label>
            <div class="symptom-checkboxes">
              <label class="chip-checkbox">
                <input type="checkbox" name="symptoms" value="headache" />
                <span class="chip">🤕 Headache</span>
              </label>
              <label class="chip-checkbox">
                <input type="checkbox" name="symptoms" value="fatigue" />
                <span class="chip">😴 Fatigue</span>
              </label>
              <label class="chip-checkbox">
                <input type="checkbox" name="symptoms" value="fever" />
                <span class="chip">🤒 Fever</span>
              </label>
              <label class="chip-checkbox">
                <input type="checkbox" name="symptoms" value="cough" />
                <span class="chip">😷 Cough</span>
              </label>
              <label class="chip-checkbox">
                <input type="checkbox" name="symptoms" value="nausea" />
                <span class="chip">🤢 Nausea</span>
              </label>
              <label class="chip-checkbox">
                <input type="checkbox" name="symptoms" value="body-pain" />
                <span class="chip">💪 Body Pain</span>
              </label>
              <label class="chip-checkbox">
                <input type="checkbox" name="symptoms" value="dizziness" />
                <span class="chip">😵 Dizziness</span>
              </label>
              <label class="chip-checkbox">
                <input type="checkbox" name="symptoms" value="none" />
                <span class="chip">✅ None</span>
              </label>
            </div>
          </div>

          <div class="checkin-question">
            <label class="checkin-question-label">
              <i class="fa-solid fa-pills"></i> Did you take your medicines today?
            </label>
            <div class="sleep-options">
              <label class="radio-card small">
                <input type="radio" name="medicines" value="yes" />
                <div class="radio-card-content">
                  <i class="fa-solid fa-check-circle" style="color:var(--success);"></i>
                  <span>Yes</span>
                </div>
              </label>
              <label class="radio-card small">
                <input type="radio" name="medicines" value="no" />
                <div class="radio-card-content">
                  <i class="fa-solid fa-xmark-circle" style="color:var(--danger);"></i>
                  <span>No</span>
                </div>
              </label>
              <label class="radio-card small">
                <input type="radio" name="medicines" value="partial" />
                <div class="radio-card-content">
                  <i class="fa-solid fa-circle-half-stroke" style="color:var(--warning);"></i>
                  <span>Some</span>
                </div>
              </label>
              <label class="radio-card small">
                <input type="radio" name="medicines" value="na" />
                <div class="radio-card-content">
                  <i class="fa-solid fa-minus-circle" style="color:var(--text-muted);"></i>
                  <span>N/A</span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="checkin-footer">
        <button class="btn btn-ghost" id="checkinSkip">Skip for now</button>
        <button class="btn btn-primary" id="checkinSubmit">
          <i class="fa-solid fa-check"></i> Continue to Dashboard
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  initCheckinEvents(overlay);
}

function initCheckinEvents(overlay) {
  let uploadedFile = null;
  let selectedMood = null;

  // Tab switching
  overlay.querySelectorAll('.checkin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      overlay.querySelectorAll('.checkin-tab').forEach(t => t.classList.remove('active'));
      overlay.querySelectorAll('.checkin-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab === 'upload' ? 'checkinUpload' : 'checkinQuestions';
      document.getElementById(target).classList.add('active');
    });
  });

  // File upload
  const dropZone = document.getElementById('checkinDropZone');
  const fileInput = document.getElementById('checkinFileInput');

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length) handleCheckinFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleCheckinFile(fileInput.files[0]);
  });

  function handleCheckinFile(file) {
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      showToast('Please upload a PDF or image file', 'error');
      return;
    }
    uploadedFile = { name: file.name, size: file.size, type: file.type, uploadDate: new Date().toISOString() };

    const preview = document.getElementById('checkinFilePreview');
    preview.classList.remove('hidden');
    preview.innerHTML = `
      <div class="file-preview">
        <i class="fa-solid ${file.type === 'application/pdf' ? 'fa-file-pdf' : 'fa-file-image'}"></i>
        <div class="file-preview-info">
          <div class="file-preview-name">${file.name}</div>
          <div class="file-preview-size">${formatFileSize(file.size)}</div>
        </div>
        <i class="fa-solid fa-xmark remove-file" id="checkinRemoveFile"></i>
      </div>
    `;
    document.getElementById('checkinRemoveFile').addEventListener('click', () => {
      uploadedFile = null;
      preview.classList.add('hidden');
      fileInput.value = '';
    });
    showToast('Report uploaded!', 'success');
  }

  // Mood selector
  overlay.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedMood = btn.dataset.mood;
    });
  });

  // Skip
  document.getElementById('checkinSkip').addEventListener('click', () => {
    closeCheckin(overlay);
  });

  // Submit
  document.getElementById('checkinSubmit').addEventListener('click', () => {
    // Save uploaded report
    if (uploadedFile) {
      const reports = storage.get('healthvault_reports') || [];
      reports.push({ ...uploadedFile, id: generateId() });
      storage.set('healthvault_reports', reports);
    }

    // Save quick check-in data
    const checkinData = {
      date: new Date().toISOString(),
      mood: selectedMood,
      sleep: overlay.querySelector('input[name="sleep"]:checked')?.value || null,
      symptoms: Array.from(overlay.querySelectorAll('input[name="symptoms"]:checked')).map(cb => cb.value),
      medicines: overlay.querySelector('input[name="medicines"]:checked')?.value || null
    };

    const checkins = storage.get('healthvault_checkins') || [];
    checkins.push(checkinData);
    storage.set('healthvault_checkins', checkins);
    storage.set('healthvault_last_checkin', new Date().toISOString().split('T')[0]);

    showToast('Health check-in saved! 🎉', 'success');
    closeCheckin(overlay);
  });
}

function closeCheckin(overlay) {
  overlay.style.animation = 'fadeOut 0.25s ease forwards';
  overlay.querySelector('.checkin-modal').style.animation = 'scaleOut 0.25s ease forwards';
  setTimeout(() => {
    overlay.remove();
    navigate('/dashboard');
  }, 250);
}
