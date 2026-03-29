import BASE_URL from './config.js';

// Analyze symptoms
export async function analyzeSymptoms(text) {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  return await res.json();
}

// Check progress
export async function getProgress(day1, today) {
  const res = await fetch(`${BASE_URL}/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ day1, today })
  });

  return await res.json();
}

// Analyze uploaded health report via OCR
export async function analyzeReport(formData) {
  const res = await fetch(`${BASE_URL}/analyze-report`, {
    method: "POST",
    body: formData // Content-Type omitted so browser sets boundary
  });
  return await res.json();
}