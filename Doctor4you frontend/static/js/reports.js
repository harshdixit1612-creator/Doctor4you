// ===== Reports History Page =====
import { storage, showToast, formatDate, formatFileSize, generateId } from './utils.js';
import { renderLayout } from './sidebar.js';

export function renderReports() {
  const reports = storage.get('healthvault_reports') || [];

  const pageContent = `
    <div class="page-header">
      <h2><i class="fa-solid fa-file-medical" style="color:var(--primary);margin-right:10px;"></i>Reports History</h2>
      <div class="page-header-actions">
        <button class="btn btn-primary" id="uploadNewReport">
          <i class="fa-solid fa-cloud-arrow-up"></i> Upload Report
        </button>
      </div>
    </div>

    <!-- Upload Area (hidden by default) -->
    <div id="uploadSection" class="hidden" style="margin-bottom:var(--space-xl);">
      <div class="card">
        <div class="file-upload" id="reportDropZone">
          <i class="fa-solid fa-cloud-arrow-up file-upload-icon"></i>
          <p class="file-upload-text"><strong>Click to upload</strong> or drag and drop your health report</p>
          <p class="file-upload-hint">PDF, JPG, PNG (max 10MB)</p>
          <input type="file" id="newReportFile" accept=".pdf,.jpg,.jpeg,.png" style="display:none" />
        </div>
      </div>
    </div>

    <!-- Reports List -->
    <div style="display:flex; flex-direction:column; gap:0;">
      ${reports.length === 0 ? `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; color:var(--text-muted); text-align:center;">
          <i class="fa-solid fa-folder-open" style="font-size:48px; margin-bottom:16px; opacity:0.4;"></i>
          <h3 style="color:var(--text); margin-bottom:8px;">No reports yet</h3>
          <p>Upload your health reports via the <strong>Report Analyzer</strong> to track them here.</p>
        </div>
      ` : reports.map(report => {
        const isPdf = report.type === 'application/pdf';
        const scoreColor = !report.score ? 'var(--primary)' : (report.score < 50 ? '#ff4757' : report.score < 80 ? '#ffa502' : '#2ed573');
        return `
          <div data-id="${report.id}" style="display:flex; align-items:center; gap:16px; background:var(--card-bg, #131c36); padding:18px 20px; border-radius:14px; border:1px solid rgba(255,255,255,0.08); margin-bottom:12px; box-shadow:0 2px 12px rgba(0,0,0,0.2);">
            <div style="width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:${isPdf ? 'rgba(255,71,87,0.15)' : 'rgba(0,168,255,0.15)'};">
              <i class="fa-solid ${isPdf ? 'fa-file-pdf' : 'fa-file-image'}" style="font-size:20px; color:${isPdf ? '#ff4757' : '#00a8ff'};"></i>
            </div>
            <div style="flex:1; min-width:0;">
              <div style="font-weight:600; font-size:14px; color:#e2e8f0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${report.name}</div>
              <div style="font-size:12px; color:#64748b; margin-top:3px;">${formatDate(report.uploadDate)} &bull; ${formatFileSize(report.size)}</div>
            </div>
            ${report.score !== undefined ? `
            <div style="padding:6px 14px; background:rgba(255,255,255,0.05); border-radius:20px; text-align:center; flex-shrink:0; border:1px solid rgba(255,255,255,0.08);">
              <div style="font-size:10px; color:#64748b; margin-bottom:2px;">Score</div>
              <div style="font-size:16px; font-weight:700; color:${scoreColor};">${report.score}</div>
            </div>` : ''}
            <div style="display:flex; gap:6px; flex-shrink:0;">
              <button title="Delete" data-delete-report="${report.id}" style="width:36px; height:36px; border-radius:8px; border:1px solid rgba(255,71,87,0.3); background:rgba(255,71,87,0.1); color:#ff4757; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;">
                <i class="fa-solid fa-trash-can" style="font-size:13px;"></i>
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  renderLayout(pageContent);

  setTimeout(() => {
    // Toggle upload section
    const uploadBtn = document.getElementById('uploadNewReport');
    const uploadSection = document.getElementById('uploadSection');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => {
        uploadSection.classList.toggle('hidden');
      });
    }

    // File upload handling
    const dropZone = document.getElementById('reportDropZone');
    const fileInput = document.getElementById('newReportFile');
    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => fileInput.click());
      dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) handleReportUpload(e.dataTransfer.files[0]);
      });
      fileInput.addEventListener('change', () => {
        if (fileInput.files.length) handleReportUpload(fileInput.files[0]);
      });
    }

    // Delete reports
    document.querySelectorAll('[data-delete-report]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.deleteReport;
        let reps = storage.get('healthvault_reports') || [];
        reps = reps.filter(r => r.id !== id);
        storage.set('healthvault_reports', reps);
        showToast('Report deleted', 'warning');
        renderReports();
      });
    });
  }, 50);
}

function handleReportUpload(file) {
  const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowed.includes(file.type)) {
    showToast('Please upload a PDF or image file', 'error');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showToast('File size must be under 10MB', 'error');
    return;
  }

  const report = {
    id: generateId(),
    name: file.name,
    size: file.size,
    type: file.type,
    uploadDate: new Date().toISOString()
  };

  const reports = storage.get('healthvault_reports') || [];
  reports.push(report);
  storage.set('healthvault_reports', reports);

  showToast('Report uploaded successfully!', 'success');
  renderReports();
}
