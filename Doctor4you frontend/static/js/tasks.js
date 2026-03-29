// ===== Health Tasks Module =====
// Generates personalised daily tasks from disease analysis results

const STORAGE_KEY_DIAGNOSIS = 'healthvault_last_diagnosis';
const TASKS_KEY_PREFIX      = 'healthvault_tasks_';

function todayKey() {
  return TASKS_KEY_PREFIX + new Date().toISOString().slice(0, 10);
}

// ── Generate tasks from a diagnosis object ──────────────────────────────────
export function generateTasksFromDiagnosis(diagnosis) {
  const tasks = [];

  // 💊 Medicine tasks — one per medicine
  if (diagnosis.medicines && diagnosis.medicines.length > 0) {
    diagnosis.medicines.forEach((med, i) => {
      tasks.push({
        id: `med_${i}`,
        icon: '💊',
        category: 'Medicine',
        label: `Take ${med.name}`,
        detail: med.dose,
        done: false,
      });
    });
  }

  // 🥗 Diet task
  if (diagnosis.diet && diagnosis.diet.length > 0) {
    tasks.push({
      id: 'diet',
      icon: '🥗',
      category: 'Diet',
      label: 'Eat recommended foods today',
      detail: diagnosis.diet.slice(0, 4).join(', '),
      done: false,
    });
  }

  // 🚫 Avoid task
  if (diagnosis.avoid && diagnosis.avoid.length > 0) {
    tasks.push({
      id: 'avoid',
      icon: '🚫',
      category: 'Avoid',
      label: 'Avoid these today',
      detail: diagnosis.avoid.slice(0, 4).join(', '),
      done: false,
    });
  }

  // 🚶 Walk / Activity task
  const activity = diagnosis.activity || '';
  if (activity && !activity.includes('complete bed rest')) {
    tasks.push({
      id: 'walk',
      icon: '🚶',
      category: 'Activity',
      label: 'Follow activity advice',
      detail: activity,
      done: false,
    });
  } else {
    tasks.push({
      id: 'rest',
      icon: '😴',
      category: 'Rest',
      label: 'Take complete rest today',
      detail: activity || 'Stay in bed, avoid exertion',
      done: false,
    });
  }

  // 💧 Water — always included
  tasks.push({
    id: 'water',
    icon: '💧',
    category: 'Hydration',
    label: 'Drink 8+ glasses of water',
    detail: 'Stay well-hydrated throughout the day',
    done: false,
  });

  return tasks;
}

// ── Persist helpers ─────────────────────────────────────────────────────────
export function loadTodayTasks() {
  try {
    const saved = localStorage.getItem(todayKey());
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

export function saveTodayTasks(tasks) {
  try {
    localStorage.setItem(todayKey(), JSON.stringify(tasks));
  } catch {}
}

export function getLastDiagnosis() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DIAGNOSIS);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveLastDiagnosis(diagnosis) {
  try {
    localStorage.setItem(STORAGE_KEY_DIAGNOSIS, JSON.stringify(diagnosis));
  } catch {}
}

// ── Build or restore today's task list ──────────────────────────────────────
export function getTodayTasks() {
  const diagnosis = getLastDiagnosis();
  if (!diagnosis) return null;

  const saved = loadTodayTasks();
  if (saved) return saved;          // already generated today

  const fresh = generateTasksFromDiagnosis(diagnosis);
  saveTodayTasks(fresh);
  return fresh;
}

// ── Render HTML widget ───────────────────────────────────────────────────────
export function renderTasksWidget() {
  const tasks = getTodayTasks();
  const diagnosis = getLastDiagnosis();

  if (!tasks || tasks.length === 0) {
    return `
      <div class="tasks-card fade-in" style="margin-top:var(--space-xl); margin-bottom:var(--space-2xl);">
        <div class="tasks-header">
          <h3><i class="fa-solid fa-list-check" style="color:var(--primary);margin-right:8px;"></i>Today's Health Tasks</h3>
        </div>
        <div class="tasks-empty">
          <i class="fa-solid fa-stethoscope"></i>
          <p>No tasks yet. <a href="#/disease" style="color:var(--primary);font-weight:600;">Run a disease analysis</a> to get personalised daily tasks.</p>
        </div>
      </div>
    `;
  }

  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct   = Math.round((done / total) * 100);

  const taskItems = tasks.map(t => `
    <div class="task-item ${t.done ? 'task-done' : ''}" data-task-id="${t.id}">
      <label class="task-checkbox-wrap">
        <input type="checkbox" class="task-checkbox" data-id="${t.id}" ${t.done ? 'checked' : ''}>
        <span class="task-checkmark"></span>
      </label>
      <div class="task-body">
        <div class="task-title">
          <span class="task-icon">${t.icon}</span>
          <span class="task-label">${t.label}</span>
          <span class="task-badge">${t.category}</span>
        </div>
        <div class="task-detail">${t.detail}</div>
      </div>
    </div>
  `).join('');

  return `
    <div class="tasks-card fade-in" style="margin-top:var(--space-xl); margin-bottom:var(--space-2xl);">
      <div class="tasks-header">
        <div>
          <h3><i class="fa-solid fa-list-check" style="color:var(--primary);margin-right:8px;"></i>Today's Health Tasks</h3>
          <p class="tasks-subtitle">Based on: <strong>${diagnosis?.condition || 'your analysis'}</strong></p>
        </div>
        <div class="tasks-progress-wrap">
          <span class="tasks-progress-label">${done}/${total} done</span>
          <div class="tasks-progress-bar">
            <div class="tasks-progress-fill" style="width:${pct}%;"></div>
          </div>
        </div>
      </div>
      <div class="tasks-list" id="tasksList">
        ${taskItems}
      </div>
    </div>
  `;
}
