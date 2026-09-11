/* =============================================================
   CURLY HEAD DOODLE — SETTINGS ADMIN LOGIC
   =============================================================
   Talks directly to the GitHub Contents API from the browser using a
   personal access token the site owner pastes in (stored only in this
   browser's localStorage). Loads data/content.json, renders a full
   editor for it (theme, dogs, litters, contact, all PL/EN text), and
   writes the whole file back on Save. Photos are uploaded the same way
   as before: resized/compressed on the client, committed to images/.
   ============================================================= */

const OWNER = 'curlyheaddoodle-blip';
const REPO = 'curlyheaddoodle';
const BRANCH = 'main';
const API_ROOT = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;
const TOKEN_KEY = 'chd_admin_token';
const CONTENT_PATH = 'data/content.json';

const FONT_PAIRS = [
  { id: 'fraunces-karla', label: 'Fraunces + Karla (domyślna)', display: 'Fraunces, serif', body: 'Karla, sans-serif' },
  { id: 'playfair-inter', label: 'Playfair Display + Inter', display: '"Playfair Display", serif', body: 'Inter, sans-serif' },
  { id: 'cormorant-nunito', label: 'Cormorant Garamond + Nunito Sans', display: '"Cormorant Garamond", serif', body: '"Nunito Sans", sans-serif' },
];
const COLOR_FIELDS = [
  { key: 'bg', label: 'Tło strony' },
  { key: 'bgAlt', label: 'Tło naprzemienne' },
  { key: 'paper', label: 'Karty / formularz' },
  { key: 'ink', label: 'Tekst główny' },
  { key: 'inkSoft', label: 'Tekst pomocniczy' },
  { key: 'gold', label: 'Akcent' },
  { key: 'goldSoft', label: 'Akcent (jasny)' },
  { key: 'line', label: 'Linie / obramowania' },
];

const LABELS = {
  page_title: 'Tytuł strony (karta przeglądarki)', page_description: 'Opis strony (SEO)',
  nav_about: 'Menu: O nas', nav_breed: 'Menu: O rasie', nav_dogs: 'Menu: Nasze psy', nav_puppies: 'Menu: Szczenięta', nav_contact: 'Menu: Kontakt', nav_cta: 'Menu: przycisk CTA',
  hero_headline: 'Nagłówek główny', hero_subhead: 'Podtytuł', hero_cta_primary: 'Przycisk główny', hero_cta_secondary: 'Link drugorzędny',
  about_kicker: 'Nadtytuł', about_heading: 'Nagłówek', about_cta: 'Link',
  why_heading: 'Nagłówek sekcji', why1_title: 'Punkt 1: tytuł', why1_body: 'Punkt 1: opis', why2_title: 'Punkt 2: tytuł', why2_body: 'Punkt 2: opis',
  why3_title: 'Punkt 3: tytuł', why3_body: 'Punkt 3: opis', why4_title: 'Punkt 4: tytuł', why4_body: 'Punkt 4: opis',
  breed_heading: 'Nagłówek',
  breed_fact1_label: 'Cecha 1: etykieta', breed_fact1_value: 'Cecha 1: wartość', breed_fact2_label: 'Cecha 2: etykieta', breed_fact2_value: 'Cecha 2: wartość',
  breed_fact3_label: 'Cecha 3: etykieta', breed_fact3_value: 'Cecha 3: wartość', breed_fact4_label: 'Cecha 4: etykieta', breed_fact4_value: 'Cecha 4: wartość',
  dogs_heading: 'Nagłówek', dogs_lede: 'Zapowiedź', dogs_note: 'Notatka na dole',
  litters_heading: 'Nagłówek', litters_lede: 'Zapowiedź', litters_note: 'Notatka na dole',
  status_available: 'Etykieta statusu: dostępny', status_expecting: 'Etykieta statusu: oczekiwany', status_reserved: 'Etykieta statusu: zarezerwowany',
  contact_heading: 'Nagłówek', contact_lede: 'Zapowiedź', contact_location_label: 'Etykieta: lokalizacja', contact_location_value: 'Wartość: lokalizacja',
  contact_email_label: 'Etykieta: e-mail', contact_social_label: 'Etykieta: social media',
  field_name: 'Pole: imię i nazwisko', field_email: 'Pole: e-mail', field_phone: 'Pole: telefon', field_litter: 'Pole: wybór miotu',
  field_litter_opt3: 'Opcja: „jeszcze nie wiem”', field_message: 'Pole: wiadomość', field_message_placeholder: 'Placeholder wiadomości',
  submit_btn: 'Przycisk wysyłania', form_fineprint: 'Drobny druk pod formularzem',
  footer_disclaimer: 'Zastrzeżenie', footer_copyright: 'Prawa autorskie',
};

const TRANSLATION_GROUPS = [
  { title: 'Strona / SEO', keys: ['page_title', 'page_description'] },
  { title: 'Menu', keys: ['nav_about', 'nav_breed', 'nav_dogs', 'nav_puppies', 'nav_contact', 'nav_cta'] },
  { title: 'Sekcja główna (Hero)', keys: ['hero_headline', 'hero_subhead', 'hero_cta_primary', 'hero_cta_secondary'] },
  { title: 'O nas', keys: ['about_kicker', 'about_heading', 'about_cta'] },
  { title: 'Dlaczego my', keys: ['why_heading', 'why1_title', 'why1_body', 'why2_title', 'why2_body', 'why3_title', 'why3_body', 'why4_title', 'why4_body'] },
  { title: 'O rasie', keys: ['breed_heading', 'breed_fact1_label', 'breed_fact1_value', 'breed_fact2_label', 'breed_fact2_value', 'breed_fact3_label', 'breed_fact3_value', 'breed_fact4_label', 'breed_fact4_value'] },
  { title: 'Nasze psy — nagłówki', keys: ['dogs_heading', 'dogs_lede', 'dogs_note'] },
  { title: 'Szczenięta — nagłówki i statusy', keys: ['litters_heading', 'litters_lede', 'litters_note', 'status_available', 'status_expecting', 'status_reserved'] },
  { title: 'Kontakt', keys: ['contact_heading', 'contact_lede', 'contact_location_label', 'contact_location_value', 'contact_email_label', 'contact_social_label'] },
  { title: 'Formularz zgłoszeniowy', keys: ['field_name', 'field_email', 'field_phone', 'field_litter', 'field_litter_opt3', 'field_message', 'field_message_placeholder', 'submit_btn', 'form_fineprint'] },
  { title: 'Stopka', keys: ['footer_disclaimer', 'footer_copyright'] },
];
function isLongKey(key) {
  return /body|lede|bio|desc|fineprint|description|placeholder/.test(key);
}

// ---- Auth ----
const authPanel = document.getElementById('authPanel');
const editorRoot = document.getElementById('editorRoot');
const tokenInput = document.getElementById('tokenInput');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const authStatus = document.getElementById('authStatus');

let token = null;
let content = null;
let contentSha = null;

function setAuthStatus(msg, kind) {
  authStatus.textContent = msg;
  authStatus.className = 'admin-status' + (kind ? ' ' + kind : '');
}
function ghHeaders() {
  return { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' };
}

async function verifyToken(candidate) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, {
    headers: { Authorization: `Bearer ${candidate}`, Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(res.status === 404 || res.status === 401 ? 'Nieprawidłowy token lub brak dostępu do repozytorium.' : `Błąd GitHub (${res.status})`);
  const repo = await res.json();
  if (!repo.permissions || !repo.permissions.push) throw new Error('Ten token nie ma uprawnień do zapisu w repozytorium.');

  const contentsRes = await fetch(`${API_ROOT}/images?ref=${BRANCH}`, {
    headers: { Authorization: `Bearer ${candidate}`, Accept: 'application/vnd.github+json' },
  });
  if (contentsRes.status === 403) {
    throw new Error('Token nie ma uprawnienia "Contents: Read and write". Edytuj token na GitHubie (Repository permissions → Contents) i spróbuj ponownie.');
  }
}

function friendlyGithubError(message) {
  if (message && message.includes('Resource not accessible by personal access token')) {
    return 'Token nie ma uprawnienia do zapisu. Na GitHubie edytuj token → Repository permissions → Contents → ustaw "Read and write" (nie "Read-only"), zapisz i spróbuj ponownie.';
  }
  return message;
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
    await enterEditor();
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
    await enterEditor();
  } catch (err) {
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) { /* ignore */ }
    setAuthStatus('Zapisany token wygasł lub jest nieprawidłowy: ' + err.message, 'err');
  }
})();

async function enterEditor() {
  authPanel.querySelector('h2').textContent = 'Połączono z repozytorium GitHub';
  authPanel.querySelectorAll('.field, .admin-help, #connectBtn').forEach(el => el.hidden = true);
  disconnectBtn.hidden = false;

  const loaded = await loadContentFile();
  content = loaded.content;
  contentSha = loaded.sha;

  renderSectionOrder();
  renderBrand();
  renderSlots();
  renderTheme();
  renderAboutBody();
  renderBreedBody();
  renderDogsEditor();
  renderLittersEditor();
  renderContactEditor();
  renderTranslationsEditor();

  editorRoot.hidden = false;
}

async function loadContentFile() {
  const res = await fetch(`${API_ROOT}/${CONTENT_PATH}?ref=${BRANCH}`, { headers: ghHeaders() });
  if (!res.ok) throw new Error(`Nie udało się wczytać ${CONTENT_PATH} (${res.status})`);
  const data = await res.json();
  const decoded = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))));
  return { content: JSON.parse(decoded), sha: data.sha };
}

// ---- Photo upload (shared by fixed slots, per-dog slots, and the logo) ----
// `path` is the file's full path in the repo, e.g. "images/hero.jpg" or
// "images/logo.png" — logos use PNG so a transparent background survives;
// photos use JPEG since they compress much better.
function resizeAndCompress(file, maxDim = 1600, quality = 0.85, mime = 'image/jpeg') {
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
        resolve(canvas.toDataURL(mime, quality).split(',')[1]);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function getFileSha(path) {
  const res = await fetch(`${API_ROOT}/${path}?ref=${BRANCH}`, { headers: ghHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Nie udało się sprawdzić istniejącego pliku (${res.status})`);
  return (await res.json()).sha;
}

function loadPreviewInto(previewEl, path, onFound) {
  const img = new Image();
  img.onload = () => {
    previewEl.innerHTML = '';
    previewEl.appendChild(img);
    if (onFound) onFound(true);
  };
  img.onerror = () => { previewEl.textContent = 'Brak zdjęcia'; if (onFound) onFound(false); };
  img.src = `${path}?t=${Date.now()}`;
}

async function uploadPhoto(path, file, statusEl, previewEl, onDone, mime = 'image/jpeg') {
  statusEl.textContent = 'Przetwarzanie zdjęcia…';
  statusEl.className = 'slot-status busy';
  try {
    const base64Content = await resizeAndCompress(file, 1600, 0.85, mime);
    statusEl.textContent = 'Zapisywanie w repozytorium…';
    const sha = await getFileSha(path);
    const res = await fetch(`${API_ROOT}/${path}`, {
      method: 'PUT',
      headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Update ${path} via admin panel`, content: base64Content, branch: BRANCH, ...(sha ? { sha } : {}) }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Błąd zapisu (${res.status})`);
    }
    statusEl.textContent = 'Zapisano!';
    statusEl.className = 'slot-status ok';
    loadPreviewInto(previewEl, path);
    if (onDone) onDone();
  } catch (err) {
    statusEl.textContent = friendlyGithubError(err.message);
    statusEl.className = 'slot-status err';
  }
}

async function removePhoto(path, statusEl, previewEl) {
  if (!confirm('Usunąć to zdjęcie? Strona wróci do domyślnej grafiki.')) return;
  statusEl.textContent = 'Usuwanie…';
  statusEl.className = 'slot-status busy';
  try {
    const sha = await getFileSha(path);
    if (!sha) { statusEl.textContent = 'Brak zdjęcia do usunięcia.'; statusEl.className = 'slot-status err'; return; }
    const res = await fetch(`${API_ROOT}/${path}`, {
      method: 'DELETE',
      headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Remove ${path} via admin panel`, sha, branch: BRANCH }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Błąd usuwania (${res.status})`);
    }
    statusEl.textContent = 'Usunięto.';
    statusEl.className = 'slot-status ok';
    loadPreviewInto(previewEl, path);
  } catch (err) {
    statusEl.textContent = friendlyGithubError(err.message);
    statusEl.className = 'slot-status err';
  }
}

// ---- Fixed photo slots (hero, about) ----
const FIXED_SLOTS = [
  { key: 'hero', label: 'Zdjęcie główne (Hero)', hint: 'Widoczne na górze strony głównej.' },
  { key: 'about', label: 'Zdjęcie „O nas”', hint: 'Sekcja o Karolinie i Pawle.' },
];
function renderSlots() {
  const grid = document.getElementById('slotGrid');
  grid.innerHTML = '';
  FIXED_SLOTS.forEach(slot => {
    const path = `images/${slot.key}.jpg`;
    const card = document.createElement('div');
    card.className = 'slot-card';
    card.innerHTML = `
      <h3>${slot.label}</h3>
      <p class="slot-hint">${slot.hint}</p>
      <div class="slot-preview">Brak zdjęcia</div>
      <input type="file" accept="image/*">
      <div class="slot-actions">
        <button type="button" class="btn-small">Wgraj zdjęcie</button>
        <button type="button" class="btn-small danger">Usuń zdjęcie</button>
      </div>
      <p class="slot-status"></p>
    `;
    grid.appendChild(card);
    const preview = card.querySelector('.slot-preview');
    const fileInput = card.querySelector('input[type="file"]');
    const status = card.querySelector('.slot-status');
    loadPreviewInto(preview, path);
    card.querySelector('.btn-small:not(.danger)').addEventListener('click', () => {
      if (!fileInput.files[0]) { status.textContent = 'Najpierw wybierz plik.'; status.className = 'slot-status err'; return; }
      uploadPhoto(path, fileInput.files[0], status, preview, () => { fileInput.value = ''; });
    });
    card.querySelector('.btn-small.danger').addEventListener('click', () => removePhoto(path, status, preview));
  });
}

// ---- Menu order ----
// The site is multiple pages now (each nav item is its own .html page), so
// this reorders the nav links themselves rather than sections on one page.
const SECTION_LABELS = {
  about: 'O nas',
  breed: 'O rasie',
  dogs: 'Nasze psy',
  litters: 'Szczenięta',
  contact: 'Kontakt',
};
function renderSectionOrder() {
  const el = document.getElementById('sectionOrderEditor');
  el.innerHTML = '<div class="order-list"></div>';
  const list = el.querySelector('.order-list');
  content.navOrder.forEach((key, index) => {
    const row = document.createElement('div');
    row.className = 'order-row';
    row.innerHTML = `
      <span class="order-label">${index + 1}. ${SECTION_LABELS[key] || key}</span>
      <div class="order-actions">
        <button type="button" class="btn-small" data-act="up">↑</button>
        <button type="button" class="btn-small" data-act="down">↓</button>
      </div>
    `;
    row.querySelector('[data-act="up"]').addEventListener('click', () => moveItem(content.navOrder, index, -1, renderSectionOrder));
    row.querySelector('[data-act="down"]').addEventListener('click', () => moveItem(content.navOrder, index, 1, renderSectionOrder));
    list.appendChild(row);
  });
}

// ---- Brand (logo + name) ----
function renderBrand() {
  const el = document.getElementById('brandEditor');
  el.innerHTML = `
    <div class="dog-photo-row">
      <div class="dog-photo-preview" id="logoPreview">Brak</div>
      <input type="file" accept="image/png,image/svg+xml" id="logoFile" style="flex:1">
      <button type="button" class="btn-small" id="logoUploadBtn">Wgraj</button>
      <button type="button" class="btn-small danger" id="logoRemoveBtn">Usuń</button>
    </div>
    <p class="slot-status" id="logoStatus">Logo powinno być PNG z przezroczystym tłem, najlepiej kwadratowe.</p>
    <div class="repeat-row single" style="margin-top:16px">
      <div><label>Nazwa marki (nagłówek i stopka)</label><input id="brandNameInput" value="${escapeAttr(content.site.brandName)}"></div>
    </div>
  `;
  const preview = document.getElementById('logoPreview');
  const fileInput = document.getElementById('logoFile');
  const status = document.getElementById('logoStatus');
  loadPreviewInto(preview, 'images/logo.png');
  document.getElementById('logoUploadBtn').addEventListener('click', () => {
    if (!fileInput.files[0]) { status.textContent = 'Najpierw wybierz plik.'; status.className = 'slot-status err'; return; }
    uploadPhoto('images/logo.png', fileInput.files[0], status, preview, () => { fileInput.value = ''; }, 'image/png');
  });
  document.getElementById('logoRemoveBtn').addEventListener('click', () => removePhoto('images/logo.png', status, preview));
}
function collectBrand() {
  return { brandName: document.getElementById('brandNameInput').value };
}

// ---- Theme editor ----
function renderTheme() {
  const el = document.getElementById('themeEditor');
  el.innerHTML = `
    <div class="theme-colors">${COLOR_FIELDS.map(f => `
      <div class="color-field">
        <input type="color" id="color-${f.key}" value="${content.theme.colors[f.key] || '#000000'}">
        <label for="color-${f.key}">${f.label}</label>
      </div>`).join('')}
    </div>
    <div class="font-pair-grid">${FONT_PAIRS.map(fp => `
      <div class="font-pair-option${content.theme.fontPair === fp.id ? ' selected' : ''}" data-font-pair="${fp.id}">
        <div class="fp-display" style="font-family:${fp.display}">Curly Head Doodle</div>
        <div class="fp-body" style="font-family:${fp.body}">${fp.label}</div>
      </div>`).join('')}
    </div>
  `;
  el.querySelectorAll('.font-pair-option').forEach(opt => {
    opt.addEventListener('click', () => {
      el.querySelectorAll('.font-pair-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}
function collectTheme() {
  const colors = {};
  COLOR_FIELDS.forEach(f => { colors[f.key] = document.getElementById(`color-${f.key}`).value; });
  const selected = document.querySelector('.font-pair-option.selected');
  return { colors, fontPair: selected ? selected.dataset.fontPair : content.theme.fontPair };
}

// ---- Content block editor (open-ended — used for "O nas" and "O rasie"
// body text): each block is an optional heading + a paragraph, each with
// its own font choice, plus a bold/italic/underline toolbar on the text.
const FONT_OPTIONS = [
  { id: 'default', label: 'Domyślna (z motywu strony)' },
  { id: 'fraunces', label: 'Fraunces (szeryfowa)' },
  { id: 'karla', label: 'Karla (bezszeryfowa)' },
  { id: 'playfair', label: 'Playfair Display (szeryfowa)' },
  { id: 'inter', label: 'Inter (bezszeryfowa)' },
  { id: 'cormorant', label: 'Cormorant Garamond (szeryfowa)' },
  { id: 'nunito', label: 'Nunito Sans (bezszeryfowa)' },
];
function fontSelectHtml(selected) {
  return FONT_OPTIONS.map(f => `<option value="${f.id}"${selected === f.id ? ' selected' : ''}>${f.label}</option>`).join('');
}
// Wraps the textarea's current selection in `marker` on both sides (or
// inserts placeholder text if nothing is selected), then fires an input
// event so the existing data-binding listener picks up the new value.
function wrapSelection(textarea, marker) {
  const start = textarea.selectionStart, end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end) || 'tekst';
  textarea.value = value.slice(0, start) + marker + selected + marker + value.slice(end);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  textarea.focus();
  textarea.setSelectionRange(start + marker.length, start + marker.length + selected.length);
}

function renderParagraphEditor(containerId, list, rerender) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  list.forEach((block, index) => {
    const row = document.createElement('div');
    row.className = 'repeat-item';
    row.innerHTML = `
      <div class="repeat-item-head">
        <span class="repeat-title">Akapit ${index + 1}</span>
        <div class="repeat-item-actions">
          <button type="button" class="btn-small" data-act="up">↑</button>
          <button type="button" class="btn-small" data-act="down">↓</button>
          <button type="button" class="btn-small danger" data-act="remove">Usuń</button>
        </div>
      </div>
      <div class="repeat-row">
        <div><label>Nagłówek nad akapitem (PL, opcjonalnie)</label><input data-f="heading.pl" value="${escapeAttr(block.heading.pl)}"></div>
        <div><label>Heading above paragraph (EN, optional)</label><input data-f="heading.en" value="${escapeAttr(block.heading.en)}"></div>
      </div>
      <div class="repeat-row">
        <div><label>Czcionka nagłówka</label><select data-f="headingFont">${fontSelectHtml(block.headingFont)}</select></div>
        <div><label>Czcionka akapitu</label><select data-f="textFont">${fontSelectHtml(block.textFont)}</select></div>
      </div>
      <div class="repeat-row">
        <div>
          <label>Tekst (PL)</label>
          <div class="rt-toolbar" data-for="pl">
            <button type="button" class="btn-small" data-fmt="**" title="Pogrubienie"><strong>B</strong></button>
            <button type="button" class="btn-small" data-fmt="*" title="Kursywa"><em>I</em></button>
            <button type="button" class="btn-small" data-fmt="++" title="Podkreślenie"><u>U</u></button>
          </div>
          <textarea data-f="text.pl">${escapeHtml(block.text.pl)}</textarea>
        </div>
        <div>
          <label>Text (EN)</label>
          <div class="rt-toolbar" data-for="en">
            <button type="button" class="btn-small" data-fmt="**" title="Bold"><strong>B</strong></button>
            <button type="button" class="btn-small" data-fmt="*" title="Italic"><em>I</em></button>
            <button type="button" class="btn-small" data-fmt="++" title="Underline"><u>U</u></button>
          </div>
          <textarea data-f="text.en">${escapeHtml(block.text.en)}</textarea>
        </div>
      </div>
      <p class="slot-hint">Zaznacz fragment tekstu i kliknij B / I / U, aby go pogrubić, pochylić lub podkreślić.</p>
    `;
    row.querySelectorAll('[data-f]').forEach(input => {
      input.addEventListener('input', () => {
        const path = input.dataset.f.split('.');
        if (path.length === 1) block[path[0]] = input.value;
        else block[path[0]][path[1]] = input.value;
      });
    });
    row.querySelectorAll('.rt-toolbar').forEach(toolbar => {
      const textarea = row.querySelector(`textarea[data-f="text.${toolbar.dataset.for}"]`);
      toolbar.querySelectorAll('[data-fmt]').forEach(btn => {
        btn.addEventListener('click', () => wrapSelection(textarea, btn.dataset.fmt));
      });
    });
    row.querySelector('[data-act="up"]').addEventListener('click', () => moveItem(list, index, -1, rerender));
    row.querySelector('[data-act="down"]').addEventListener('click', () => moveItem(list, index, 1, rerender));
    row.querySelector('[data-act="remove"]').addEventListener('click', () => {
      if (list.length <= 1) { alert('Musi zostać co najmniej jeden akapit.'); return; }
      if (!confirm('Usunąć ten akapit?')) return;
      list.splice(index, 1);
      rerender();
    });
    el.appendChild(row);
  });
}
function renderAboutBody() { renderParagraphEditor('aboutBodyEditor', content.about.body, renderAboutBody); }
function renderBreedBody() { renderParagraphEditor('breedBodyEditor', content.breed.body, renderBreedBody); }

// ---- Dogs editor ----
function renderDogsEditor() {
  const el = document.getElementById('dogsEditor');
  el.innerHTML = '';
  content.dogs.forEach((dog, index) => el.appendChild(buildDogRow(dog, index)));
}
function buildDogRow(dog, index) {
  const row = document.createElement('div');
  row.className = 'repeat-item';
  row.innerHTML = `
    <div class="repeat-item-head">
      <span class="repeat-title">Pies ${index + 1}</span>
      <div class="repeat-item-actions">
        <button type="button" class="btn-small" data-act="up">↑</button>
        <button type="button" class="btn-small" data-act="down">↓</button>
        <button type="button" class="btn-small danger" data-act="remove">Usuń</button>
      </div>
    </div>
    <div class="dog-photo-row">
      <div class="dog-photo-preview">Brak</div>
      <input type="file" accept="image/*" style="flex:1">
      <button type="button" class="btn-small" data-act="upload-photo">Wgraj</button>
    </div>
    <p class="slot-status"></p>
    <div class="repeat-row">
      <div><label>Imię (PL)</label><input data-f="name.pl" value="${escapeAttr(dog.name.pl)}"></div>
      <div><label>Name (EN)</label><input data-f="name.en" value="${escapeAttr(dog.name.en)}"></div>
    </div>
    <div class="repeat-row">
      <div><label>Rola (PL)</label><input data-f="role.pl" value="${escapeAttr(dog.role.pl)}"></div>
      <div><label>Role (EN)</label><input data-f="role.en" value="${escapeAttr(dog.role.en)}"></div>
    </div>
    <div class="repeat-row">
      <div><label>Opis (PL)</label><textarea data-f="bio.pl">${escapeHtml(dog.bio.pl)}</textarea></div>
      <div><label>Bio (EN)</label><textarea data-f="bio.en">${escapeHtml(dog.bio.en)}</textarea></div>
    </div>
  `;
  const preview = row.querySelector('.dog-photo-preview');
  const status = row.querySelector('.slot-status');
  const fileInput = row.querySelector('input[type="file"]');
  const dogPhotoPath = `images/${dog.id}.jpg`;
  loadPreviewInto(preview, dogPhotoPath);

  row.querySelectorAll('[data-f]').forEach(input => {
    input.addEventListener('input', () => {
      const [group, lang] = input.dataset.f.split('.');
      dog[group][lang] = input.value;
    });
  });
  row.querySelector('[data-act="up"]').addEventListener('click', () => moveItem(content.dogs, index, -1, renderDogsEditor));
  row.querySelector('[data-act="down"]').addEventListener('click', () => moveItem(content.dogs, index, 1, renderDogsEditor));
  row.querySelector('[data-act="remove"]').addEventListener('click', () => {
    if (!confirm('Usunąć tego psa ze strony?')) return;
    content.dogs.splice(index, 1);
    renderDogsEditor();
  });
  row.querySelector('[data-act="upload-photo"]').addEventListener('click', () => {
    if (!fileInput.files[0]) { status.textContent = 'Najpierw wybierz plik.'; status.className = 'slot-status err'; return; }
    uploadPhoto(dogPhotoPath, fileInput.files[0], status, preview, () => { fileInput.value = ''; });
  });
  return row;
}
function newContentBlock() {
  return { heading: { pl: '', en: '' }, headingFont: 'default', textFont: 'default', text: { pl: '', en: '' } };
}
document.getElementById('addAboutParaBtn').addEventListener('click', () => {
  content.about.body.push(newContentBlock());
  renderAboutBody();
});
document.getElementById('addBreedParaBtn').addEventListener('click', () => {
  content.breed.body.push(newContentBlock());
  renderBreedBody();
});

document.getElementById('addDogBtn').addEventListener('click', () => {
  content.dogs.push({ id: `dog-${Date.now()}`, name: { pl: '', en: '' }, role: { pl: '', en: '' }, bio: { pl: '', en: '' } });
  renderDogsEditor();
});

// ---- Litters editor ----
const STATUS_OPTIONS = [
  { value: 'available', label: 'Dostępny' },
  { value: 'expecting', label: 'Oczekiwany' },
  { value: 'reserved', label: 'Zarezerwowany' },
];
function renderLittersEditor() {
  const el = document.getElementById('littersEditor');
  el.innerHTML = '';
  content.litters.forEach((litter, index) => el.appendChild(buildLitterRow(litter, index)));
}
function buildLitterRow(litter, index) {
  const row = document.createElement('div');
  row.className = 'repeat-item';
  row.innerHTML = `
    <div class="repeat-item-head">
      <span class="repeat-title">Miot ${index + 1}</span>
      <div class="repeat-item-actions">
        <button type="button" class="btn-small" data-act="up">↑</button>
        <button type="button" class="btn-small" data-act="down">↓</button>
        <button type="button" class="btn-small danger" data-act="remove">Usuń</button>
      </div>
    </div>
    <div class="repeat-row single">
      <div><label>Status</label>
        <select data-f="status">${STATUS_OPTIONS.map(s => `<option value="${s.value}"${litter.status === s.value ? ' selected' : ''}>${s.label}</option>`).join('')}</select>
      </div>
    </div>
    <div class="repeat-row">
      <div><label>Tytuł (PL)</label><input data-f="title.pl" value="${escapeAttr(litter.title.pl)}"></div>
      <div><label>Title (EN)</label><input data-f="title.en" value="${escapeAttr(litter.title.en)}"></div>
    </div>
    <div class="repeat-row">
      <div><label>Opis (PL)</label><textarea data-f="desc.pl">${escapeHtml(litter.desc.pl)}</textarea></div>
      <div><label>Description (EN)</label><textarea data-f="desc.en">${escapeHtml(litter.desc.en)}</textarea></div>
    </div>
    <div class="repeat-row">
      <div><label>Przycisk (PL, puste = brak)</label><input data-f="cta.pl" value="${escapeAttr(litter.cta.pl)}"></div>
      <div><label>Button (EN, blank = none)</label><input data-f="cta.en" value="${escapeAttr(litter.cta.en)}"></div>
    </div>
  `;
  row.querySelectorAll('[data-f]').forEach(input => {
    input.addEventListener('input', () => {
      const path = input.dataset.f.split('.');
      if (path.length === 1) litter[path[0]] = input.value;
      else litter[path[0]][path[1]] = input.value;
    });
  });
  row.querySelector('[data-act="up"]').addEventListener('click', () => moveItem(content.litters, index, -1, renderLittersEditor));
  row.querySelector('[data-act="down"]').addEventListener('click', () => moveItem(content.litters, index, 1, renderLittersEditor));
  row.querySelector('[data-act="remove"]').addEventListener('click', () => {
    if (!confirm('Usunąć ten miot ze strony?')) return;
    content.litters.splice(index, 1);
    renderLittersEditor();
  });
  return row;
}
document.getElementById('addLitterBtn').addEventListener('click', () => {
  content.litters.push({ id: `litter-${Date.now()}`, status: 'available', title: { pl: '', en: '' }, desc: { pl: '', en: '' }, cta: { pl: '', en: '' } });
  renderLittersEditor();
});

function moveItem(arr, index, delta, rerender) {
  const newIndex = index + delta;
  if (newIndex < 0 || newIndex >= arr.length) return;
  [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
  rerender();
}

// ---- Contact editor ----
function renderContactEditor() {
  const el = document.getElementById('contactEditor');
  el.innerHTML = `
    <div class="repeat-row">
      <div><label>Adres e-mail (kontaktowy)</label><input id="contact-email" value="${escapeAttr(content.contact.email)}"></div>
      <div><label>Instagram / Facebook (nazwa)</label><input id="contact-social" value="${escapeAttr(content.contact.social)}"></div>
    </div>
    <div class="repeat-row single">
      <div><label>Formspree — adres formularza (action URL)</label><input id="contact-formAction" value="${escapeAttr(content.contact.formAction)}"></div>
    </div>
  `;
}
function collectContact() {
  return {
    email: document.getElementById('contact-email').value,
    social: document.getElementById('contact-social').value,
    formAction: document.getElementById('contact-formAction').value,
  };
}

// ---- Translations editor ----
function renderTranslationsEditor() {
  const el = document.getElementById('translationsEditor');
  el.innerHTML = '';
  TRANSLATION_GROUPS.forEach(group => {
    const details = document.createElement('details');
    details.className = 't-group';
    const body = group.keys.map(key => {
      const entry = content.translations[key] || { pl: '', en: '' };
      const tag = isLongKey(key) ? 'textarea' : 'input';
      return `
        <div class="t-key-row">
          <div class="t-key-label">${LABELS[key] || key}</div>
          <div class="t-key-inputs">
            <div class="t-lang-wrap"><span class="t-lang-tag">PL</span><${tag} data-key="${key}" data-lang="pl">${tag === 'textarea' ? escapeHtml(entry.pl) : ''}</${tag}></div>
            <div class="t-lang-wrap"><span class="t-lang-tag">EN</span><${tag} data-key="${key}" data-lang="en">${tag === 'textarea' ? escapeHtml(entry.en) : ''}</${tag}></div>
          </div>
        </div>`;
    }).join('');
    details.innerHTML = `<summary>${group.title}</summary><div class="t-group-body">${body}</div>`;
    el.appendChild(details);
    // input-type fields need their value set via the value attribute (already empty above for text inputs)
    group.keys.forEach(key => {
      const entry = content.translations[key] || { pl: '', en: '' };
      details.querySelectorAll(`input[data-key="${key}"]`).forEach(input => {
        input.value = entry[input.dataset.lang] || '';
      });
    });
  });
}
function collectTranslations() {
  const result = {};
  document.querySelectorAll('#translationsEditor [data-key]').forEach(field => {
    const key = field.dataset.key;
    const lang = field.dataset.lang;
    if (!result[key]) result[key] = { pl: '', en: '' };
    result[key][lang] = field.value;
  });
  return result;
}

// ---- Save ----
function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

const saveBtn = document.getElementById('saveBtn');
const saveStatus = document.getElementById('saveStatus');
saveBtn.addEventListener('click', async () => {
  saveBtn.disabled = true;
  saveStatus.textContent = 'Zapisywanie…';
  saveStatus.className = 'admin-status busy';
  try {
    content.site = collectBrand();
    content.theme = collectTheme();
    content.translations = collectTranslations();
    content.contact = collectContact();
    // content.dogs / content.litters are already kept live-updated by their input listeners.

    const jsonStr = JSON.stringify(content, null, 2);
    const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
    const res = await fetch(`${API_ROOT}/${CONTENT_PATH}`, {
      method: 'PUT',
      headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Update site content via admin panel', content: base64, branch: BRANCH, sha: contentSha }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Błąd zapisu (${res.status})`);
    }
    const result = await res.json();
    contentSha = result.content.sha;
    saveStatus.textContent = 'Zapisano! Strona pokaże zmiany w ciągu minuty.';
    saveStatus.className = 'admin-status ok';
  } catch (err) {
    saveStatus.textContent = friendlyGithubError(err.message);
    saveStatus.className = 'admin-status err';
  } finally {
    saveBtn.disabled = false;
  }
});
