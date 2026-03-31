// ===== Doctor AI API Integration =====

const API_BASE = 'https://mggfutrty876try8i-model-1.hf.space';
const API_KEY  = 'mysecret123';

/**
 * Analyze symptoms — calls POST /analyze
 * @param {string} text - symptom description
 * @param {number} day  - day number (default 1)
 * @returns {Promise<object>} full API response
 */
export async function analyzeSymptoms(text, day = 1) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({ text, day }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Check if the API is alive
 */
export async function pingAPI() {
  try {
    const res = await fetch(`${API_BASE}/`);
    return res.ok;
  } catch {
    return false;
  }
}
