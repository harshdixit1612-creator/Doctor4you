// ===== Reports History Page =====
import { storage, showToast, formatDate, formatFileSize, generateId } from './utils.js';
import { renderLayout } from './sidebar.js';

export function renderReports() {
  const reports = storage.get('healthvault_reports') || [];

  // Add sample reports if empty
  if (reports.length === 0) {
    const sampleReports = [
      { id: generateId(), name: 'Blood Work Analysis.pdf', size: 2457600, type: 'application/pdf', uploadDate: '2026-03-18T10:30:00Z' },
      { id: generateId(), name: 'Full Body Checkup.pdf', size: 4194304, type: 'application/pdf', uploadDate: '2026-03-10T14:20:00Z' },
      { id: generateId(), name: 'X-Ray Report.png', size: 1048576, type: 'image/png', uploadDate: '2026-02-25T09:15:00Z' },
    ];
    storage.set('healthvault_reports', sampleReports);
    reports.push(...sampleReports);
  }

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
    <div class="reports-grid stagger-children">
      ${reports.length === 0 ? `
        <div class="empty-state">
          <i class="fa-solid fa-folder-open"></i>
          <h3>No reports uploaded</h3>
          <p>Upload your health reports to track and access them anytime.</p>
        </div>
      ` : reports.map(report => {
        const isPdf = report.type === 'application/pdf';
        return `
          <div class="report-item" data-id="${report.id}">
            <div class="report-icon ${isPdf ? 'pdf' : 'image'}">
              <i class="fa-solid ${isPdf ? 'fa-file-pdf' : 'fa-file-image'}"></i>
            </div>
            <div class="report-info">
              <h4>${report.name}</h4>
              <p>${formatDate(report.uploadDate)} • ${formatFileSize(report.size)}</p>
            </div>
            <div class="report-actions">
              <button class="btn btn-ghost btn-sm" title="Download">
                <i class="fa-solid fa-download"></i>
              </button>
              <button class="btn btn-ghost btn-sm" title="Delete" data-delete-report="${report.id}">
                <i class="fa-solid fa-trash-can" style="color:var(--danger);"></i>
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
