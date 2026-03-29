// ===== Disease Info Page =====
import { renderLayout } from './sidebar.js';
import { analyzeSymptoms } from './api.js';
import { saveLastDiagnosis } from './tasks.js';

export function renderDisease() {

  const pageContent = `
    <div class="page-header">
      <h2><i class="fa-solid fa-stethoscope" style="color:var(--primary);margin-right:10px;"></i>AI Health Analysis</h2>
    </div>

    <!-- INPUT SECTION -->
    <div style="margin-bottom:20px;">
      <textarea id="symptomsInput" placeholder="Enter your symptoms here..." 
        style="width:100%;padding:12px;border-radius:10px;border:1px solid #ccc;"></textarea>

      <button id="analyzeBtn" 
        style="margin-top:10px;padding:10px 20px;background:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;">
        Analyze
      </button>
    </div>

    <!-- RESULT SECTION -->
    <div id="result"></div>
  `;

  renderLayout(pageContent);

  // 🔥 ADD EVENT LISTENER AFTER RENDER
  document.getElementById("analyzeBtn").addEventListener("click", async () => {

    const text = document.getElementById("symptomsInput").value;

    if (!text.trim()) {
      alert("Please enter symptoms");
      return;
    }

    // Loading UI
    document.getElementById("result").innerHTML = `<p>Analyzing...</p>`;

    try {
      const data = await analyzeSymptoms(text);

      // 💾 Save diagnosis so dashboard can generate tasks
      saveLastDiagnosis({ ...data.diagnosis, date: new Date().toDateString() });


      // 🧠 FORMAT OUTPUT
      document.getElementById("result").innerHTML = `
        <div class="disease-card">
          <h3>Condition: ${data.diagnosis.condition}</h3>

          <p><strong>Detected Symptoms:</strong> 
            ${data.entities.symptoms.join(", ") || "None"}
          </p>

          <p><strong>Medicines:</strong></p>
          <ul>
            ${data.diagnosis.medicines.map(m => `
              <li>
                <b>${m.name}</b> - ${m.reason} (${m.dose})
              </li>
            `).join("")}
          </ul>

          <p><strong>Diet:</strong> ${data.diagnosis.diet.join(", ")}</p>
          <p><strong>Avoid:</strong> ${data.diagnosis.avoid.join(", ")}</p>
        </div>
      `;
    } catch (err) {
      console.error(err);
      document.getElementById("result").innerHTML = `
        <p style="color:red;">Error connecting to AI server</p>
      `;
    }
  });
}