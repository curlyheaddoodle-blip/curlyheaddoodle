/* =============================================================
   CURLY HEAD DOODLE — BEHAVIOR
   =============================================================
   1. Mobile nav toggle
   2. Header background on scroll
   3. Content loading — everything text/theme/dogs/litters comes
      from data/content.json (edited by admin.html, or by hand).
      FALLBACK_CONTENT below is used only if that fetch fails, so
      the site still works even if content.json is missing/broken.
   4. Theme — colors + font pair, applied as CSS custom properties.
   5. Dogs / litters — rendered from arrays so admin.html can add,
      remove, and reorder entries with no code changes.
   6. Language switch — PL / EN, driven entirely by activeContent.
   7. Photo slots — swap in uploaded photos (images/<slot>.jpg) when
      present; slots are static (hero, about) or one per dog.
   ============================================================= */

// ---- 1. Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

primaryNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---- 2. Header background on scroll ----
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- 3. Content loading ----
const FALLBACK_CONTENT = {
  site: {
    brandName: 'Curly Head Doodle',
  },
  navOrder: ['about', 'breed', 'dogs', 'litters', 'contact'],
  theme: {
    colors: {
      bg: '#F8F2E7', bgAlt: '#F0E6D2', paper: '#FFFDF9', ink: '#2B211A',
      inkSoft: '#6B5E4F', gold: '#B8863B', goldSoft: '#E3C68A', line: '#E0D3B8',
    },
    fontPair: 'fraunces-karla',
  },
  translations: {
    page_title: { pl: 'Curly Head Doodle — Hodowla Mini Goldendoodle, Mielec', en: 'Curly Head Doodle — Mini Goldendoodle Kennel, Mielec' },
    page_description: { pl: 'Ekskluzywna, domowa hodowla psów rasy Mini Goldendoodle w Mielcu.', en: 'An exclusive, home-raised Mini Goldendoodle kennel in Mielec, Poland.' },
    nav_about: { pl: 'O nas', en: 'About us' },
    nav_breed: { pl: 'O rasie', en: 'The breed' },
    nav_dogs: { pl: 'Nasze psy', en: 'Our dogs' },
    nav_puppies: { pl: 'Szczenięta', en: 'Puppies' },
    nav_contact: { pl: 'Kontakt', en: 'Contact' },
    nav_cta: { pl: 'Wypełnij ankietę', en: 'Apply now' },
    hero_headline: { pl: 'Miłość, która ma cztery łapy i kręcony włos.', en: 'Love with four paws and a curly coat.' },
    hero_subhead: { pl: 'Ekskluzywna, domowa hodowla psów rasy Mini Goldendoodle w Mielcu.', en: 'An exclusive, home-raised Mini Goldendoodle kennel in Mielec.' },
    hero_cta_primary: { pl: 'Wypełnij ankietę', en: 'Apply now' },
    hero_cta_secondary: { pl: 'Poznaj nasze szczenięta', en: 'See our puppies' },
    about_kicker: { pl: 'Witaj w naszym świecie!', en: 'Welcome to our world!' },
    about_heading: { pl: 'Jesteśmy Karolina i Paweł', en: "We're Karolina and Paweł" },
    about_cta: { pl: 'Poznaj naszą filozofię', en: 'Discover our philosophy' },
    why_heading: { pl: 'Dlaczego my?', en: 'Why choose us' },
    why1_title: { pl: 'Prawdziwy dom', en: 'A real home' },
    why1_body: { pl: 'Szczenięta dorastają w centrum domowego życia.', en: 'Puppies grow up at the center of family life.' },
    why2_title: { pl: 'Genetyka bez kompromisów', en: 'Genetics without compromise' },
    why2_body: { pl: 'Posiadamy rozbudowany pakiet badań genetycznych.', en: 'We run an extensive genetic testing panel.' },
    why3_title: { pl: 'Zaawansowana socjalizacja', en: 'Advanced socialization' },
    why3_body: { pl: 'Testujemy temperament szczeniąt od najmłodszych dni.', en: "We test each puppy's temperament from their earliest days." },
    why4_title: { pl: 'Wielopokoleniowe linie', en: 'Multi-generational lines' },
    why4_body: { pl: 'Hodujemy szczenięta w pięknych odcieniach.', en: 'We breed puppies in beautiful colors.' },
    breed_heading: { pl: 'Poznaj rasę Mini Goldendoodle', en: 'Meet the Mini Goldendoodle' },
    breed_fact1_label: { pl: 'Wzrost', en: 'Height' },
    breed_fact1_value: { pl: 'ok. 35–45 cm w kłębie', en: 'approx. 35–45 cm at the shoulder' },
    breed_fact2_label: { pl: 'Waga', en: 'Weight' },
    breed_fact2_value: { pl: 'ok. 7–14 kg', en: 'approx. 7–14 kg' },
    breed_fact3_label: { pl: 'Usposobienie', en: 'Temperament' },
    breed_fact3_value: { pl: 'łagodne, towarzyskie, inteligentne', en: 'gentle, social, intelligent' },
    breed_fact4_label: { pl: 'Sierść', en: 'Coat' },
    breed_fact4_value: { pl: 'kręcona/falowana, niskolinieniowa', en: 'curly/wavy, low-shedding' },
    dogs_heading: { pl: 'Nasze psy', en: 'Our dogs' },
    dogs_lede: { pl: 'Poznaj rodziców naszych miotów.', en: 'Meet the parents behind our litters.' },
    dogs_note: { pl: 'Zdjęcia i pełne dane naszych psów dodamy tutaj.', en: 'Photos and full profiles of our dogs will go here.' },
    litters_heading: { pl: 'Szczenięta', en: 'Puppies' },
    litters_lede: { pl: 'Aktualne, oczekiwane i już zarezerwowane mioty.', en: 'Current, expecting, and already reserved litters.' },
    litters_note: { pl: 'Podmień na prawdziwe mioty, daty i zdjęcia.', en: 'Swap in your real litters, dates, and photos here.' },
    status_available: { pl: 'Dostępne teraz', en: 'Available now' },
    status_expecting: { pl: 'Oczekiwany', en: 'Expecting' },
    status_reserved: { pl: 'Zarezerwowany', en: 'Reserved' },
    contact_heading: { pl: 'Wypełnij ankietę', en: 'Apply now' },
    contact_lede: { pl: 'Opowiedz nam trochę o swoim domu.', en: 'Tell us a bit about your home.' },
    contact_location_label: { pl: 'Lokalizacja', en: 'Location' },
    contact_location_value: { pl: 'Mielec', en: 'Mielec, Poland' },
    contact_email_label: { pl: 'E-mail', en: 'Email' },
    contact_social_label: { pl: 'Instagram / Facebook', en: 'Instagram / Facebook' },
    field_name: { pl: 'Imię i nazwisko', en: 'Full name' },
    field_email: { pl: 'E-mail', en: 'Email' },
    field_phone: { pl: 'Telefon (opcjonalnie)', en: 'Phone (optional)' },
    field_litter: { pl: 'Który miot Cię interesuje?', en: 'Which litter are you interested in?' },
    field_litter_opt3: { pl: 'Jeszcze nie wiem / przyszły miot', en: 'Not sure yet / future litter' },
    field_message: { pl: 'Opowiedz nam o swoim domu', en: 'Tell us about your home' },
    field_message_placeholder: { pl: 'Domownicy, inne zwierzęta, ogród...', en: 'Household, other pets, yard...' },
    submit_btn: { pl: 'Wyślij zgłoszenie', en: 'Send application' },
    form_fineprint: { pl: 'Wykorzystujemy te dane wyłącznie do kontaktu.', en: 'We only use this information to respond to your inquiry.' },
    footer_disclaimer: { pl: 'Nie prowadzimy sprzedaży za pośrednictwem portali ogłoszeniowych typu OLX.', en: 'We do not sell puppies through classifieds sites such as OLX.' },
    footer_copyright: { pl: '© 2026 Curly Head Doodle. Wszelkie prawa zastrzeżone.', en: '© 2026 Curly Head Doodle. All rights reserved.' },
  },
  about: {
    body: [
      { heading: { pl: '', en: '' }, headingFont: 'default', textFont: 'default', text: { pl: 'Curly Head Doodle z Mielca to spełnienie naszych marzeń.', en: 'Curly Head Doodle, based in Mielec, is the fulfillment of our dream.' } },
      { heading: { pl: '', en: '' }, headingFont: 'default', textFont: 'default', text: { pl: 'Wychowujemy szczenięta w domu, bez kojców zewnętrznych.', en: 'We raise our puppies at home, with no outdoor kennels.' } },
    ],
  },
  breed: {
    body: [
      { heading: { pl: '', en: '' }, headingFont: 'default', textFont: 'default', text: { pl: 'Mini Goldendoodle to połączenie inteligencji pudla i ciepłego usposobienia golden retrievera.', en: "The Mini Goldendoodle combines the Poodle's intelligence with the Golden Retriever's warm nature." } },
      { heading: { pl: '', en: '' }, headingFont: 'default', textFont: 'default', text: { pl: 'Dzięki kręconej sierści wiele osób z alergią dobrze toleruje Goldendoodle.', en: 'Thanks to their curly coat, many people with dog allergies tolerate Goldendoodles well.' } },
    ],
  },
  dogs: [
    { id: 'dog1', name: { pl: '[Imię suczki]', en: "[Dam's name]" }, role: { pl: 'Suczka hodowlana', en: 'Breeding female' }, bio: { pl: 'Miejsce na krótki opis charakteru.', en: 'Space for a short note on temperament.' } },
    { id: 'dog2', name: { pl: '[Imię reproduktora]', en: '[Sire\'s name]' }, role: { pl: 'Reproduktor', en: 'Stud' }, bio: { pl: 'Miejsce na krótki opis charakteru.', en: 'Space for a short note on temperament.' } },
  ],
  litters: [
    { id: 'litter1', status: 'available', title: { pl: '[Suczka] × [Reproduktor]', en: '[Dam] × [Sire]' }, desc: { pl: 'Uzupełnij tutaj.', en: 'Fill in here.' }, cta: { pl: 'Zapytaj o ten miot', en: 'Ask about this litter' } },
    { id: 'litter2', status: 'expecting', title: { pl: '[Suczka] × [Reproduktor]', en: '[Dam] × [Sire]' }, desc: { pl: 'Uzupełnij tutaj.', en: 'Fill in here.' }, cta: { pl: 'Dołącz do listy oczekujących', en: 'Join this waitlist' } },
    { id: 'litter3', status: 'reserved', title: { pl: '[Suczka] × [Reproduktor]', en: '[Dam] × [Sire]' }, desc: { pl: 'Wszystkie szczenięta znalazły już domy.', en: 'All puppies have found their homes.' }, cta: { pl: '', en: '' } },
  ],
  contact: {
    email: 'kontakt@curlyheaddoodle.pl',
    social: '@curlyheaddoodle',
    formAction: 'https://formspree.io/f/YOUR_FORM_ID',
  },
};

let activeContent = FALLBACK_CONTENT;

// ---- 4. Theme ----
const FONT_PAIRS = {
  'fraunces-karla': { display: '"Fraunces", serif', body: '"Karla", sans-serif' },
  'playfair-inter': { display: '"Playfair Display", serif', body: '"Inter", sans-serif' },
  'cormorant-nunito': { display: '"Cormorant Garamond", serif', body: '"Nunito Sans", sans-serif' },
};
// Individual font choices offered per paragraph/heading block (as opposed
// to FONT_PAIRS, which sets the sitewide display+body pairing). All are
// already preloaded via the <link> in <head>, so switching is instant.
const FONT_CHOICES = {
  default: null,
  fraunces: '"Fraunces", serif',
  karla: '"Karla", sans-serif',
  playfair: '"Playfair Display", serif',
  inter: 'Inter, sans-serif',
  cormorant: '"Cormorant Garamond", serif',
  nunito: '"Nunito Sans", sans-serif',
};
const COLOR_VAR_MAP = {
  bg: '--color-bg', bgAlt: '--color-bg-alt', paper: '--color-paper', ink: '--color-ink',
  inkSoft: '--color-ink-soft', gold: '--color-gold', goldSoft: '--color-gold-soft', line: '--color-line',
};

function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement.style;
  if (theme.colors) {
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (COLOR_VAR_MAP[key] && value) root.setProperty(COLOR_VAR_MAP[key], value);
    });
  }
  const pair = FONT_PAIRS[theme.fontPair] || FONT_PAIRS['fraunces-karla'];
  root.setProperty('--font-display', pair.display);
  root.setProperty('--font-body', pair.body);
}

// ---- 5. Dogs / litters ----
const STATUS_CLASS = { available: 'status-available', expecting: 'status-expecting', reserved: 'status-reserved' };

function renderDogs(lang) {
  const grid = document.getElementById('dogsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  (activeContent.dogs || []).forEach(dog => {
    const card = document.createElement('div');
    card.className = 'dog-card';
    card.innerHTML = '<div class="dog-photo" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#icon-paw"/></svg></div><h4></h4><p class="dog-role"></p><p class="dog-bio"></p>';
    card.querySelector('.dog-photo').setAttribute('data-photo-slot', dog.id);
    card.querySelector('h4').textContent = (dog.name && dog.name[lang]) || '';
    card.querySelector('.dog-role').textContent = (dog.role && dog.role[lang]) || '';
    card.querySelector('.dog-bio').textContent = (dog.bio && dog.bio[lang]) || '';
    grid.appendChild(card);
  });
  applyPhotoSlots();
}

function renderLitters(lang) {
  const list = document.getElementById('litterList');
  if (!list) return;
  list.innerHTML = '';
  (activeContent.litters || []).forEach(litter => {
    const li = document.createElement('li');
    li.className = 'litter';
    const statusKey = 'status_' + (litter.status || 'available');
    const statusLabel = (activeContent.translations[statusKey] && activeContent.translations[statusKey][lang]) || '';
    const ctaText = litter.cta && litter.cta[lang];
    li.innerHTML = '<span class="status"></span><div class="litter-body"><h3></h3><p></p></div>';
    const statusEl = li.querySelector('.status');
    statusEl.textContent = statusLabel;
    statusEl.classList.add(STATUS_CLASS[litter.status] || 'status-available');
    li.querySelector('h3').textContent = (litter.title && litter.title[lang]) || '';
    li.querySelector('p').textContent = (litter.desc && litter.desc[lang]) || '';
    if (ctaText) {
      const cta = document.createElement('a');
      cta.className = 'btn-link';
      cta.href = '#kontakt';
      cta.textContent = ctaText;
      li.appendChild(cta);
    }
    list.appendChild(li);
  });
}

function populateLitterSelect(lang) {
  const select = document.getElementById('litter');
  if (!select) return;
  const staticOption = select.querySelector('[data-i18n="field_litter_opt3"]');
  select.querySelectorAll('option:not([data-i18n="field_litter_opt3"])').forEach(o => o.remove());
  (activeContent.litters || []).forEach(litter => {
    if (litter.status === 'reserved') return;
    const statusKey = 'status_' + litter.status;
    const statusLabel = (activeContent.translations[statusKey] && activeContent.translations[statusKey][lang]) || '';
    const opt = document.createElement('option');
    opt.value = litter.id;
    opt.textContent = `${(litter.title && litter.title[lang]) || ''} — ${statusLabel}`;
    select.insertBefore(opt, staticOption);
  });
}

// ---- Content blocks (about/breed body text — open-ended list of optional
// heading + paragraph, each with its own font choice; edited in admin.html
// rather than a fixed body1/body2/... set of fields) ----

// Escapes HTML, then turns a small hand-rolled markup into safe tags:
// **bold**, ++underline++, *italic*. Order matters — ** is consumed before
// single-* so bold pairs don't get read as two italics.
function parseRichText(raw) {
  const escaped = String(raw || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\+\+(.+?)\+\+/g, '<u>$1</u>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function renderContentBlocks(containerId, blocks, lang) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  (blocks || []).forEach(block => {
    const outer = document.createElement('div');
    outer.className = 'content-block';

    if (block.card && block.card.enabled) {
      outer.classList.add('has-card');
      outer.style.background = block.card.background || '';
      outer.style.borderColor = block.card.borderColor || '';
      outer.style.borderWidth = (block.card.borderWidth != null ? block.card.borderWidth : 1) + 'px';
    }

    const photoOn = block.photo && block.photo.enabled;
    if (photoOn) {
      outer.classList.add('has-photo', 'photo-' + (block.photo.position || 'left'));
      const photoEl = document.createElement('div');
      photoEl.className = 'content-block-photo';
      photoEl.setAttribute('data-photo-slot', block.id);
      photoEl.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-paw"/></svg>';
      outer.appendChild(photoEl);
    }

    const textWrap = document.createElement('div');
    textWrap.className = 'content-block-text';
    textWrap.style.textAlign = (photoOn && block.photo.textAlign) || '';

    const headingText = block.heading && block.heading[lang];
    if (headingText) {
      const h = document.createElement('h3');
      h.innerHTML = parseRichText(headingText);
      const hFont = FONT_CHOICES[block.headingFont];
      if (hFont) h.style.fontFamily = hFont;
      textWrap.appendChild(h);
    }
    const text = (block.text && block.text[lang]) || '';
    const textFont = FONT_CHOICES[block.textFont];
    if (text) {
      const p = document.createElement('p');
      p.innerHTML = parseRichText(text);
      if (textFont) p.style.fontFamily = textFont;
      textWrap.appendChild(p);
    }
    if (block.bullets && block.bullets.length) {
      const ul = document.createElement('ul');
      ul.className = 'rendered-list';
      if (textFont) ul.style.fontFamily = textFont;
      block.bullets.forEach(bullet => {
        const li = document.createElement('li');
        li.innerHTML = parseRichText((bullet && bullet[lang]) || '');
        ul.appendChild(li);
      });
      textWrap.appendChild(ul);
    }
    outer.appendChild(textWrap);

    el.appendChild(outer);
  });
  applyPhotoSlots();
}

// ---- 6. Language switch ----
function applyLanguage(lang) {
  document.documentElement.lang = lang;
  const t = activeContent.translations || {};

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] && t[key][lang] !== undefined) el.textContent = t[key][lang];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] && t[key][lang] !== undefined) el.setAttribute('placeholder', t[key][lang]);
  });

  const titleEl = document.querySelector('title');
  const descEl = document.querySelector('meta[name="description"]');
  if (titleEl && t.page_title) titleEl.textContent = t.page_title[lang];
  if (descEl && t.page_description) descEl.setAttribute('content', t.page_description[lang]);

  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  try { localStorage.setItem('chd_lang', lang); } catch (e) { /* storage unavailable, ignore */ }

  renderDogs(lang);
  renderLitters(lang);
  populateLitterSelect(lang);
  renderContentBlocks('aboutBody', activeContent.about && activeContent.about.body, lang);
  renderContentBlocks('breedBody', activeContent.breed && activeContent.breed.body, lang);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

// ---- 7. Photo slots — swap in uploaded photos (images/<slot>.jpg) if present ----
// Photos are uploaded via admin.html (Settings panel), which commits them to
// this exact path in the repo. Until a slot's file exists, the placeholder
// icon markup stays as-is. Re-run after renderDogs since it rebuilds nodes.
function applyPhotoSlots() {
  document.querySelectorAll('[data-photo-slot]:not([data-photo-checked])').forEach(container => {
    container.setAttribute('data-photo-checked', '1');
    const slot = container.getAttribute('data-photo-slot');
    const img = new Image();
    img.onload = () => {
      container.innerHTML = '';
      img.alt = '';
      img.loading = 'lazy';
      container.appendChild(img);
      container.classList.add('has-photo');
    };
    img.onerror = () => { /* no photo uploaded yet — keep placeholder */ };
    img.src = `images/${slot}.jpg`;
  });
}

// ---- Menu order ----
// Reorders the nav's <a data-section> links (about/breed/dogs/litters/
// contact — each its own page) to match content.json's navOrder, by
// inserting each in turn just before the "Apply now" CTA link.
function applyNavOrder(order) {
  const nav = document.getElementById('primaryNav');
  const cta = nav && nav.querySelector('.nav-cta');
  if (!nav || !cta || !Array.isArray(order)) return;
  order.forEach(key => {
    const link = nav.querySelector(`a[data-section="${key}"]`);
    if (link) nav.insertBefore(link, cta);
  });
}

// Highlights whichever nav link matches the current page.
function applyActiveNavLink() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.primary-nav a[data-section]').forEach(a => {
    if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
  });
}
applyActiveNavLink();

// ---- Brand name + logo (header/footer wordmark) ----
function applyBrandName() {
  const name = (activeContent.site && activeContent.site.brandName) || 'Curly Head Doodle';
  const headerEl = document.getElementById('brandName');
  const footerEl = document.getElementById('brandNameFooter');
  if (headerEl) headerEl.textContent = name;
  if (footerEl) footerEl.textContent = name;
}

function applyLogo() {
  const slot = document.querySelector('[data-logo-slot="logo"]');
  if (!slot) return;
  const img = new Image();
  img.onload = () => {
    slot.innerHTML = '';
    img.alt = '';
    slot.appendChild(img);
    slot.classList.add('has-logo');
  };
  img.onerror = () => { /* no custom logo uploaded — keep the default icon */ };
  img.src = 'images/logo.png';
}

// ---- Load content.json, then render everything ----
async function loadContent() {
  try {
    const res = await fetch('data/content.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('content.json not found');
    activeContent = await res.json();
  } catch (e) {
    activeContent = FALLBACK_CONTENT;
  }

  applyTheme(activeContent.theme);
  applyNavOrder(activeContent.navOrder);
  applyPhotoSlots();
  applyBrandName();
  applyLogo();

  if (activeContent.contact) {
    const emailEl = document.getElementById('contactEmail');
    const socialEl = document.getElementById('contactSocial');
    const formEl = document.getElementById('waitlistForm');
    if (emailEl && activeContent.contact.email) emailEl.textContent = activeContent.contact.email;
    if (socialEl && activeContent.contact.social) socialEl.textContent = activeContent.contact.social;
    if (formEl && activeContent.contact.formAction) formEl.setAttribute('action', activeContent.contact.formAction);
  }

  let savedLang = 'pl';
  try { savedLang = localStorage.getItem('chd_lang') || 'pl'; } catch (e) { /* storage unavailable */ }
  applyLanguage(savedLang);
}

loadContent();
