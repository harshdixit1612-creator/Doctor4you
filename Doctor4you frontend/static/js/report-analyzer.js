// ===== Report Analyzer Page =====
import { renderLayout } from './sidebar.js';
import { analyzeReport } from './api.js';
import { storage, generateId } from './utils.js';

export function renderReportAnalyzer() {
  const pageContent = `
    <div class="page-header">
      <h2><i class="fa-solid fa-file-waveform" style="color:var(--primary);margin-right:10px;"></i>Upload Health Report</h2>
      <p style="color:var(--text-muted);margin-top:5px;">We support PDF, JPG, and PNG files.</p>
    </div>

    <!-- Upload Zone -->
    <div class="report-upload-zone" id="dropZone">
      <i class="fa-solid fa-cloud-arrow-up"></i>
      <h3>Drag & Drop your report here</h3>
      <p>or click to browse</p>
      <input type="file" id="fileInput" accept=".pdf,image/*" style="display:none;">
      <button class="btn btn-primary" onclick="document.getElementById('fileInput').click()" style="padding: 10px 24px; border-radius: 8px; background: var(--primary); color: #fff; border: none; cursor: pointer; font-weight: 600; font-family: inherit;">Browse Files</button>
    </div>
    
    <!-- Loading State -->
    <div id="loadingState" style="display:none; text-align:center; padding: 40px; background: var(--card-bg); border-radius: var(--radius-xl); border: 1px solid var(--border);">
        <i class="fa-solid fa-circle-notch fa-spin fa-3x" style="color:var(--primary); margin-bottom: 20px;"></i>
        <h3 style="color: var(--text);">Analyzing Document...</h3>
        <p style="color:var(--text-muted); margin-top: 10px;">Extracting text and identifying medical parameters. This might take a few seconds.</p>
    </div>

    <!-- Error State -->
    <div id="errorState" style="display:none; color: var(--danger); background: rgba(255, 71, 87, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 1px solid rgba(255, 71, 87, 0.3);">
        <i class="fa-solid fa-triangle-exclamation"></i> <span id="errorText"></span>
    </div>

    <!-- Results Section -->
    <div id="resultsSection" style="display:none;">
      <div class="ocr-results-grid">
        <!-- Left Column: Table & Recommendations -->
        <div class="results-main">
          <div class="medicine-form-card" style="margin-bottom: 20px;">
            <h3><i class="fa-solid fa-list-check"></i> Detected Parameters</h3>
            <div class="param-table-container">
              <table class="param-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                    <th>Normal Range</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="paramsBody">
                  <!-- Filled by JS -->
                </tbody>
              </table>
            </div>
            <p id="noParamsMsg" style="display:none; color: var(--text-muted); text-align: center; margin-top: 20px;">No numeric parameters automatically detected. Check the raw text below.</p>
          </div>
          
          <div class="medicine-form-card">
            <h3><i class="fa-solid fa-clipboard-list"></i> Summary & Recommendations</h3>
            <p id="summaryText" style="margin-bottom: 15px; font-weight: 500; color: var(--text);"></p>
            <ul id="recommendationsList" style="padding-left: 20px; color: var(--text-secondary); line-height: 1.6;">
            </ul>
          </div>
        </div>
        
        <!-- Right Column: Score & Charts -->
        <div class="results-side">
          <div class="health-history-card" style="margin-bottom: 20px; text-align: center;">
            <h3><i class="fa-solid fa-heart-pulse"></i> Overall Health Score</h3>
            <div class="score-circle-container">
                <div class="health-score-ring" id="scoreRing" style="--score: 0;">
                    <div class="health-score-value" id="scoreValue">0</div>
                </div>
                <p style="color: var(--text-muted); font-size: 12px; margin-top: 10px;">Based on detected parameters</p>
            </div>
          </div>
          
          <div class="health-history-card">
            <h3><i class="fa-solid fa-chart-bar"></i> Parameter Trend</h3>
            <div style="height: 250px;">
                <canvas id="paramChart" style="width:100%; height:100%;"></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Raw Text -->
      <div class="health-history-card" style="margin-top: 20px;">
        <h3><i class="fa-solid fa-align-left"></i> Extracted Raw Text</h3>
        <pre id="rawText" style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; font-size: 13px; color: var(--text-muted); white-space: pre-wrap; overflow-x: hidden; font-family: monospace; border: 1px solid var(--border-light);"></pre>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
          <button class="btn btn-outline" onclick="window.location.reload()" style="padding: 10px 24px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--text); cursor: pointer; transition: all 0.2s;">
              <i class="fa-solid fa-arrow-rotate-left" style="margin-right: 8px;"></i> Upload Another Report
          </button>
      </div>
    </div>
  `;

  renderLayout(pageContent);

  // Setup drag and drop
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

  if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
          handleFile(e.dataTransfer.files[0]);
        }
      });
  }

  if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
          handleFile(e.target.files[0]);
        }
      });
  }
}

let paramChartInstance = null;

async function handleFile(file) {
  // Hide previous states
  document.getElementById('dropZone').style.display = 'none';
  document.getElementById('resultsSection').style.display = 'none';
  document.getElementById('errorState').style.display = 'none';
  document.getElementById('loadingState').style.display = 'block';

  // Basic validation
  const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!validTypes.includes(file.type)) {
      document.getElementById('loadingState').style.display = 'none';
      showError("Please upload a valid PDF, JPG, or PNG file.");
      document.getElementById('dropZone').style.display = 'block';
      return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const data = await analyzeReport(formData);
    document.getElementById('loadingState').style.display = 'none';

    if (!data.success) {
      showError(data.error || "Failed to analyze document.");
      document.getElementById('dropZone').style.display = 'block';
      return;
    }

    // --- Persist Report ---
    const reportList = storage.get('healthvault_reports') || [];
    const newReport = {
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      score: data.score,
      parameters: data.parameters || []
    };
    reportList.push(newReport);
    storage.set('healthvault_reports', reportList);

    // --- Auto Generate New Tasks ---
    let diet = [];
    let avoid = [];
    let activity = "Maintain a regular 30-minute balanced exercise routine.";
    
    if (data.parameters) {
      data.parameters.forEach(p => {
        if (p.status === 'low') {
            if (p.name.toLowerCase().includes('platelet')) diet.push("papaya leaf, iron-rich foods");
            else diet.push(`foods to boost ${p.name}`);
        }
        if (p.status === 'high' || p.status === 'critical') {
            if (p.name.toLowerCase().includes('sugar') || p.name.toLowerCase().includes('cholesterol')) avoid.push("excess sugar, junk food, fried foods");
            else avoid.push(`foods that spike ${p.name}`);
        }
      });
    }
    
    // Fallbacks
    if (diet.length === 0) diet.push("balanced healthy meals full of vitamins");
    if (avoid.length === 0) avoid.push("junk food, heavily processed items");
    
    // Deduplicate lists
    diet = [...new Set(diet)];
    avoid = [...new Set(avoid)];
    
    const labDiagnosis = {
      condition: "Lab Report Summary",
      severity: data.score < 50 ? "high" : (data.score < 80 ? "medium" : "low"),
      description: data.summary || "Based on your latest health report analysis.",
      symptoms: data.parameters.filter(p => p.status !== 'normal').map(p => `${p.name} is ${p.status}`),
      diet: diet,
      avoid: avoid,
      activity: activity,
      medicines: [] 
    };
    storage.set('healthvault_last_diagnosis', labDiagnosis);
    
    // --- Sync Dashboard Chart With Real Data ---
    let localHealthData = storage.get('healthvault_health_data');
    if (localHealthData && localHealthData.length > 0) {
        localHealthData[localHealthData.length - 1].healthScore = data.score;
        storage.set('healthvault_health_data', localHealthData);
    }
    
    // Delete today's task cache to force overwrite
    const todayKey = 'healthvault_tasks_' + new Date().toISOString().slice(0, 10);
    storage.remove(todayKey);

    renderResults(data);

  } catch (err) {
    console.error(err);
    document.getElementById('loadingState').style.display = 'none';
    showError("Server error. Ensure backend is running and can process OCR.");
    document.getElementById('dropZone').style.display = 'block';
  }
}

function showError(msg) {
  const el = document.getElementById('errorState');
  document.getElementById('errorText').innerText = msg;
  el.style.display = 'block';
}

function renderResults(data) {
  document.getElementById('resultsSection').style.display = 'block';

  // 1. Table
  const tbody = document.getElementById('paramsBody');
  const noParamsMsg = document.getElementById('noParamsMsg');
  tbody.innerHTML = '';
  
  if (data.parameters && data.parameters.length > 0) {
      noParamsMsg.style.display = 'none';
      data.parameters.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${p.name}</strong></td>
          <td><span style="color:var(--text); font-weight:600;">${p.value}</span> <span style="font-size:12px;color:var(--text-muted)">${p.unit}</span></td>
          <td style="color:var(--text-muted); font-size:13px;">${p.normalRange}</td>
          <td><span class="param-status-badge ${p.status}">${p.status}</span></td>
        `;
        tbody.appendChild(tr);
      });
  } else {
      noParamsMsg.style.display = 'block';
  }

  // 2. Score
  const scoreRing = document.getElementById('scoreRing');
  const scoreValue = document.getElementById('scoreValue');
  
  // Animate score
  scoreRing.style.setProperty('--score', '0');
  setTimeout(() => {
     scoreRing.style.transition = 'background 1.5s ease-out';
     scoreRing.style.setProperty('--score', data.score);
  }, 100);
  scoreValue.innerText = data.score;

  // Change score color based on value
  if (data.score < 50) scoreRing.style.setProperty('--primary', 'var(--danger)');
  else if (data.score < 80) scoreRing.style.setProperty('--primary', 'var(--warning)');
  else scoreRing.style.setProperty('--primary', 'var(--success)');

  // 3. Summary & Recommendations
  document.getElementById('summaryText').innerText = data.summary;
  const recList = document.getElementById('recommendationsList');
  recList.innerHTML = '';
  if (data.recommendations && data.recommendations.length > 0) {
      data.recommendations.forEach(r => {
          const li = document.createElement('li');
          li.innerText = r;
          li.style.marginBottom = '8px';
          recList.appendChild(li);
      });
  } else {
      recList.innerHTML = '<li>Keep up the good work! Your parameters look normal.</li>';
  }

  // 4. Raw Text
  document.getElementById('rawText').innerText = data.raw_text || "No text extracted.";

  // 5. Chart
  if (data.parameters && data.parameters.length > 0) {
    renderChart(data.parameters);
  }
}

function renderChart(params) {
  const ctx = document.getElementById('paramChart')?.getContext('2d');
  if (!ctx) return;
  
  if (paramChartInstance) {
      paramChartInstance.destroy();
  }

  // Only chart parameters that have values
  const validParams = params.filter(p => !isNaN(p.value));
  
  const labels = validParams.map(p => p.name);
  // We normalize the values for a simple bar chart just to show them, 
  // though real medical charts are more complex.
  const values = validParams.map(p => p.value);
  const backgroundColors = validParams.map(p => {
      if (p.status === 'normal') return '#00ffc8';
      if (p.status === 'low') return '#00a8ff';
      if (p.status === 'high') return '#ffa502';
      return '#ff4757'; // critical
  });

  paramChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: 'Parameter Value',
              data: values,
              backgroundColor: backgroundColors,
              borderRadius: 6,
              barPercentage: 0.6
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: { display: false },
              tooltip: {
                  backgroundColor: 'rgba(10, 17, 40, 0.9)',
                  titleColor: '#fff',
                  bodyColor: '#fff',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderWidth: 1,
                  padding: 10,
                  displayColors: false,
                  callbacks: {
                      label: function(context) {
                          const p = validParams[context.dataIndex];
                          return `Value: ${p.value} ${p.unit} (Status: ${p.status})`;
                      }
                  }
              }
          },
          scales: {
              y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                  ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } }
              },
              x: {
                  grid: { display: false, drawBorder: false },
                  ticks: { 
                      color: 'rgba(255,255,255,0.5)', 
                      font: { size: 10 },
                      maxRotation: 45,
                      minRotation: 45
                  }
              }
          }
      }
  });
}
