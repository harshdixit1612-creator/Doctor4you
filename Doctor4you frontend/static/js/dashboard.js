// ===== Dashboard Page =====

import { getCurrentUser, generateSampleHealthData, getInitials, storage } from './utils.js';
import { renderLayout } from './sidebar.js';
import { renderTasksWidget, loadTodayTasks, saveTodayTasks } from './tasks.js';



export function renderDashboard() {
  const user = getCurrentUser();
  const healthData = storage.get('healthvault_health_data') || generateSampleHealthData();
  storage.set('healthvault_health_data', healthData);

  const latestData = healthData[healthData.length - 1];
  const prevData = healthData[healthData.length - 2] || latestData;

  // Calculate trends
  const scoreTrend = latestData.healthScore - prevData.healthScore;
  const bpTrend = latestData.bp_systolic - prevData.bp_systolic;
  const sugarTrend = latestData.sugar - prevData.sugar;

  const getStatus = (score) => {
    if (score >= 85) return { text: 'Excellent', class: 'badge-success' };
    if (score >= 70) return { text: 'Good', class: 'badge-primary' };
    if (score >= 55) return { text: 'Moderate', class: 'badge-warning' };
    return { text: 'Needs Attention', class: 'badge-danger' };
  };
  const status = getStatus(latestData.healthScore);

  const pageContent = `
    <!-- Welcome Banner -->
    <div class="welcome-banner fade-in">
      <div class="welcome-text">
        <h2>Welcome Back, <span>${user?.name?.split(' ')[0] || 'User'}</span></h2>
        <p>Your health insights at a glance. Stay on top of your wellness journey.</p>
        <button class="btn btn-secondary" onclick="location.hash='#/daily-health'" style="background:rgba(255,255,255,0.2);color:#fff;border:1.5px solid rgba(255,255,255,0.3);">
          <i class="fa-solid fa-plus"></i> Log Today's Health
        </button>
      </div>
      <div class="welcome-avatar">
        <div class="welcome-avatar-circle">
          ${getInitials(user?.name)}
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid stagger-children">
      <div class="stat-card">
        <div class="stat-icon green"><i class="fa-solid fa-heart-pulse"></i></div>
        <div class="stat-info">
          <h3>${latestData.healthScore}</h3>
          <p>Health Score</p>
          <span class="stat-trend ${scoreTrend >= 0 ? 'up' : 'down'}">
            <i class="fa-solid fa-arrow-${scoreTrend >= 0 ? 'up' : 'down'}"></i>
            ${Math.abs(scoreTrend)}%
          </span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue"><i class="fa-solid fa-droplet"></i></div>
        <div class="stat-info">
          <h3>${latestData.bp_systolic}/${latestData.bp_diastolic}</h3>
          <p>Blood Pressure</p>
          <span class="stat-trend ${bpTrend <= 0 ? 'up' : 'down'}">
            <i class="fa-solid fa-arrow-${bpTrend <= 0 ? 'down' : 'up'}"></i>
            ${Math.abs(bpTrend)} mmHg
          </span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange"><i class="fa-solid fa-candy-cane"></i></div>
        <div class="stat-info">
          <h3>${latestData.sugar}</h3>
          <p>Sugar Level</p>
          <span class="stat-trend ${sugarTrend <= 5 ? 'up' : 'down'}">
            <i class="fa-solid fa-arrow-${sugarTrend <= 5 ? 'down' : 'up'}"></i>
            ${Math.abs(sugarTrend)} mg/dL
          </span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple"><i class="fa-solid fa-weight-scale"></i></div>
        <div class="stat-info">
          <h3>${latestData.weight}</h3>
          <p>Weight (kg)</p>
          <span class="badge ${status.class}">${status.text}</span>
        </div>
      </div>
    </div>

    <!-- Tasks Widget -->
    <div style="margin-bottom: 32px; display: block;">
      ${renderTasksWidget()}
    </div>

    <!-- Chart + Insights Grid -->
    <div class="dashboard-grid">
      <div class="chart-card fade-in">
        <div class="chart-header">
          <h3><i class="fa-solid fa-chart-line" style="color:var(--primary);margin-right:8px;"></i>Health Trend</h3>
          <div class="chart-filters">
            <button class="chart-filter-btn active" data-range="7d">7 Days</button>
            <button class="chart-filter-btn" data-range="30d">30 Days</button>
            <button class="chart-filter-btn" data-range="all">All</button>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="healthChart"></canvas>
        </div>
      </div>

      <div class="insights-panel fade-in">
        <h3 class="insights-title"><i class="fa-solid fa-lightbulb" style="color:var(--warning);margin-right:8px;"></i>Quick Insights</h3>

        <div class="insight-card">
          <div class="insight-icon ${sugarTrend > 0 ? 'up' : 'down'}">
            <i class="fa-solid fa-arrow-trend-${sugarTrend > 0 ? 'up' : 'down'}"></i>
          </div>
          <div>
            <p class="insight-text"><strong>Sugar level</strong> ${sugarTrend > 0 ? 'increased' : 'decreased'} by <strong>${Math.abs(sugarTrend)} mg/dL</strong> since yesterday</p>
            <p class="insight-time">Updated today</p>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon ${latestData.bp_systolic < 130 ? 'up' : 'warn'}">
            <i class="fa-solid fa-${latestData.bp_systolic < 130 ? 'check' : 'exclamation'}"></i>
          </div>
          <div>
            <p class="insight-text"><strong>Blood pressure</strong> is ${latestData.bp_systolic < 130 ? 'within normal range' : 'slightly elevated'}. ${latestData.bp_systolic < 130 ? 'Keep it up!' : 'Monitor closely.'}</p>
            <p class="insight-time">Based on latest reading</p>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon neutral">
            <i class="fa-solid fa-dumbbell"></i>
          </div>
          <div>
            <p class="insight-text">Your <strong>health score</strong> averages <strong>${Math.round(healthData.reduce((s,d) => s + d.healthScore, 0) / healthData.length)}</strong> this week</p>
            <p class="insight-time">Weekly average</p>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon ${latestData.healthScore >= 70 ? 'up' : 'warn'}">
            <i class="fa-solid fa-shield-heart"></i>
          </div>
          <div>
            <p class="insight-text">Overall health status: <strong class="${latestData.healthScore >= 70 ? 'text-success' : 'text-warning'}">${status.text}</strong></p>
            <p class="insight-time">Based on all parameters</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="activity-card fade-in" style="margin-top:var(--space-xl);">
      <div class="activity-header">
        <h3><i class="fa-solid fa-clock-rotate-left" style="color:var(--accent);margin-right:8px;"></i>Recent Activity</h3>
        <button class="btn btn-ghost btn-sm">View All</button>
      </div>
      <div class="activity-list">
        <div class="activity-item">
          <span class="activity-dot green"></span>
          <div class="activity-info">
            <p>Daily health data logged successfully</p>
            <small>Today, 9:30 AM</small>
          </div>
        </div>
        <div class="activity-item">
          <span class="activity-dot blue"></span>
          <div class="activity-info">
            <p>Health report uploaded — Blood Work Analysis.pdf</p>
            <small>Yesterday, 2:15 PM</small>
          </div>
        </div>
        <div class="activity-item">
          <span class="activity-dot orange"></span>
          <div class="activity-info">
            <p>Medicine reminder set — Metformin 500mg</p>
            <small>2 days ago</small>
          </div>
        </div>
        <div class="activity-item">
          <span class="activity-dot red"></span>
          <div class="activity-info">
            <p>Sugar level alert — 142 mg/dL (above normal)</p>
            <small>3 days ago</small>
          </div>
        </div>
      </div>
    </div>
  `;

  renderLayout(pageContent);

  // ── Task checkbox interactions ──────────────────────────────────────────
  setTimeout(() => {
    document.querySelectorAll('.task-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const id   = cb.dataset.id;
        const tasks = loadTodayTasks();
        if (!tasks) return;
        const task = tasks.find(t => t.id === id);
        if (task) {
          task.done = cb.checked;
          saveTodayTasks(tasks);
          const item = cb.closest('.task-item');
          if (item) item.classList.toggle('task-done', cb.checked);

          // Update progress counter live
          const done  = tasks.filter(t => t.done).length;
          const total = tasks.length;
          const pct   = Math.round((done / total) * 100);
          const lbl   = document.querySelector('.tasks-progress-label');
          const fill  = document.querySelector('.tasks-progress-fill');
          if (lbl)  lbl.textContent   = `${done}/${total} done`;
          if (fill) fill.style.width  = `${pct}%`;

          // Live visual health score update
          let localHealthData = storage.get('healthvault_health_data');
          if (localHealthData && localHealthData.length > 0) {
            let lastDay = localHealthData[localHealthData.length - 1];
            if (cb.checked) {
              lastDay.healthScore = Math.min(100, lastDay.healthScore + 2);
            } else {
              lastDay.healthScore = Math.max(0, lastDay.healthScore - 2);
            }
            storage.set('healthvault_health_data', localHealthData);
            
            // Re-render score visually
            const scoreCards = document.querySelectorAll('.stat-card h3');
            if (scoreCards.length > 0) scoreCards[0].innerText = lastDay.healthScore;
            
            // Update chart graph instantly
            if (window.healthChartInstance) {
              window.healthChartInstance.data.datasets[0].data = localHealthData.map(d => d.healthScore);
              window.healthChartInstance.update();
            }
          }
        }
      });
    });
  }, 50);

  // Initialize Chart
  setTimeout(() => initHealthChart(healthData), 100);
}

function initHealthChart(healthData) {
  const canvas = document.getElementById('healthChart');
  if (!canvas) return;

  const labels = healthData.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });

  if (window.healthChartInstance) window.healthChartInstance.destroy();

  window.healthChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Health Score',
          data: healthData.map(d => d.healthScore),
          borderColor: '#0EA573',
          backgroundColor: 'rgba(14, 165, 115, 0.08)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#0EA573',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 3,
        },
        {
          label: 'Sugar Level',
          data: healthData.map(d => d.sugar),
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#F59E0B',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          borderDash: [5, 5],
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: { family: 'Inter', size: 12, weight: '500' }
          }
        },
        tooltip: {
          backgroundColor: '#1E293B',
          titleFont: { family: 'Inter', size: 13, weight: '600' },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 12,
          cornerRadius: 10,
          displayColors: true,
          boxPadding: 4,
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { family: 'Inter', size: 11 },
            color: '#94A3B8'
          }
        },
        y: {
          beginAtZero: false,
          min: 40,
          max: 160,
          grid: {
            color: 'rgba(0,0,0,0.04)',
            drawBorder: false,
          },
          ticks: {
            font: { family: 'Inter', size: 11 },
            color: '#94A3B8',
            stepSize: 20
          }
        }
      }
    }
  });
}
