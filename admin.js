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
  status_available: 'Etykieta statusu: dostępny', status_expecting: 'Etykieta statusu: oczekiwany', status_reserved: 'Etykieta statusu: zarezerwowany', status_previous: 'Etykieta statusu: poprzedni miot',
  contact_heading: 'Nagłówek', contact_lede: 'Zapowiedź', contact_location_label: 'Etykieta: lokalizacja', contact_location_value: 'Wartość: lokalizacja',
  contact_email_label: 'Etykieta: e-mail', contact_social_label: 'Etykieta: media społecznościowe',
  field_section1_heading: 'Nagłówek sekcji 1', field_name: 'Pole: imię i nazwisko', field_email: 'Pole: e-mail', field_phone: 'Pole: telefon',
  field_city: 'Pole: miejscowość', field_household: 'Pytanie: skład domostwa', field_household_agree: 'Pytanie: zgoda domowników',
  field_allergies: 'Pytanie: alergicy', field_other_pets: 'Pytanie: inne zwierzęta',
  field_section2_heading: 'Nagłówek sekcji 2', field_housing: 'Pytanie: dom czy mieszkanie', field_alone_hours: 'Pytanie: godziny samotności',
  field_daily_time: 'Pytanie: czas z psem',
  field_section3_heading: 'Nagłówek sekcji 3', field_experience: 'Pytanie: doświadczenie', field_grooming_ready: 'Pytanie: gotowość na groomera',
  field_temperament: 'Pytanie: charakter psa', field_training: 'Pytanie: nauka zasad', field_vacation: 'Pytanie: opieka wakacyjna',
  field_select_placeholder: 'Placeholder listy wyboru', field_yes: 'Odpowiedź: Tak', field_no: 'Odpowiedź: Nie',
  field_litter: 'Pole: wybór miotu',
  field_litter_opt3: 'Opcja: „jeszcze nie wiem”', field_message: 'Pole: dodatkowa wiadomość', field_message_placeholder: 'Placeholder wiadomości',
  submit_btn: 'Przycisk wysyłania', form_fineprint: 'Drobny druk pod formularzem',
  footer_disclaimer: 'Zastrzeżenie', footer_copyright: 'Prawa autorskie',
  contact_form_name_placeholder: 'Formularz kontaktowy — placeholder: imię', contact_form_phone_placeholder: 'Formularz kontaktowy — placeholder: telefon',
  contact_form_email_placeholder: 'Formularz kontaktowy — placeholder: e-mail', contact_form_message_placeholder: 'Formularz kontaktowy — placeholder: wiadomość',
  contact_form_submit: 'Formularz kontaktowy — przycisk wysyłania',
  contact_form_success_message: 'Formularz kontaktowy — komunikat sukcesu', contact_form_error_message: 'Formularz kontaktowy — komunikat błędu',
};

const TRANSLATION_GROUPS = [
  { title: 'Strona / SEO', keys: ['page_title', 'page_description'] },
  { title: 'Menu', keys: ['nav_about', 'nav_breed', 'nav_dogs', 'nav_puppies', 'nav_contact', 'nav_cta'] },
  { title: 'Formularz — Dane podstawowe i rodzina', keys: ['field_section1_heading', 'field_name', 'field_email', 'field_phone', 'field_city', 'field_household', 'field_household_agree', 'field_allergies', 'field_other_pets'] },
  { title: 'Formularz — Warunki mieszkaniowe i styl życia', keys: ['field_section2_heading', 'field_housing', 'field_alone_hours', 'field_daily_time'] },
  { title: 'Formularz — Doświadczenie i oczekiwania', keys: ['field_section3_heading', 'field_experience', 'field_grooming_ready', 'field_temperament', 'field_training', 'field_vacation'] },
  { title: 'Formularz — pozostałe', keys: ['field_select_placeholder', 'field_yes', 'field_no', 'field_litter', 'field_litter_opt3', 'field_message', 'field_message_placeholder', 'submit_btn', 'form_fineprint'] },
  { title: 'Krótki formularz kontaktowy (strona Kontakt)', keys: ['contact_form_name_placeholder', 'contact_form_phone_placeholder', 'contact_form_email_placeholder', 'contact_form_message_placeholder', 'contact_form_submit', 'contact_form_success_message', 'contact_form_error_message'] },
  { title: 'Stopka', keys: ['footer_disclaimer', 'footer_copyright'] },
];
// Keys grouped by real-world site section so admin.html can show them
// together with that section's photo/body/list editor, instead of buried
// in the separate "Wszystkie teksty" accordion.
const SECTION_KEY_GROUPS = {
  hero: ['hero_headline', 'hero_subhead', 'hero_cta_primary', 'hero_cta_secondary', 'why_heading',
    'why1_title', 'why1_body', 'why2_title', 'why2_body', 'why3_title', 'why3_body', 'why4_title', 'why4_body'],
  about: ['about_kicker', 'about_heading', 'about_cta'],
  breed: ['breed_heading'],
  dogs: ['dogs_heading', 'dogs_lede', 'dogs_note'],
  litters: ['litters_heading', 'litters_lede', 'litters_note', 'status_available', 'status_expecting', 'status_reserved', 'status_previous'],
  contact: ['contact_heading', 'contact_lede', 'contact_location_label', 'contact_location_value', 'contact_email_label', 'contact_social_label'],
};
const LONG_QUESTION_KEYS = new Set([
  'field_household', 'field_household_agree', 'field_allergies', 'field_other_pets',
  'field_housing', 'field_daily_time', 'field_experience', 'field_grooming_ready',
  'field_temperament', 'field_training', 'field_vacation',
]);
function isLongKey(key) {
  return /body|lede|bio|desc|fineprint|description|placeholder/.test(key) || LONG_QUESTION_KEYS.has(key);
}

// Renders a list of translation keys as PL/EN field pairs directly inside a
// section's own card (e.g. Hero, O nas) instead of the general "Wszystkie
// teksty" accordion — so everything about one section lives in one place.
function renderKeyFields(containerId, keys) {
  const el = document.getElementById(containerId);
  el.innerHTML = keys.map(key => {
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
  keys.forEach(key => {
    const entry = content.translations[key] || { pl: '', en: '' };
    el.querySelectorAll(`input[data-key="${key}"]`).forEach(input => { input.value = entry[input.dataset.lang] || ''; });
  });
}
// Builds one fixed photo slot card (hero / about) — factored out of the old
// standalone "Zdjęcia" card so each slot can live inside its own section card.
// `visTarget`/`visKey` (optional) point at a boolean field to toggle this
// slot's visibility on the live site (e.g. { key: 'hero', ... }, content.hero,
// 'photoHidden') — used by Hero/O nas, not by per-block or footer slots.
// `sizeTarget`/`sizeKey`/`sizeDefault` (optional, same shape) add a size (px)
// input the same way, for the same two callers.
function buildFixedSlotCard(slot, visTarget, visKey, sizeTarget, sizeKey, sizeDefault) {
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
    ${sizeTarget ? `<div class="repeat-row single" style="margin-top:8px"><div><label>Rozmiar (px)</label><input type="number" min="60" max="700" data-act="size" value="${sizeTarget[sizeKey] || sizeDefault}"></div></div>` : ''}
    ${visTarget ? `<label class="checkbox-label" style="margin-top:8px"><input type="checkbox" data-act="vis"${visTarget[visKey] ? ' checked' : ''}> Ukryj to zdjęcie na stronie</label>` : ''}
  `;
  const preview = card.querySelector('.slot-preview');
  const fileInput = card.querySelector('input[type="file"]');
  const status = card.querySelector('.slot-status');
  loadPreviewInto(preview, path);
  card.querySelector('.btn-small:not(.danger)').addEventListener('click', () => {
    if (!fileInput.files[0]) { status.textContent = 'Najpierw wybierz plik.'; status.className = 'slot-status err'; return; }
    uploadPhoto(path, fileInput.files[0], status, preview, () => { fileInput.value = ''; });
  });
  card.querySelector('.btn-small.danger').addEventListener('click', () => removePhoto(path, status, preview));
  if (visTarget) {
    card.querySelector('[data-act="vis"]').addEventListener('change', e => { visTarget[visKey] = e.target.checked; });
  }
  if (sizeTarget) {
    card.querySelector('[data-act="size"]').addEventListener('input', e => { sizeTarget[sizeKey] = Number(e.target.value) || sizeDefault; });
  }
  return card;
}
function renderHero() {
  renderKeyFields('heroFieldsEditor', SECTION_KEY_GROUPS.hero);
  if (!content.hero) content.hero = { body: [] };
  if (!content.hero.body) content.hero.body = [];
  const grid = document.getElementById('heroSlotGrid');
  grid.innerHTML = '';
  grid.appendChild(buildFixedSlotCard({ key: 'hero', label: 'Zdjęcie główne (Hero)', hint: 'Widoczne na górze strony głównej.' }, content.hero, 'photoHidden', content.hero, 'photoSize', 420));
  grid.appendChild(buildPhotoStyleFields(content.hero, 'photoShape', 'photoFit', 'circle', 'cover'));
  renderParagraphEditor('heroBodyEditor', content.hero.body, renderHero);
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

  // Each section renders independently — if one throws (e.g. unexpected
  // content shape), the rest still load instead of leaving the whole panel
  // blank, and the failure is visible instead of silently breaking Save.
  const sections = [
    ['Kolejność w menu', renderSectionOrder],
    ['Strony niestandardowe', renderCustomPages],
    ['Logo i nazwa marki', renderBrand],
    ['Sekcja główna (Hero)', renderHero],
    ['Wygląd', renderTheme],
    ['O nas — akapity', renderAboutBody],
    ['O rasie — akapity', renderBreedBody],
    ['Nasze psy', renderDogsEditor],
    ['Szczenięta — akapity', renderLittersIntroBody],
    ['Szczenięta / mioty', renderLittersEditor],
    ['Kontakt', renderContactEditor],
    ['Wszystkie teksty', renderTranslationsEditor],
  ];
  const failures = [];
  sections.forEach(([label, fn]) => {
    try { fn(); } catch (err) {
      console.error(`Sekcja "${label}" nie wczytała się:`, err);
      failures.push(label);
    }
  });
  if (failures.length) {
    setAuthStatus('Połączono, ale nie wczytały się: ' + failures.join(', ') + '. Odśwież stronę (Ctrl+Shift+R) — jeśli to nie pomoże, daj znać.', 'err');
  }

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

// ---- Menu order ----
// The site is multiple pages now (each nav item is its own .html page), so
// this reorders the nav links themselves rather than sections on one page.
// Built-in pages always exist as real .html files; custom pages (added
// below, under "Strony niestandardowe") all share page.html and are
// identified by their own id. Either kind can be added to or removed
// from navOrder — "removing" a built-in page just hides its nav link,
// since the page itself can't be deleted; removing a custom page here
// only drops it from the menu (deleting it outright happens in its own
// editor, which also cleans up navOrder for you).
const BUILTIN_SECTION_LABELS = {
  about: 'O nas',
  breed: 'O rasie',
  dogs: 'Nasze psy',
  litters: 'Szczenięta',
};
function resolveSectionLabel(key) {
  if (BUILTIN_SECTION_LABELS[key]) return BUILTIN_SECTION_LABELS[key];
  const page = (content.customPages || []).find(p => p.id === key);
  if (page) return (page.navLabel && page.navLabel.pl) || page.slug || '(bez nazwy)';
  return key;
}
function renderSectionOrder() {
  const el = document.getElementById('sectionOrderEditor');
  el.innerHTML = '<div class="order-list"></div>';
  const list = el.querySelector('.order-list');
  content.navOrder.forEach((key, index) => {
    const row = document.createElement('div');
    row.className = 'order-row';
    row.innerHTML = `
      <span class="order-label">${index + 1}. ${escapeHtml(resolveSectionLabel(key))}</span>
      <div class="order-actions">
        <button type="button" class="btn-small" data-act="up">↑</button>
        <button type="button" class="btn-small" data-act="down">↓</button>
        <button type="button" class="btn-small danger" data-act="remove">Usuń z menu</button>
      </div>
    `;
    row.querySelector('[data-act="up"]').addEventListener('click', () => moveItem(content.navOrder, index, -1, renderSectionOrder));
    row.querySelector('[data-act="down"]').addEventListener('click', () => moveItem(content.navOrder, index, 1, renderSectionOrder));
    row.querySelector('[data-act="remove"]').addEventListener('click', () => {
      content.navOrder.splice(index, 1);
      renderSectionOrder();
    });
    list.appendChild(row);
  });

  const available = [];
  Object.keys(BUILTIN_SECTION_LABELS).forEach(key => {
    if (!content.navOrder.includes(key)) available.push({ key, label: BUILTIN_SECTION_LABELS[key] });
  });
  (content.customPages || []).forEach(page => {
    if (!content.navOrder.includes(page.id)) available.push({ key: page.id, label: (page.navLabel && page.navLabel.pl) || page.slug || '(bez nazwy)' });
  });

  const addWrap = document.createElement('div');
  addWrap.className = 'order-add-wrap';
  if (available.length) {
    addWrap.innerHTML = `
      <select id="sectionOrderAddSelect">${available.map(a => `<option value="${a.key}">${escapeHtml(a.label)}</option>`).join('')}</select>
      <button type="button" class="btn-small" id="sectionOrderAddBtn">+ Dodaj do menu</button>
    `;
    addWrap.querySelector('#sectionOrderAddBtn').addEventListener('click', () => {
      content.navOrder.push(document.getElementById('sectionOrderAddSelect').value);
      renderSectionOrder();
    });
  } else {
    addWrap.innerHTML = `<p class="slot-hint">Wszystkie sekcje są już w menu.</p>`;
  }
  el.appendChild(addWrap);
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
    <div class="repeat-row">
      <div><label>Nazwa marki (nagłówek i stopka)</label><input id="brandNameInput" value="${escapeAttr(content.site.brandName)}"></div>
      <div><label>Rozmiar logo (px)</label><input type="number" min="20" max="120" id="logoSizeInput" value="${(content.site.logoSize || 42)}"></div>
    </div>
  `;
  el.appendChild(buildPhotoStyleFields(content.site, 'logoShape', 'logoFit', 'square', 'contain'));
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
// Reads an input's value by id, or throws a clear error naming which
// section failed to load instead of a bare "Cannot read properties of
// null" — this happens if that section's render() call failed earlier
// (see enterEditor) or a stale cached page is missing the field.
function getFieldValue(id, sectionLabel) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Sekcja "${sectionLabel}" nie wczytała się poprawnie — odśwież stronę (Ctrl+Shift+R) i spróbuj ponownie.`);
  return el.value;
}

function collectBrand() {
  return {
    brandName: getFieldValue('brandNameInput', 'Logo i nazwa marki'),
    logoSize: Number(getFieldValue('logoSizeInput', 'Logo i nazwa marki')) || 42,
    logoShape: content.site.logoShape,
    logoFit: content.site.logoFit,
  };
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
  COLOR_FIELDS.forEach(f => { colors[f.key] = getFieldValue(`color-${f.key}`, 'Wygląd'); });
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
// Toggles `marker` around the textarea's current selection — wraps it if
// not already wrapped, unwraps it if it is (whether the selection sits
// just inside the markers, or includes them). Without this toggle,
// clicking the same button twice on the same text stacks markers
// (**** instead of **) and breaks parseRichText's output.
function wrapSelection(textarea, marker) {
  const start = textarea.selectionStart, end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end);
  const before = value.slice(Math.max(0, start - marker.length), start);
  const after = value.slice(end, end + marker.length);
  let newValue, newStart, newEnd;

  if (selected && before === marker && after === marker) {
    newValue = value.slice(0, start - marker.length) + selected + value.slice(end + marker.length);
    newStart = start - marker.length;
    newEnd = newStart + selected.length;
  } else if (selected.length >= marker.length * 2 && selected.startsWith(marker) && selected.endsWith(marker)) {
    const inner = selected.slice(marker.length, selected.length - marker.length);
    newValue = value.slice(0, start) + inner + value.slice(end);
    newStart = start;
    newEnd = start + inner.length;
  } else {
    const text = selected || 'tekst';
    newValue = value.slice(0, start) + marker + text + marker + value.slice(end);
    newStart = start + marker.length;
    newEnd = newStart + text.length;
  }

  textarea.value = newValue;
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  textarea.focus();
  textarea.setSelectionRange(newStart, newEnd);
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
          <label class="checkbox-label" style="font-size:0.85rem"><input type="checkbox" data-act="hidden"${block.hidden ? ' checked' : ''}> Ukryty</label>
          <button type="button" class="btn-small" data-act="up">↑</button>
          <button type="button" class="btn-small" data-act="down">↓</button>
          <button type="button" class="btn-small danger" data-act="remove">Usuń</button>
        </div>
      </div>
      <div class="repeat-row">
        <div>
          <label>Nagłówek nad akapitem (PL, opcjonalnie)</label>
          <div class="rt-toolbar" data-target="heading.pl">
            <button type="button" class="btn-small" data-fmt="**" title="Pogrubienie"><strong>B</strong></button>
            <button type="button" class="btn-small" data-fmt="*" title="Kursywa"><em>I</em></button>
          </div>
          <input data-f="heading.pl" value="${escapeAttr(block.heading.pl)}">
        </div>
        <div>
          <label>Heading above paragraph (EN, optional)</label>
          <div class="rt-toolbar" data-target="heading.en">
            <button type="button" class="btn-small" data-fmt="**" title="Bold"><strong>B</strong></button>
            <button type="button" class="btn-small" data-fmt="*" title="Italic"><em>I</em></button>
          </div>
          <input data-f="heading.en" value="${escapeAttr(block.heading.en)}">
        </div>
      </div>
      <div class="repeat-row">
        <div><label>Czcionka nagłówka</label><select data-f="headingFont">${fontSelectHtml(block.headingFont)}</select></div>
        <div><label>Czcionka akapitu</label><select data-f="textFont">${fontSelectHtml(block.textFont)}</select></div>
      </div>
      <div class="repeat-row">
        <div>
          <label>Tekst (PL)</label>
          <div class="rt-toolbar" data-target="text.pl">
            <button type="button" class="btn-small" data-fmt="**" title="Pogrubienie"><strong>B</strong></button>
            <button type="button" class="btn-small" data-fmt="*" title="Kursywa"><em>I</em></button>
            <button type="button" class="btn-small" data-fmt="++" title="Podkreślenie"><u>U</u></button>
          </div>
          <textarea data-f="text.pl">${escapeHtml(block.text.pl)}</textarea>
        </div>
        <div>
          <label>Text (EN)</label>
          <div class="rt-toolbar" data-target="text.en">
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
      const field = row.querySelector(`[data-f="${toolbar.dataset.target}"]`);
      toolbar.querySelectorAll('[data-fmt]').forEach(btn => {
        btn.addEventListener('click', () => wrapSelection(field, btn.dataset.fmt));
      });
    });
    row.appendChild(buildCardEditor(block));
    row.appendChild(buildPhotoEditor(block, rerender));
    row.appendChild(buildBulletsEditor(block, rerender));
    row.querySelector('[data-act="hidden"]').addEventListener('change', e => { block.hidden = e.target.checked; });
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

// Optional card background/border for a block.
function buildCardEditor(block) {
  if (!block.card) block.card = { enabled: false, background: '#FFFDF9', borderColor: '#E0D3B8', borderWidth: 1 };
  const wrap = document.createElement('div');
  wrap.className = 'style-wrap';
  wrap.innerHTML = `
    <label class="checkbox-label"><input type="checkbox" data-cf="enabled"${block.card.enabled ? ' checked' : ''}> Tło i obramowanie (karta)</label>
    <div class="repeat-row style-fields"${block.card.enabled ? '' : ' hidden'}>
      <div class="color-field"><input type="color" data-cf="background" value="${block.card.background}"><label>Tło</label></div>
      <div class="color-field"><input type="color" data-cf="borderColor" value="${block.card.borderColor}"><label>Obramowanie</label></div>
      <div><label>Grubość obramowania (px)</label><input type="number" min="0" max="12" data-cf="borderWidth" value="${block.card.borderWidth}"></div>
    </div>
  `;
  const fieldsWrap = wrap.querySelector('.style-fields');
  wrap.querySelectorAll('[data-cf]').forEach(input => {
    input.addEventListener('input', () => {
      const key = input.dataset.cf;
      if (input.type === 'checkbox') {
        block.card.enabled = input.checked;
        fieldsWrap.hidden = !input.checked;
      } else if (input.type === 'number') {
        block.card[key] = Number(input.value) || 0;
      } else {
        block.card[key] = input.value;
      }
    });
  });
  return wrap;
}

// Optional photo for a block, with position (left/right/top/bottom) and
// text alignment. Reuses the same upload/remove/preview helpers as the
// fixed hero/about slots and per-dog photos, keyed by the block's own id.
function buildPhotoEditor(block, rerenderBlock) {
  if (!block.photo) block.photo = { enabled: false, mode: 'single', position: 'left', textAlign: 'left', count: 3 };
  if (block.photo.mode === undefined) block.photo.mode = 'single';
  if (block.photo.count === undefined) block.photo.count = 3;
  if (!block.id) block.id = 'block-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  const isCollage = block.photo.mode === 'collage';
  const slotCount = isCollage ? block.photo.count : 1;

  const wrap = document.createElement('div');
  wrap.className = 'style-wrap';
  wrap.innerHTML = `
    <label class="checkbox-label"><input type="checkbox" data-pf="enabled"${block.photo.enabled ? ' checked' : ''}> Dodaj zdjęcie do akapitu</label>
    <div class="style-fields"${block.photo.enabled ? '' : ' hidden'}>
      <div class="repeat-row">
        <div><label>Tryb</label>
          <select data-pf-rerender="mode">
            <option value="single"${!isCollage ? ' selected' : ''}>Pojedyncze zdjęcie</option>
            <option value="collage"${isCollage ? ' selected' : ''}>Kolaż (kilka zdjęć)</option>
          </select>
        </div>
        <div${isCollage ? '' : ' hidden'}>
          <label>Liczba zdjęć</label>
          <select data-pf-rerender="count">${[2, 3, 4, 5].map(n => `<option value="${n}"${block.photo.count === n ? ' selected' : ''}>${n}</option>`).join('')}</select>
        </div>
      </div>
      <div class="repeat-row">
        <div><label>Pozycja</label>
          <select data-pf-rerender="position">
            <option value="left"${block.photo.position === 'left' ? ' selected' : ''}>Lewo</option>
            <option value="right"${block.photo.position === 'right' ? ' selected' : ''}>Prawo</option>
            <option value="top"${block.photo.position === 'top' ? ' selected' : ''}>Góra</option>
            <option value="bottom"${block.photo.position === 'bottom' ? ' selected' : ''}>Dół</option>
          </select>
        </div>
        <div><label>Wyrównanie tekstu</label>
          <select data-pf="textAlign">
            <option value="left"${block.photo.textAlign === 'left' ? ' selected' : ''}>Do lewej</option>
            <option value="center"${block.photo.textAlign === 'center' ? ' selected' : ''}>Wyśrodkowany</option>
            <option value="right"${block.photo.textAlign === 'right' ? ' selected' : ''}>Do prawej</option>
          </select>
        </div>
      </div>
      <div class="repeat-row single"${block.photo.position === 'top' || block.photo.position === 'bottom' ? ' hidden' : ''}>
        <div><label>Rozmiar (px) — tylko dla pozycji Lewo/Prawo</label><input type="number" min="60" max="500" data-pf="size" value="${block.photo.size || (isCollage ? 200 : 120)}"></div>
      </div>
      <div class="photo-upload-grid"></div>
    </div>
  `;
  const fieldsWrap = wrap.querySelector('.style-fields');
  wrap.querySelector('[data-pf="enabled"]').addEventListener('input', e => {
    block.photo.enabled = e.target.checked;
    fieldsWrap.hidden = !e.target.checked;
  });
  wrap.querySelectorAll('[data-pf-rerender]').forEach(select => {
    select.addEventListener('change', () => {
      const key = select.dataset.pfRerender;
      block.photo[key] = key === 'count' ? Number(select.value) : select.value;
      rerenderBlock();
    });
  });
  wrap.querySelectorAll('select[data-pf]').forEach(select => {
    select.addEventListener('input', () => { block.photo[select.dataset.pf] = select.value; });
  });
  const sizeInput = wrap.querySelector('input[data-pf="size"]');
  if (sizeInput) sizeInput.addEventListener('input', () => { block.photo.size = Number(sizeInput.value) || (isCollage ? 200 : 120); });

  const uploadGrid = wrap.querySelector('.photo-upload-grid');
  uploadGrid.className = 'photo-upload-grid' + (isCollage ? ' is-collage' : '');
  for (let i = 1; i <= slotCount; i++) {
    const path = isCollage ? `images/${block.id}-${i}.jpg` : `images/${block.id}.jpg`;
    const slotEl = document.createElement('div');
    slotEl.className = 'photo-upload-slot';
    slotEl.innerHTML = `
      ${isCollage ? `<p class="slot-hint">Zdjęcie ${i}</p>` : ''}
      <div class="dog-photo-row">
        <div class="dog-photo-preview block-photo-preview">Brak</div>
        <input type="file" accept="image/*" style="flex:1">
        <button type="button" class="btn-small" data-act="upload">Wgraj</button>
        <button type="button" class="btn-small danger" data-act="remove">Usuń</button>
      </div>
      <p class="slot-status"></p>
    `;
    const preview = slotEl.querySelector('.block-photo-preview');
    const fileInput = slotEl.querySelector('input[type="file"]');
    const status = slotEl.querySelector('.slot-status');
    loadPreviewInto(preview, path);
    slotEl.querySelector('[data-act="upload"]').addEventListener('click', () => {
      if (!fileInput.files[0]) { status.textContent = 'Najpierw wybierz plik.'; status.className = 'slot-status err'; return; }
      uploadPhoto(path, fileInput.files[0], status, preview, () => { fileInput.value = ''; });
    });
    slotEl.querySelector('[data-act="remove"]').addEventListener('click', () => removePhoto(path, status, preview));
    uploadGrid.appendChild(slotEl);
  }
  return wrap;
}

// Optional bullet list under a block's paragraph. Each bullet is its own
// PL/EN pair with the same bold/italic/underline toolbar as the paragraph.
function buildBulletsEditor(block, rerenderBlock) {
  if (!block.bullets) block.bullets = [];
  const wrap = document.createElement('div');
  wrap.className = 'bullets-wrap';
  const label = document.createElement('p');
  label.className = 't-key-label';
  label.textContent = 'Wypunktowanie (opcjonalnie)';
  wrap.appendChild(label);

  block.bullets.forEach((bullet, bIndex) => {
    const bRow = document.createElement('div');
    bRow.className = 'bullet-row';
    bRow.innerHTML = `
      <div class="bullet-col">
        <div class="rt-toolbar-mini">
          <button type="button" class="btn-small" data-fmt="**"><strong>B</strong></button>
          <button type="button" class="btn-small" data-fmt="*"><em>I</em></button>
          <button type="button" class="btn-small" data-fmt="++"><u>U</u></button>
        </div>
        <input data-bf="pl" value="${escapeAttr(bullet.pl)}" placeholder="Punkt (PL)">
      </div>
      <div class="bullet-col">
        <div class="rt-toolbar-mini">
          <button type="button" class="btn-small" data-fmt="**"><strong>B</strong></button>
          <button type="button" class="btn-small" data-fmt="*"><em>I</em></button>
          <button type="button" class="btn-small" data-fmt="++"><u>U</u></button>
        </div>
        <input data-bf="en" value="${escapeAttr(bullet.en)}" placeholder="Point (EN)">
      </div>
      <div class="bullet-actions">
        <button type="button" class="btn-small" data-act="up">↑</button>
        <button type="button" class="btn-small" data-act="down">↓</button>
        <button type="button" class="btn-small danger" data-act="remove">✕</button>
      </div>
    `;
    bRow.querySelectorAll('[data-bf]').forEach(input => {
      input.addEventListener('input', () => { bullet[input.dataset.bf] = input.value; });
      const toolbar = input.previousElementSibling;
      toolbar.querySelectorAll('[data-fmt]').forEach(btn => {
        btn.addEventListener('click', () => wrapSelection(input, btn.dataset.fmt));
      });
    });
    bRow.querySelector('[data-act="up"]').addEventListener('click', () => moveItem(block.bullets, bIndex, -1, rerenderBlock));
    bRow.querySelector('[data-act="down"]').addEventListener('click', () => moveItem(block.bullets, bIndex, 1, rerenderBlock));
    bRow.querySelector('[data-act="remove"]').addEventListener('click', () => {
      block.bullets.splice(bIndex, 1);
      rerenderBlock();
    });
    wrap.appendChild(bRow);
  });

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn-small';
  addBtn.textContent = '+ Dodaj punkt';
  addBtn.addEventListener('click', () => {
    block.bullets.push({ pl: '', en: '' });
    rerenderBlock();
  });
  wrap.appendChild(addBtn);
  return wrap;
}
function renderAboutBody() {
  renderKeyFields('aboutFieldsEditor', SECTION_KEY_GROUPS.about);
  const grid = document.getElementById('aboutSlotGrid');
  grid.innerHTML = '';
  grid.appendChild(buildFixedSlotCard({ key: 'about', label: 'Zdjęcie „O nas”', hint: 'Sekcja o Karolinie i Pawle.' }, content.about, 'photoHidden', content.about, 'photoSize', 480));
  grid.appendChild(buildPhotoStyleFields(content.about, 'photoShape', 'photoFit', 'rounded', 'cover'));
  renderParagraphEditor('aboutBodyEditor', content.about.body, renderAboutBody);
}
function renderBreedBody() {
  renderKeyFields('breedFieldsEditor', SECTION_KEY_GROUPS.breed);
  if (!content.breed.facts) content.breed.facts = [];
  renderFactListEditor('breedFactsEditor', content.breed.facts, renderBreedBody);
  renderParagraphEditor('breedBodyEditor', content.breed.body, renderBreedBody);
}
function renderLittersIntroBody() {
  if (!content.littersIntro) content.littersIntro = { body: [] }; // older saved content.json may predate this field
  renderKeyFields('littersFieldsEditor', SECTION_KEY_GROUPS.litters);
  renderParagraphEditor('littersIntroBodyEditor', content.littersIntro.body, renderLittersIntroBody);
}

// ---- Custom pages ("Strony niestandardowe") ----
// Fully user-defined pages, all served by the shared page.html template
// (see that file's own comment) and identified by ?slug=. Each carries its
// own nav label, heading, and the same content-block body used elsewhere,
// so a site owner can add a genuinely new section without any code change.
function slugify(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}
function newCustomPage() {
  return {
    id: 'custom-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    slug: '',
    navLabel: { pl: '', en: '' },
    heading: { pl: '', en: '' },
    body: [],
  };
}
function renderCustomPages() {
  if (!content.customPages) content.customPages = [];
  const el = document.getElementById('customPagesEditor');
  el.innerHTML = '';
  content.customPages.forEach((page, index) => {
    const row = buildCustomPageRow(page, index);
    el.appendChild(row); // must be attached before the nested renderParagraphEditor call below,
    // since that looks its container up by document.getElementById — which can't find an element
    // that only exists in a detached (not-yet-appended) subtree.
    renderParagraphEditor(`customPageBodyEditor-${page.id}`, page.body, renderCustomPages);
  });
}
function buildCustomPageRow(page, index) {
  if (!page.body) page.body = [];
  if (!page.slug) page.slug = slugify(page.navLabel.pl || page.heading.pl);
  if (!page.bannerSubtitle) page.bannerSubtitle = { pl: '', en: '' };
  const row = document.createElement('div');
  row.className = 'repeat-item';
  row.innerHTML = `
    <div class="repeat-item-head">
      <span class="repeat-title">${escapeHtml((page.navLabel && page.navLabel.pl) || page.heading.pl || 'Nowa strona')}</span>
      <div class="repeat-item-actions">
        <button type="button" class="btn-small" data-act="up">↑</button>
        <button type="button" class="btn-small" data-act="down">↓</button>
        <button type="button" class="btn-small danger" data-act="remove">Usuń stronę</button>
      </div>
    </div>
    <div class="repeat-row">
      <div><label>Nazwa w menu (PL)</label><input data-f="navLabel.pl" value="${escapeAttr(page.navLabel.pl)}"></div>
      <div><label>Menu label (EN)</label><input data-f="navLabel.en" value="${escapeAttr(page.navLabel.en)}"></div>
    </div>
    <div class="repeat-row">
      <div><label>Nagłówek strony (PL)</label><input data-f="heading.pl" value="${escapeAttr(page.heading.pl)}"></div>
      <div><label>Page heading (EN)</label><input data-f="heading.en" value="${escapeAttr(page.heading.en)}"></div>
    </div>
    <div class="repeat-row single">
      <div>
        <label>Adres strony (slug)</label>
        <input data-f="slug" value="${escapeAttr(page.slug)}" placeholder="np. faq">
        <p class="slot-hint">Adres: page.html?slug=${escapeHtml(page.slug || '…')}</p>
      </div>
    </div>
    <label class="checkbox-label" style="margin-top:14px">
      <input type="checkbox" data-act="showBanner"${page.showBanner ? ' checked' : ''}>
      Pokaż baner z tłem (nagłówek i podtytuł na zdjęciu)
    </label>
    <div class="repeat-row"${page.showBanner ? '' : ' hidden'} id="bannerSubtitleRow-${page.id}">
      <div><label>Podtytuł banera (PL)</label><input data-f="bannerSubtitle.pl" value="${escapeAttr((page.bannerSubtitle && page.bannerSubtitle.pl) || '')}"></div>
      <div><label>Banner subtitle (EN)</label><input data-f="bannerSubtitle.en" value="${escapeAttr((page.bannerSubtitle && page.bannerSubtitle.en) || '')}"></div>
    </div>
    <div id="bannerPhotoSlot-${page.id}"${page.showBanner ? '' : ' hidden'}></div>
    <label class="checkbox-label" style="margin-top:14px">
      <input type="checkbox" data-act="showContactBlock"${page.showContactBlock ? ' checked' : ''}>
      Pokaż na tej stronie dane kontaktowe (lokalizacja, e-mail, social media, przycisk formularza)
    </label>
    <label class="checkbox-label" style="margin-top:8px">
      <input type="checkbox" data-act="showContactForm"${page.showContactForm ? ' checked' : ''}>
      Pokaż na tej stronie krótki formularz kontaktowy (imię, e-mail, wiadomość)
    </label>
    <div id="customPageBodyEditor-${page.id}"></div>
    <button type="button" class="btn-small" data-act="add-para">+ Dodaj akapit</button>
  `;
  row.querySelectorAll('[data-f]').forEach(input => {
    input.addEventListener('input', () => {
      const path = input.dataset.f.split('.');
      if (path.length === 1) page[path[0]] = input.value;
      else page[path[0]][path[1]] = input.value;
    });
  });
  row.querySelector(`#bannerPhotoSlot-${page.id}`).appendChild(
    buildFixedSlotCard({ key: `${page.id}-banner`, label: 'Zdjęcie tła banera', hint: 'Szerokie zdjęcie, np. 1600×600 px.' }));
  row.querySelector('[data-act="showBanner"]').addEventListener('change', e => {
    page.showBanner = e.target.checked;
    row.querySelector(`#bannerSubtitleRow-${page.id}`).hidden = !e.target.checked;
    row.querySelector(`#bannerPhotoSlot-${page.id}`).hidden = !e.target.checked;
  });
  row.querySelector('[data-act="showContactBlock"]').addEventListener('change', e => {
    page.showContactBlock = e.target.checked;
  });
  row.querySelector('[data-act="showContactForm"]').addEventListener('change', e => {
    page.showContactForm = e.target.checked;
  });
  row.querySelector('[data-act="add-para"]').addEventListener('click', () => {
    page.body.push(newContentBlock());
    renderCustomPages();
  });
  row.querySelector('[data-act="up"]').addEventListener('click', () => moveItem(content.customPages, index, -1, renderCustomPages));
  row.querySelector('[data-act="down"]').addEventListener('click', () => moveItem(content.customPages, index, 1, renderCustomPages));
  row.querySelector('[data-act="remove"]').addEventListener('click', () => {
    if (!confirm('Usunąć tę stronę na stałe? Zostanie też usunięta z menu.')) return;
    content.customPages.splice(index, 1);
    content.navOrder = content.navOrder.filter(k => k !== page.id);
    renderCustomPages();
    renderSectionOrder();
  });
  return row;
}

// ---- Dogs editor ----
function renderDogsEditor() {
  renderKeyFields('dogsFieldsEditor', SECTION_KEY_GROUPS.dogs);
  if (!content.dogsSection) content.dogsSection = { photoSize: 200 };
  document.getElementById('dogsPhotoSize').value = content.dogsSection.photoSize;
  const dogsStyleWrap = document.getElementById('dogsPhotoStyleFields');
  dogsStyleWrap.innerHTML = '';
  dogsStyleWrap.appendChild(buildPhotoStyleFields(content.dogsSection, 'shape', 'fit', 'rounded', 'cover'));
  const el = document.getElementById('dogsEditor');
  el.innerHTML = '';
  content.dogs.forEach((dog, index) => {
    const row = buildDogRow(dog, index);
    el.appendChild(row); // attach before the nested fact-list editor, which looks up its container by id
    renderFactListEditor(`dogExtra-${dog.id}`, dog.extra, renderDogsEditor);
  });
}
function buildDogRow(dog, index) {
  if (!dog.extra) dog.extra = [];
  const row = document.createElement('div');
  row.className = 'repeat-item';
  row.innerHTML = `
    <div class="repeat-item-head">
      <span class="repeat-title">Pies ${index + 1}</span>
      <div class="repeat-item-actions">
        <label class="checkbox-label" style="font-size:0.85rem"><input type="checkbox" data-act="hidden"${dog.hidden ? ' checked' : ''}> Ukryty</label>
        <button type="button" class="btn-small" data-act="up">↑</button>
        <button type="button" class="btn-small" data-act="down">↓</button>
        <button type="button" class="btn-small danger" data-act="remove">Usuń</button>
      </div>
    </div>
    <div class="repeat-row single">
      <div><label>Liczba zdjęć (karuzela, jeśli więcej niż 1)</label>
        <select data-act="photoCount">${[1, 2, 3, 4, 5].map(n => `<option value="${n}"${(dog.photoCount || 1) === n ? ' selected' : ''}>${n}</option>`).join('')}</select>
      </div>
    </div>
    <div class="photo-upload-grid is-collage" id="dogPhotos-${dog.id}"></div>
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
    <div class="bullets-wrap">
      <p class="t-key-label">Dodatkowe pola (opcjonalnie, np. rasa, waga, badania)</p>
      <div id="dogExtra-${dog.id}"></div>
      <button type="button" class="btn-small" data-act="add-extra">+ Dodaj pole</button>
    </div>
  `;
  const photoGrid = row.querySelector(`#dogPhotos-${dog.id}`);
  function renderDogPhotoSlots() {
    photoGrid.innerHTML = '';
    for (let i = 1; i <= (dog.photoCount || 1); i++) {
      const key = i === 1 ? dog.id : `${dog.id}-${i}`;
      photoGrid.appendChild(buildFixedSlotCard({ key, label: `Zdjęcie ${i}`, hint: '' }));
    }
  }
  renderDogPhotoSlots();
  row.querySelector('[data-act="photoCount"]').addEventListener('change', e => {
    dog.photoCount = Number(e.target.value);
    renderDogPhotoSlots();
  });

  row.querySelectorAll('[data-f]').forEach(input => {
    input.addEventListener('input', () => {
      const [group, lang] = input.dataset.f.split('.');
      dog[group][lang] = input.value;
    });
  });
  row.querySelector('[data-act="hidden"]').addEventListener('change', e => { dog.hidden = e.target.checked; });
  row.querySelector('[data-act="up"]').addEventListener('click', () => moveItem(content.dogs, index, -1, renderDogsEditor));
  row.querySelector('[data-act="down"]').addEventListener('click', () => moveItem(content.dogs, index, 1, renderDogsEditor));
  row.querySelector('[data-act="remove"]').addEventListener('click', () => {
    if (!confirm('Usunąć tego psa ze strony?')) return;
    content.dogs.splice(index, 1);
    renderDogsEditor();
  });
  row.querySelector('[data-act="add-extra"]').addEventListener('click', () => {
    dog.extra.push({ label: { pl: '', en: '' }, value: { pl: '', en: '' } });
    renderDogsEditor();
  });
  return row;
}
function newContentBlock() {
  return {
    id: 'block-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    heading: { pl: '', en: '' }, headingFont: 'default', textFont: 'default', text: { pl: '', en: '' }, bullets: [],
    card: { enabled: false, background: '#FFFDF9', borderColor: '#E0D3B8', borderWidth: 1 },
    photo: { enabled: false, mode: 'single', position: 'left', textAlign: 'left', count: 3 },
  };
}
document.getElementById('addAboutParaBtn').addEventListener('click', () => {
  content.about.body.push(newContentBlock());
  renderAboutBody();
});
document.getElementById('addBreedParaBtn').addEventListener('click', () => {
  content.breed.body.push(newContentBlock());
  renderBreedBody();
});
document.getElementById('addBreedFactBtn').addEventListener('click', () => {
  content.breed.facts.push({ label: { pl: '', en: '' }, value: { pl: '', en: '' } });
  renderBreedBody();
});
document.getElementById('addHeroParaBtn').addEventListener('click', () => {
  content.hero.body.push(newContentBlock());
  renderHero();
});
document.getElementById('addLittersIntroParaBtn').addEventListener('click', () => {
  content.littersIntro.body.push(newContentBlock());
  renderLittersIntroBody();
});
document.getElementById('addCustomPageBtn').addEventListener('click', () => {
  const page = newCustomPage();
  content.customPages.push(page);
  content.navOrder.push(page.id); // a newly added page shows up in the menu right away
  renderCustomPages();
  renderSectionOrder();
});

document.getElementById('addDogBtn').addEventListener('click', () => {
  content.dogs.push({ id: `dog-${Date.now()}`, name: { pl: '', en: '' }, role: { pl: '', en: '' }, bio: { pl: '', en: '' } });
  renderDogsEditor();
});
document.getElementById('dogsPhotoSize').addEventListener('input', e => {
  content.dogsSection.photoSize = Number(e.target.value) || 200;
});

// ---- Litters editor ----
const STATUS_OPTIONS = [
  { value: 'available', label: 'Dostępny' },
  { value: 'expecting', label: 'Oczekiwany' },
  { value: 'reserved', label: 'Zarezerwowany' },
  { value: 'previous', label: 'Poprzedni miot' },
];
function renderLittersEditor() {
  if (!content.littersSection) content.littersSection = { photoSize: 160 };
  document.getElementById('littersPhotoSize').value = content.littersSection.photoSize;
  const littersStyleWrap = document.getElementById('littersPhotoStyleFields');
  littersStyleWrap.innerHTML = '';
  littersStyleWrap.appendChild(buildPhotoStyleFields(content.littersSection, 'shape', 'fit', 'rounded', 'cover'));
  const el = document.getElementById('littersEditor');
  el.innerHTML = '';
  content.litters.forEach((litter, index) => {
    const row = buildLitterRow(litter, index);
    el.appendChild(row); // attach before the nested fact-list editor, which looks up its container by id
    renderFactListEditor(`litterExtra-${litter.id}`, litter.extra, renderLittersEditor);
  });
}
function buildLitterRow(litter, index) {
  if (litter.link === undefined) litter.link = ''; // older litters predate this field
  if (!litter.extra) litter.extra = [];
  const row = document.createElement('div');
  row.className = 'repeat-item';
  row.innerHTML = `
    <div class="repeat-item-head">
      <span class="repeat-title">Miot ${index + 1}</span>
      <div class="repeat-item-actions">
        <label class="checkbox-label" style="font-size:0.85rem"><input type="checkbox" data-act="hidden"${litter.hidden ? ' checked' : ''}> Ukryty</label>
        <button type="button" class="btn-small" data-act="up">↑</button>
        <button type="button" class="btn-small" data-act="down">↓</button>
        <button type="button" class="btn-small danger" data-act="remove">Usuń</button>
      </div>
    </div>
    <div class="repeat-row">
      <div><label>Status</label>
        <select data-f="status">${STATUS_OPTIONS.map(s => `<option value="${s.value}"${litter.status === s.value ? ' selected' : ''}>${s.label}</option>`).join('')}</select>
      </div>
      <div><label>Liczba zdjęć (0 = brak)</label>
        <select data-act="photoCount">${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}"${(litter.photoCount || 0) === n ? ' selected' : ''}>${n}</option>`).join('')}</select>
      </div>
    </div>
    <div class="photo-upload-grid is-collage" id="litterPhotos-${litter.id}"></div>
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
    <div class="repeat-row single">
      <div><label>Link przycisku (opcjonalnie — np. formularz Google; puste = strona kontaktowa)</label><input data-f="link" value="${escapeAttr(litter.link)}" placeholder="https://..."></div>
    </div>
    <div class="bullets-wrap">
      <p class="t-key-label">Dodatkowe pola (opcjonalnie, np. data urodzenia, liczba szczeniąt)</p>
      <div id="litterExtra-${litter.id}"></div>
      <button type="button" class="btn-small" data-act="add-extra">+ Dodaj pole</button>
    </div>
  `;
  row.querySelectorAll('[data-f]').forEach(input => {
    input.addEventListener('input', () => {
      const path = input.dataset.f.split('.');
      if (path.length === 1) litter[path[0]] = input.value;
      else litter[path[0]][path[1]] = input.value;
    });
  });
  const litterPhotoGrid = row.querySelector(`#litterPhotos-${litter.id}`);
  function renderLitterPhotoSlots() {
    litterPhotoGrid.innerHTML = '';
    for (let i = 1; i <= (litter.photoCount || 0); i++) {
      const key = i === 1 ? litter.id : `${litter.id}-${i}`;
      litterPhotoGrid.appendChild(buildFixedSlotCard({ key, label: `Zdjęcie ${i}`, hint: '' }));
    }
  }
  renderLitterPhotoSlots();
  row.querySelector('[data-act="photoCount"]').addEventListener('change', e => {
    litter.photoCount = Number(e.target.value);
    renderLitterPhotoSlots();
  });
  row.querySelector('[data-act="hidden"]').addEventListener('change', e => { litter.hidden = e.target.checked; });
  row.querySelector('[data-act="up"]').addEventListener('click', () => moveItem(content.litters, index, -1, renderLittersEditor));
  row.querySelector('[data-act="down"]').addEventListener('click', () => moveItem(content.litters, index, 1, renderLittersEditor));
  row.querySelector('[data-act="remove"]').addEventListener('click', () => {
    if (!confirm('Usunąć ten miot ze strony?')) return;
    content.litters.splice(index, 1);
    renderLittersEditor();
  });
  row.querySelector('[data-act="add-extra"]').addEventListener('click', () => {
    litter.extra.push({ label: { pl: '', en: '' }, value: { pl: '', en: '' } });
    renderLittersEditor();
  });
  return row;
}
document.getElementById('addLitterBtn').addEventListener('click', () => {
  content.litters.push({ id: `litter-${Date.now()}`, status: 'available', title: { pl: '', en: '' }, desc: { pl: '', en: '' }, cta: { pl: '', en: '' }, link: '' });
  renderLittersEditor();
});
document.getElementById('littersPhotoSize').addEventListener('input', e => {
  content.littersSection.photoSize = Number(e.target.value) || 160;
});

function moveItem(arr, index, delta, rerender) {
  const newIndex = index + delta;
  if (newIndex < 0 || newIndex >= arr.length) return;
  [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
  rerender();
}

// Shared shape + fit controls for any photo spot — Hero, O nas, logo,
// footer photos, dog photos, litter photos. `target[shapeKey]` is
// 'circle' | 'rounded' | 'square' (border-radius); `target[fitKey]` is
// 'cover' | 'contain' (how the image fills its frame). Returns a row to
// insert next to that spot's upload/size controls.
function buildPhotoStyleFields(target, shapeKey, fitKey, shapeDefault, fitDefault) {
  if (!target[shapeKey]) target[shapeKey] = shapeDefault || 'rounded';
  if (!target[fitKey]) target[fitKey] = fitDefault || 'cover';
  const wrap = document.createElement('div');
  wrap.className = 'repeat-row';
  wrap.style.marginTop = '8px';
  wrap.innerHTML = `
    <div><label>Kształt</label>
      <select data-act="shape">
        <option value="circle"${target[shapeKey] === 'circle' ? ' selected' : ''}>Koło</option>
        <option value="rounded"${target[shapeKey] === 'rounded' ? ' selected' : ''}>Zaokrąglony</option>
        <option value="square"${target[shapeKey] === 'square' ? ' selected' : ''}>Kwadrat (proste rogi)</option>
      </select>
    </div>
    <div><label>Dopasowanie zdjęcia</label>
      <select data-act="fit">
        <option value="cover"${target[fitKey] === 'cover' ? ' selected' : ''}>Wypełnij (przytnij)</option>
        <option value="contain"${target[fitKey] === 'contain' ? ' selected' : ''}>Zmieść w całości</option>
      </select>
    </div>
  `;
  wrap.querySelector('[data-act="shape"]').addEventListener('input', e => { target[shapeKey] = e.target.value; });
  wrap.querySelector('[data-act="fit"]').addEventListener('input', e => { target[fitKey] = e.target.value; });
  return wrap;
}
// Generic "label/value" list editor — shared by breed facts, contact extra
// details, and per-dog/per-litter extra fields, so adding a brand-new kind
// of detail anywhere never needs new code, just this one reusable editor.
function renderFactListEditor(containerId, list, rerender) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  list.forEach((item, index) => {
    if (!item.label) item.label = { pl: '', en: '' };
    if (!item.value) item.value = { pl: '', en: '' };
    const row = document.createElement('div');
    row.className = 'bullet-row';
    row.innerHTML = `
      <div class="bullet-col">
        <label class="t-key-label">Etykieta (PL / EN)</label>
        <input data-ff="label.pl" value="${escapeAttr(item.label.pl)}" placeholder="np. Lokalizacja" style="margin-bottom:4px">
        <input data-ff="label.en" value="${escapeAttr(item.label.en)}" placeholder="e.g. Location">
      </div>
      <div class="bullet-col">
        <label class="t-key-label">Wartość (PL / EN)</label>
        <input data-ff="value.pl" value="${escapeAttr(item.value.pl)}" style="margin-bottom:4px">
        <input data-ff="value.en" value="${escapeAttr(item.value.en)}">
      </div>
      <div class="bullet-actions">
        <button type="button" class="btn-small" data-act="up">↑</button>
        <button type="button" class="btn-small" data-act="down">↓</button>
        <button type="button" class="btn-small danger" data-act="remove">✕</button>
      </div>
    `;
    row.querySelectorAll('[data-ff]').forEach(input => {
      input.addEventListener('input', () => {
        const [group, lang] = input.dataset.ff.split('.');
        item[group][lang] = input.value;
      });
    });
    row.querySelector('[data-act="up"]').addEventListener('click', () => moveItem(list, index, -1, rerender));
    row.querySelector('[data-act="down"]').addEventListener('click', () => moveItem(list, index, 1, rerender));
    row.querySelector('[data-act="remove"]').addEventListener('click', () => { list.splice(index, 1); rerender(); });
    el.appendChild(row);
  });
}

// ---- Contact editor ----
function renderContactEditor() {
  renderKeyFields('contactFieldsEditor', SECTION_KEY_GROUPS.contact);
  if (!content.contact.ctaLabel) content.contact.ctaLabel = { pl: '', en: '' };
  if (!content.contact.ctaColor) content.contact.ctaColor = '#2b211a';
  if (!content.contact.ctaSize) content.contact.ctaSize = 'medium';
  if (content.contact.ctaLinkPl === undefined) content.contact.ctaLinkPl = '';
  if (content.contact.ctaLinkEn === undefined) content.contact.ctaLinkEn = '';
  if (!content.contact.footerPhotos) content.contact.footerPhotos = { enabled: false, size: 64, count: 3 };
  if (!content.contact.details) content.contact.details = [];
  const el = document.getElementById('contactEditor');
  el.innerHTML = `
    <div class="repeat-row">
      <div><label>Adres e-mail (kontaktowy)</label><input id="contact-email" value="${escapeAttr(content.contact.email)}"></div>
      <div><label>Instagram (nazwa, bez @)</label><input id="contact-social" value="${escapeAttr(content.contact.social)}"></div>
    </div>
    <div class="repeat-row">
      <div><label>Facebook (nazwa strony, bez @)</label><input id="contact-facebook" value="${escapeAttr(content.contact.facebook)}"></div>
    </div>
    <div class="repeat-row single">
      <div><label>Formspree — adres formularza (action URL) — formularz zgłoszeniowy „Wypełnij ankietę”</label><input id="contact-formAction" value="${escapeAttr(content.contact.formAction)}"></div>
    </div>
    <div class="repeat-row single">
      <div>
        <label>Web3Forms — klucz dostępu — krótki formularz kontaktowy na stronach niestandardowych</label>
        <input id="contact-web3formsKey" value="${escapeAttr(content.contact.web3formsKey)}" placeholder="wklej klucz z web3forms.com">
        <p class="slot-hint">Osobny formularz, żeby nie zużywać limitu Formspree. Darmowy klucz: wejdź na web3forms.com, podaj e-mail, skopiuj klucz.</p>
      </div>
    </div>
    <div class="style-wrap">
      <p class="t-key-label">Przycisk w stopce (prowadzi do formularza Google)</p>
      <div class="repeat-row">
        <div><label>Tekst przycisku (PL)</label><input id="contact-ctaLabelPl" value="${escapeAttr(content.contact.ctaLabel.pl)}"></div>
        <div><label>Button text (EN)</label><input id="contact-ctaLabelEn" value="${escapeAttr(content.contact.ctaLabel.en)}"></div>
      </div>
      <div class="repeat-row">
        <div class="color-field"><input type="color" id="contact-ctaColor" value="${content.contact.ctaColor}"><label for="contact-ctaColor">Kolor przycisku</label></div>
        <div><label>Rozmiar</label>
          <select id="contact-ctaSize">
            <option value="small"${content.contact.ctaSize === 'small' ? ' selected' : ''}>Mały</option>
            <option value="medium"${content.contact.ctaSize === 'medium' ? ' selected' : ''}>Średni</option>
            <option value="large"${content.contact.ctaSize === 'large' ? ' selected' : ''}>Duży</option>
          </select>
        </div>
      </div>
      <div class="repeat-row single">
        <div><label>Link (PL) — formularz Google</label><input id="contact-ctaLinkPl" value="${escapeAttr(content.contact.ctaLinkPl)}" placeholder="https://..."></div>
      </div>
      <div class="repeat-row single">
        <div><label>Link (EN) — Google form</label><input id="contact-ctaLinkEn" value="${escapeAttr(content.contact.ctaLinkEn)}" placeholder="https://..."></div>
      </div>
    </div>
    <div class="style-wrap">
      <label class="checkbox-label"><input type="checkbox" id="contact-footerPhotosEnabled"${content.contact.footerPhotos.enabled ? ' checked' : ''}> Pokaż zdjęcia w stopce (widoczne na każdej stronie)</label>
      <div class="repeat-row style-fields"${content.contact.footerPhotos.enabled ? '' : ' hidden'}>
        <div><label>Rozmiar ramki (px)</label><input type="number" min="32" max="160" id="contact-footerPhotosSize" value="${content.contact.footerPhotos.size}"></div>
        <div><label>Liczba zdjęć</label>
          <select id="contact-footerPhotosCount">${[2, 3, 4, 5].map(n => `<option value="${n}"${content.contact.footerPhotos.count === n ? ' selected' : ''}>${n}</option>`).join('')}</select>
        </div>
      </div>
      <div class="photo-upload-grid is-collage" id="footerPhotosUploadGrid" style="margin-top:10px"${content.contact.footerPhotos.enabled ? '' : ' hidden'}></div>
      <div id="footerPhotosStyleFields"${content.contact.footerPhotos.enabled ? '' : ' hidden'}></div>
    </div>
    <div class="style-wrap">
      <p class="t-key-label">Dodatkowe szczegóły kontaktowe (np. lokalizacja, telefon) — widoczne wszędzie obok e-maila</p>
      <div id="contactDetailsEditor"></div>
      <button type="button" class="btn-small" id="addContactDetailBtn">+ Dodaj szczegół</button>
    </div>
  `;
  renderFooterPhotoSlots();
  document.getElementById('footerPhotosStyleFields').appendChild(
    buildPhotoStyleFields(content.contact.footerPhotos, 'shape', 'fit', 'rounded', 'cover'));
  renderFactListEditor('contactDetailsEditor', content.contact.details, renderContactEditor);
  const fieldsWrap = el.querySelector('.style-fields');
  const uploadGrid = document.getElementById('footerPhotosUploadGrid');
  const styleFieldsWrap = document.getElementById('footerPhotosStyleFields');
  document.getElementById('contact-footerPhotosEnabled').addEventListener('change', e => {
    content.contact.footerPhotos.enabled = e.target.checked;
    fieldsWrap.hidden = uploadGrid.hidden = styleFieldsWrap.hidden = !e.target.checked;
  });
  document.getElementById('contact-footerPhotosCount').addEventListener('change', e => {
    content.contact.footerPhotos.count = Number(e.target.value);
    renderFooterPhotoSlots();
  });
  document.getElementById('addContactDetailBtn').addEventListener('click', () => {
    content.contact.details.push({ label: { pl: '', en: '' }, value: { pl: '', en: '' } });
    renderContactEditor();
  });
}
// Reuses the same fixed-slot photo uploader as Hero/O nas — one card per
// photo, named images/footer-1.jpg, footer-2.jpg, etc.
function renderFooterPhotoSlots() {
  const grid = document.getElementById('footerPhotosUploadGrid');
  grid.innerHTML = '';
  for (let i = 1; i <= content.contact.footerPhotos.count; i++) {
    grid.appendChild(buildFixedSlotCard({ key: `footer-${i}`, label: `Zdjęcie ${i}`, hint: '' }));
  }
}
function collectContact() {
  return {
    email: getFieldValue('contact-email', 'Kontakt'),
    social: getFieldValue('contact-social', 'Kontakt'),
    facebook: getFieldValue('contact-facebook', 'Kontakt'),
    formAction: getFieldValue('contact-formAction', 'Kontakt'),
    web3formsKey: getFieldValue('contact-web3formsKey', 'Kontakt'),
    ctaLabel: { pl: getFieldValue('contact-ctaLabelPl', 'Kontakt'), en: getFieldValue('contact-ctaLabelEn', 'Kontakt') },
    ctaColor: getFieldValue('contact-ctaColor', 'Kontakt'),
    ctaSize: getFieldValue('contact-ctaSize', 'Kontakt'),
    ctaLinkPl: getFieldValue('contact-ctaLinkPl', 'Kontakt'),
    ctaLinkEn: getFieldValue('contact-ctaLinkEn', 'Kontakt'),
    footerPhotos: {
      enabled: document.getElementById('contact-footerPhotosEnabled').checked,
      size: Number(getFieldValue('contact-footerPhotosSize', 'Kontakt')) || 64,
      count: Number(document.getElementById('contact-footerPhotosCount').value) || 3,
      shape: content.contact.footerPhotos.shape,
      fit: content.contact.footerPhotos.fit,
    },
    details: content.contact.details,
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
  // Scans the whole document, not just #translationsEditor, since section
  // cards (Hero, O nas, Kontakt, ...) now render their own [data-key] fields.
  document.querySelectorAll('[data-key][data-lang]').forEach(field => {
    const key = field.dataset.key;
    const lang = field.dataset.lang;
    if (!result[key]) result[key] = { pl: '', en: '' };
    result[key][lang] = field.value;
  });
  return result;
}

// ---- Auto-translate (PL <-> EN) ----
// Adds a small "→EN"/"→PL" button next to every PL/EN field pair in the
// editor, calling MyMemory's free translation API (no API key, and — unlike
// DeepL — it allows direct browser calls, which matters since this site has
// no backend to proxy the request through). A MutationObserver keeps this
// working automatically as sections render/re-render, instead of needing
// every render function updated by hand.
// MyMemory rejects anything over 500 chars per request — and does it with an
// HTTP 200 whose "translation" is literally the words "QUERY LENGTH LIMIT
// EXCEEDED...", which the old code happily wrote into the field. Longer text
// is now split on sentence boundaries into <500-char chunks, each translated
// separately and stitched back together, so long paragraphs actually work
// instead of erroring (or silently filling in the error message).
function splitIntoChunks(text, maxLen) {
  if (text.length <= maxLen) return [text];
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let current = '';
  sentences.forEach(sentence => {
    if (sentence.length > maxLen) {
      if (current) { chunks.push(current); current = ''; }
      for (let i = 0; i < sentence.length; i += maxLen) chunks.push(sentence.slice(i, i + maxLen));
      return;
    }
    if (current && (current + ' ' + sentence).length > maxLen) {
      chunks.push(current);
      current = sentence;
    } else {
      current = current ? current + ' ' + sentence : sentence;
    }
  });
  if (current) chunks.push(current);
  return chunks;
}
async function translateChunk(chunk, sourceLang, targetLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${sourceLang}|${targetLang}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Błąd serwera tłumaczeń (${res.status})`);
  const data = await res.json();
  if (data.responseStatus && String(data.responseStatus) !== '200') {
    throw new Error(data.responseDetails || `Błąd tłumaczenia (${data.responseStatus})`);
  }
  const translated = data.responseData && data.responseData.translatedText;
  if (!translated) throw new Error('Brak odpowiedzi z serwisu tłumaczeń.');
  return translated;
}
async function callTranslate(text, sourceLang, targetLang) {
  const chunks = splitIntoChunks(text, 450);
  const results = [];
  for (const chunk of chunks) {
    results.push(await translateChunk(chunk, sourceLang, targetLang));
  }
  return results.join(' ');
}
async function translateField(srcEl, targetEl, srcLang, targetLang, btn) {
  const text = srcEl.value.trim();
  if (!text) return;
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = '…';
  try {
    const translated = await callTranslate(text, srcLang, targetLang);
    // MyMemory sometimes has a bogus memory entry that just echoes the input
    // back (e.g. "Father" tagged as a PL->EN match for "father") — if the
    // "translation" is just the same text, it isn't one, so don't silently
    // overwrite the field with something useless.
    if (translated.trim().toLowerCase() === text.toLowerCase()) {
      alert('Nie udało się przetłumaczyć — usługa zwróciła ten sam tekst. Wpisz tłumaczenie ręcznie.');
    } else {
      targetEl.value = translated;
      targetEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
  } catch (err) {
    alert('Błąd tłumaczenia: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
}
// Finds the PL/EN counterpart of a field, scoped to its own repeat item (dog,
// litter, custom page, paragraph, bullet, fact row) so identically-named
// fields in other rows are never matched by mistake.
function findLangSibling(el, targetLang) {
  if (el.dataset.key !== undefined) {
    return document.querySelector(`[data-key="${el.dataset.key}"][data-lang="${targetLang}"]`);
  }
  const scope = el.closest('.repeat-item, .bullet-row, .t-key-row') || document;
  for (const attr of ['data-f', 'data-ff']) {
    const val = el.getAttribute(attr);
    if (val && (val.endsWith('.pl') || val.endsWith('.en'))) {
      return scope.querySelector(`[${attr}="${val.slice(0, -3)}.${targetLang}"]`);
    }
  }
  const bf = el.getAttribute('data-bf');
  if (bf === 'pl' || bf === 'en') return scope.querySelector(`[data-bf="${targetLang}"]`);
  return null;
}
function attachTranslateBtn(srcEl, srcLang, targetLang) {
  if (srcEl.dataset.hasTranslateBtn) return;
  const targetEl = findLangSibling(srcEl, targetLang);
  if (!targetEl) return;
  srcEl.dataset.hasTranslateBtn = '1';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-small translate-btn';
  btn.textContent = targetLang === 'en' ? '→EN' : '→PL';
  btn.title = 'Przetłumacz automatycznie';
  btn.addEventListener('click', () => translateField(srcEl, targetEl, srcLang, targetLang, btn));
  srcEl.insertAdjacentElement('afterend', btn);
}
function addTranslateButtons() {
  document.querySelectorAll('input[data-f$=".pl"], textarea[data-f$=".pl"], input[data-ff$=".pl"], textarea[data-ff$=".pl"], input[data-bf="pl"], textarea[data-bf="pl"], input[data-key][data-lang="pl"], textarea[data-key][data-lang="pl"]')
    .forEach(el => attachTranslateBtn(el, 'pl', 'en'));
  document.querySelectorAll('input[data-f$=".en"], textarea[data-f$=".en"], input[data-ff$=".en"], textarea[data-ff$=".en"], input[data-bf="en"], textarea[data-bf="en"], input[data-key][data-lang="en"], textarea[data-key][data-lang="en"]')
    .forEach(el => attachTranslateBtn(el, 'en', 'pl'));
}
let translateButtonsScheduled = false;
new MutationObserver(() => {
  if (translateButtonsScheduled) return;
  translateButtonsScheduled = true;
  requestAnimationFrame(() => { translateButtonsScheduled = false; addTranslateButtons(); });
}).observe(editorRoot, { childList: true, subtree: true });

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
