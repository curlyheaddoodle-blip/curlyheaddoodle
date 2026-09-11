/* =============================================================
   CURLY HEAD DOODLE — SETTINGS / PHOTO ADMIN LOGIC
   =============================================================
   Talks directly to the GitHub Contents API from the browser using a
   personal access token the site owner pastes in (stored only in this
   browser's localStorage). Each upload is resized/compressed on the
   client, then committed as images/<slot>.jpg on the `main` branch —
   the exact path script.js looks for on the public site.
   ============================================================= */

const OWNER = 'curlyheaddoodle-blip';
const REPO = 'curlyheaddoodle';
const BRANCH = 'main';
const API_ROOT = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;
const TOKEN_KEY = 'chd_admin_token';

const SLOTS = [
  { key: 'hero', label: 'Zdjęcie główne (Hero)', hint: 'Widoczne na górze strony głównej.' },
  { key: 'about', label: 'Zdjęcie „O nas”', hint: 'Sekcja o Karolinie i Pawle.' },
  { key: 'dog1', label: 'Zdjęcie suczki hodowlanej', hint: 'Pierwsza karta w sekcji „Nasze psy”.' },
  { key: 'dog2', label: 'Zdjęcie reproduktora', hint: 'Druga karta w sekcji „Nasze psy”.' },
];

const authPanel = document.getElementById('authPanel');
const slotsPanel = document.getElementById('slotsPanel');
const slotGrid = document.getElementById('slotGrid');
const tokenInput = document.getElementById('tokenInput');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const authStatus = document.getElementById('authStatus');

let token = null;

function setAuthStatus(msg, kind) {
  authStatus.textContent = msg;
  authStatus.className = 'admin-status' + (kind ? ' ' + kind : '');
}

function ghHeaders() {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };
}

async function verifyToken(candidate) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, {
    headers: { Authorization: `Bearer ${candidate}`, Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(res.status === 404 || res.status === 401 ? 'Nieprawidłowy token lub brak dostępu do repozytorium.' : `Błąd GitHub (${res.status})`);
  const repo = await res.json();
  if (!repo.permissions || !repo.permissions.push) {
    throw new Error('Ten token nie ma uprawnień do zapisu w repozytorium.');
  }
}

function showSlots() {
  authPanel.querySelector('h2').textContent = 'Połączono z repozytorium GitHub';
  authPanel.querySelectorAll('.field, .admin-help, #connectBtn').forEach(el => el.hidden = true);
  disconnectBtn.hidden = false;
  slotsPanel.hidden = false;
  buildSlotCards();
}

function buildSlotCards() {
  slotGrid.innerHTML = '';
  SLOTS.forEach(slot => {
    const card = document.createElement('div');
    card.className = 'slot-card';
    card.innerHTML = `
      <h3>${slot.label}</h3>
      <p class="slot-hint">${slot.hint}</p>
      <div class="slot-preview" id="preview-${slot.key}">Brak zdjęcia</div>
      <input type="file" accept="image/*" id="file-${slot.key}">
      <div class="slot-actions">
        <button type="button" class="btn-small" id="upload-${slot.key}">Wgraj zdjęcie</button>
        <button type="button" class="btn-small danger" id="remove-${slot.key}" hidden>Usuń zdjęcie</button>
      </div>
      <p class="slot-status" id="status-${slot.key}"></p>
    `;
    slotGrid.appendChild(card);

    loadExistingPreview(slot.key);
    document.getElementById(`upload-${slot.key}`).addEventListener('click', () => handleUpload(slot.key));
    document.getElementById(`remove-${slot.key}`).addEventListener('click', () => handleRemove(slot.key));
  });
}

function setSlotStatus(key, msg, kind) {
  const el = document.getElementById(`status-${key}`);
  el.textContent = msg;
  el.className = 'slot-status' + (kind ? ' ' + kind : '');
}

async function getFileSha(key) {
  const res = await fetch(`${API_ROOT}/images/${key}.jpg?ref=${BRANCH}`, { headers: ghHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Nie udało się sprawdzić istniejącego pliku (${res.status})`);
  const data = await res.json();
  return data.sha;
}

async function loadExistingPreview(key) {
  const preview = document.getElementById(`preview-${key}`);
  const removeBtn = document.getElementById(`remove-${key}`);
  const img = new Image();
  img.onload = () => {
    preview.innerHTML = '';
    preview.appendChild(img);
    removeBtn.hidden = false;
  };
  img.onerror = () => { preview.textContent = 'Brak zdjęcia'; removeBtn.hidden = true; };
  img.src = `images/${key}.jpg?t=${Date.now()}`;
}

// Resize to a max dimension and compress to JPEG so the repo stays light.
function resizeAndCompress(file, maxDim = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Nie udało się odczytać pliku.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Plik nie jest prawidłowym obrazem.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl.split(',')[1]); // strip the data: prefix, keep base64
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handleUpload(key) {
  const fileInput = document.getElementById(`file-${key}`);
  const file = fileInput.files[0];
  if (!file) { setSlotStatus(key, 'Najpierw wybierz plik.', 'err'); return; }

  const uploadBtn = document.getElementById(`upload-${key}`);
  uploadBtn.disabled = true;
  setSlotStatus(key, 'Przetwarzanie zdjęcia…', 'busy');

  try {
    const base64Content = await resizeAndCompress(file);
    setSlotStatus(key, 'Zapisywanie w repozytorium…', 'busy');
    const sha = await getFileSha(key);
    const res = await fetch(`${API_ROOT}/images/${key}.jpg`, {
      method: 'PUT',
      headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Update ${key} photo via admin panel`,
        content: base64Content,
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Błąd zapisu (${res.status})`);
    }
    setSlotStatus(key, 'Zapisano! Strona pokaże nowe zdjęcie w ciągu minuty.', 'ok');
    loadExistingPreview(key);
    fileInput.value = '';
  } catch (err) {
    setSlotStatus(key, err.message, 'err');
  } finally {
    uploadBtn.disabled = false;
  }
}

async function handleRemove(key) {
  if (!confirm('Usunąć to zdjęcie? Strona wróci do domyślnej grafiki.')) return;
  const removeBtn = document.getElementById(`remove-${key}`);
  removeBtn.disabled = true;
  setSlotStatus(key, 'Usuwanie…', 'busy');
  try {
    const sha = await getFileSha(key);
    if (!sha) { setSlotStatus(key, 'Brak zdjęcia do usunięcia.', 'err'); return; }
    const res = await fetch(`${API_ROOT}/images/${key}.jpg`, {
      method: 'DELETE',
      headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Remove ${key} photo via admin panel`, sha, branch: BRANCH }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Błąd usuwania (${res.status})`);
    }
    setSlotStatus(key, 'Usunięto.', 'ok');
    loadExistingPreview(key);
  } catch (err) {
    setSlotStatus(key, err.message, 'err');
  } finally {
    removeBtn.disabled = false;
  }
}

connectBtn.addEventListener('click', async () => {
  const candidate = tokenInput.value.trim();
  if (!candidate) { setAuthStatus('Wklej token, aby się połączyć.', 'err'); return; }
  connectBtn.disabled = true;
  setAuthStatus('Sprawdzanie tokena…', 'busy');
  try {
    await verifyToken(candidate);
    token = candidate;
    try { localStorage.setItem(TOKEN_KEY, token); } catch (e) { /* storage unavailable, session-only */ }
    setAuthStatus('Połączono.', 'ok');
    showSlots();
  } catch (err) {
    setAuthStatus(err.message, 'err');
  } finally {
    connectBtn.disabled = false;
  }
});

disconnectBtn.addEventListener('click', () => {
  token = null;
  try { localStorage.removeItem(TOKEN_KEY); } catch (e) { /* ignore */ }
  location.reload();
});

// Auto-connect if a token was saved from a previous visit.
(async function init() {
  let saved = null;
  try { saved = localStorage.getItem(TOKEN_KEY); } catch (e) { /* storage unavailable */ }
  if (!saved) return;
  tokenInput.value = saved;
  setAuthStatus('Sprawdzanie zapisanego tokena…', 'busy');
  try {
    await verifyToken(saved);
    token = saved;
    setAuthStatus('Połączono.', 'ok');
    showSlots();
  } catch (err) {
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) { /* ignore */ }
    setAuthStatus('Zapisany token wygasł lub jest nieprawidłowy: ' + err.message, 'err');
  }
})();
