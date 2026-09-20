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
  hero: { body: [] },
  navOrder: ['about', 'breed', 'dogs', 'litters'],
  customPages: [],
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
    status_previous: { pl: 'Poprzedni miot', en: 'Previous litter' },
    contact_heading: { pl: 'Wypełnij ankietę', en: 'Apply now' },
    contact_lede: { pl: 'Opowiedz nam trochę o swoim domu.', en: 'Tell us a bit about your home.' },
    contact_location_label: { pl: 'Lokalizacja', en: 'Location' },
    contact_location_value: { pl: 'Mielec', en: 'Mielec, Poland' },
    contact_email_label: { pl: 'E-mail', en: 'Email' },
    contact_social_label: { pl: 'Media społecznościowe', en: 'Social media' },
    field_name: { pl: 'Imię i nazwisko', en: 'Full name' },
    field_email: { pl: 'E-mail', en: 'Email' },
    field_phone: { pl: 'Telefon', en: 'Phone' },
    field_litter: { pl: 'Który miot Cię interesuje?', en: 'Which litter are you interested in?' },
    field_litter_opt3: { pl: 'Jeszcze nie wiem / przyszły miot', en: 'Not sure yet / future litter' },
    field_message: { pl: 'Opowiedz nam o swoim domu', en: 'Tell us about your home' },
    field_message_placeholder: { pl: 'Domownicy, inne zwierzęta, ogród...', en: 'Household, other pets, yard...' },
    submit_btn: { pl: 'Wyślij zgłoszenie', en: 'Send application' },
    contact_form_name_placeholder: { pl: 'Twoje imię', en: 'Your name' },
    contact_form_phone_placeholder: { pl: 'Numer do kontaktu', en: 'Phone number' },
    contact_form_email_placeholder: { pl: 'Adres e-mail do kontaktu', en: 'Contact email address' },
    contact_form_message_placeholder: { pl: 'Napisz, w czym możemy pomóc', en: 'Tell us how we can help' },
    contact_form_submit: { pl: 'Wyślij wiadomość', en: 'Send message' },
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
    facts: [],
    body: [
      { heading: { pl: '', en: '' }, headingFont: 'default', textFont: 'default', text: { pl: 'Mini Goldendoodle to połączenie inteligencji pudla i ciepłego usposobienia golden retrievera.', en: "The Mini Goldendoodle combines the Poodle's intelligence with the Golden Retriever's warm nature." } },
      { heading: { pl: '', en: '' }, headingFont: 'default', textFont: 'default', text: { pl: 'Dzięki kręconej sierści wiele osób z alergią dobrze toleruje Goldendoodle.', en: 'Thanks to their curly coat, many people with dog allergies tolerate Goldendoodles well.' } },
    ],
  },
  littersIntro: {
    body: [],
  },
  dogsSection: { photoSize: 200 },
  dogs: [
    { id: 'dog1', name: { pl: '[Imię suczki]', en: "[Dam's name]" }, role: { pl: 'Suczka hodowlana', en: 'Breeding female' }, bio: { pl: 'Miejsce na krótki opis charakteru.', en: 'Space for a short note on temperament.' } },
    { id: 'dog2', name: { pl: '[Imię reproduktora]', en: '[Sire\'s name]' }, role: { pl: 'Reproduktor', en: 'Stud' }, bio: { pl: 'Miejsce na krótki opis charakteru.', en: 'Space for a short note on temperament.' } },
  ],
  littersSection: { photoSize: 160 },
  litters: [
    { id: 'litter1', status: 'available', title: { pl: '[Suczka] × [Reproduktor]', en: '[Dam] × [Sire]' }, desc: { pl: 'Uzupełnij tutaj.', en: 'Fill in here.' }, cta: { pl: 'Zapytaj o ten miot', en: 'Ask about this litter' } },
    { id: 'litter2', status: 'expecting', title: { pl: '[Suczka] × [Reproduktor]', en: '[Dam] × [Sire]' }, desc: { pl: 'Uzupełnij tutaj.', en: 'Fill in here.' }, cta: { pl: 'Dołącz do listy oczekujących', en: 'Join this waitlist' } },
    { id: 'litter3', status: 'reserved', title: { pl: '[Suczka] × [Reproduktor]', en: '[Dam] × [Sire]' }, desc: { pl: 'Wszystkie szczenięta znalazły już domy.', en: 'All puppies have found their homes.' }, cta: { pl: '', en: '' } },
  ],
  contact: {
    email: 'kontakt@curlyheaddoodle.pl',
    social: '@curlyheaddoodle',
    facebook: 'curlyheaddoodle',
    formAction: 'https://formspree.io/f/YOUR_FORM_ID',
    ctaLabel: { pl: 'Skontaktuj się', en: 'Contact us' },
    ctaColor: '#2b211a',
    ctaSize: 'medium',
    ctaLinkPl: '',
    ctaLinkEn: '',
    footerPhotos: { enabled: false, size: 64, count: 3 },
    details: [],
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
const STATUS_CLASS = { available: 'status-available', expecting: 'status-expecting', reserved: 'status-reserved', previous: 'status-previous' };

// Generic "label/value" list — used for breed facts, and for the open-ended
// extra details a site owner can add to a dog, a litter, or the contact
// block, without needing a new fixed field added to the codebase.
function appendFactRows(parent, items, lang) {
  (items || []).forEach(item => {
    const row = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = (item.label && item.label[lang]) || '';
    const dd = document.createElement('dd');
    dd.textContent = (item.value && item.value[lang]) || '';
    row.appendChild(dt);
    row.appendChild(dd);
    parent.appendChild(row);
  });
}
function buildFactListEl(items, lang, className) {
  const dl = document.createElement('dl');
  dl.className = className;
  appendFactRows(dl, items, lang);
  return dl;
}
function renderFactList(containerId, items, lang) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  appendFactRows(el, items, lang);
}

// Shared by dog and litter cards — a photo (or, when count > 1, a small
// carousel with prev/next + dots) that links to the full-size image in a
// new tab. `baseId` names the files: images/<baseId>.jpg for photo 1,
// images/<baseId>-2.jpg, -3.jpg, ... for the rest.
function buildPhotoCarousel(baseId, count, sizePx, shape, fit) {
  count = Math.max(1, count || 1);
  const wrap = document.createElement('div');
  wrap.className = 'photo-carousel';
  wrap.style.setProperty('--photo-size', `${sizePx || 200}px`);

  const frame = document.createElement('a');
  frame.className = 'photo-carousel-frame';
  frame.style.borderRadius = borderRadiusFor(shape);
  frame.target = '_blank';
  frame.rel = 'noopener noreferrer';
  frame.setAttribute('aria-label', 'Powiększ zdjęcie (otwiera się w nowej karcie)');
  const img = document.createElement('img');
  img.alt = '';
  img.loading = 'lazy';
  img.style.objectFit = fit || 'cover';
  frame.appendChild(img);
  wrap.appendChild(frame);

  const paths = [];
  for (let i = 1; i <= count; i++) paths.push(i === 1 ? `images/${baseId}.jpg` : `images/${baseId}-${i}.jpg`);

  let idx = 0;
  let dots = [];
  function show(i) {
    idx = (i + paths.length) % paths.length;
    img.src = `${paths[idx]}?t=${Date.now()}`;
    frame.href = paths[idx];
    dots.forEach((d, di) => d.classList.toggle('active', di === idx));
  }
  img.onerror = () => { wrap.classList.add('no-photo'); };
  img.onload = () => { wrap.classList.remove('no-photo'); };

  if (count > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button'; prevBtn.className = 'carousel-btn prev'; prevBtn.textContent = '‹';
    prevBtn.setAttribute('aria-label', 'Poprzednie zdjęcie');
    prevBtn.addEventListener('click', e => { e.preventDefault(); show(idx - 1); });
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button'; nextBtn.className = 'carousel-btn next'; nextBtn.textContent = '›';
    nextBtn.setAttribute('aria-label', 'Następne zdjęcie');
    nextBtn.addEventListener('click', e => { e.preventDefault(); show(idx + 1); });
    wrap.appendChild(prevBtn);
    wrap.appendChild(nextBtn);

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'carousel-dots';
    dots = paths.map((_, di) => {
      const dot = document.createElement('button');
      dot.type = 'button'; dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Zdjęcie ${di + 1}`);
      dot.addEventListener('click', e => { e.preventDefault(); show(di); });
      dotsWrap.appendChild(dot);
      return dot;
    });
    wrap.appendChild(dotsWrap);
  }
  show(0);
  return wrap;
}

function renderDogs(lang) {
  const grid = document.getElementById('dogsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const dogsSection = activeContent.dogsSection || {};
  const sizePx = dogsSection.photoSize || 200;
  (activeContent.dogs || []).forEach(dog => {
    if (dog.hidden) return;
    const card = document.createElement('div');
    card.className = 'dog-card';
    card.appendChild(buildPhotoCarousel(dog.id, dog.photoCount, sizePx, dogsSection.shape, dogsSection.fit));
    const h4 = document.createElement('h4'); h4.textContent = (dog.name && dog.name[lang]) || ''; card.appendChild(h4);
    const role = document.createElement('p'); role.className = 'dog-role'; role.textContent = (dog.role && dog.role[lang]) || ''; card.appendChild(role);
    const bio = document.createElement('p'); bio.className = 'dog-bio'; bio.textContent = (dog.bio && dog.bio[lang]) || ''; card.appendChild(bio);
    if (dog.extra && dog.extra.length) card.appendChild(buildFactListEl(dog.extra, lang, 'extra-facts dog-extra'));
    grid.appendChild(card);
  });
}

function renderLitters(lang) {
  const list = document.getElementById('litterList');
  if (!list) return;
  list.innerHTML = '';
  const littersSection = activeContent.littersSection || {};
  const sizePx = littersSection.photoSize || 160;
  (activeContent.litters || []).forEach(litter => {
    if (litter.hidden) return;
    const li = document.createElement('li');
    li.className = 'litter';
    const statusKey = 'status_' + (litter.status || 'available');
    const statusLabel = (activeContent.translations[statusKey] && activeContent.translations[statusKey][lang]) || '';
    const ctaText = litter.cta && litter.cta[lang];
    if (litter.photoCount > 0) li.appendChild(buildPhotoCarousel(litter.id, litter.photoCount, sizePx, littersSection.shape, littersSection.fit));
    const restWrap = document.createElement('div');
    restWrap.className = 'litter-rest';
    restWrap.innerHTML = '<span class="status"></span><div class="litter-body"><h3></h3><p></p></div>';
    li.appendChild(restWrap);
    const statusEl = li.querySelector('.status');
    statusEl.textContent = statusLabel;
    statusEl.classList.add(STATUS_CLASS[litter.status] || 'status-available');
    li.querySelector('h3').textContent = (litter.title && litter.title[lang]) || '';
    li.querySelector('p').textContent = (litter.desc && litter.desc[lang]) || '';
    if (litter.extra && litter.extra.length) li.querySelector('.litter-body').appendChild(buildFactListEl(litter.extra, lang, 'extra-facts litter-extra'));
    if (ctaText) {
      const cta = document.createElement('a');
      cta.className = 'btn-link';
      // A litter can point at an external link (e.g. a Google Form) via its
      // optional "link" field; otherwise it falls back to the contact page.
      if (litter.link) {
        cta.href = litter.link;
        cta.target = '_blank';
        cta.rel = 'noopener noreferrer';
      } else {
        cta.href = 'kontakt.html';
      }
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
    if (litter.status === 'reserved' || litter.hidden) return;
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
    if (block.hidden) return;
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
      const position = block.photo.position || 'left';
      outer.classList.add('has-photo', 'photo-' + position);
      // A custom size only applies for the left/right layout — top/bottom
      // are intentionally full-width (CSS handles that), so an inline width
      // there would just fight the layout instead of resizing anything.
      const sizePx = position !== 'top' && position !== 'bottom' ? block.photo.size : null;
      if (block.photo.mode === 'collage') {
        const count = Math.min(5, Math.max(2, block.photo.count || 3));
        const collage = document.createElement('div');
        collage.className = 'content-block-collage';
        if (sizePx) { collage.style.width = collage.style.flexBasis = `${sizePx}px`; }
        for (let i = 1; i <= count; i++) {
          const cell = document.createElement('div');
          cell.className = 'collage-photo';
          cell.setAttribute('data-photo-slot', `${block.id}-${i}`);
          cell.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-paw"/></svg>';
          collage.appendChild(cell);
        }
        outer.appendChild(collage);
      } else {
        const photoEl = document.createElement('div');
        photoEl.className = 'content-block-photo';
        if (sizePx) { photoEl.style.width = photoEl.style.flexBasis = `${sizePx}px`; }
        photoEl.setAttribute('data-photo-slot', block.id);
        photoEl.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-paw"/></svg>';
        outer.appendChild(photoEl);
      }
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

// Renders a custom page (page.html?slug=...) — a no-op everywhere else,
// since #customPageHeading/#customPageBody only exist on that template.
function applyCustomPage(lang) {
  const heading = document.getElementById('customPageHeading');
  const bodyEl = document.getElementById('customPageBody');
  if (!heading && !bodyEl) return;

  const slug = new URLSearchParams(location.search).get('slug');
  const page = (activeContent.customPages || []).find(p => (p.slug || p.id) === slug);
  const notFound = { pl: 'Nie znaleziono strony', en: 'Page not found' };

  if (!page) {
    if (heading) heading.textContent = notFound[lang] || notFound.pl;
    if (bodyEl) bodyEl.innerHTML = '';
    document.title = `${notFound[lang] || notFound.pl} — Curly Head Doodle`;
    return;
  }
  const headingText = (page.heading && page.heading[lang]) || '';
  if (heading) heading.textContent = headingText;
  document.title = `${headingText} — Curly Head Doodle`;
  renderContentBlocks('customPageBody', page.body, lang);

  // Optional photo banner: the same h1 gets moved into (or back out of) the
  // banner section, so heading text only needs setting once above.
  const bannerWrap = document.getElementById('customPageBanner');
  const bannerSubtitle = document.getElementById('customPageBannerSubtitle');
  const mainWrap = document.getElementById('customPageMainWrap');
  if (bannerWrap && heading) {
    if (page.showBanner) {
      bannerWrap.hidden = false;
      bannerWrap.querySelector('.wrap').insertBefore(heading, bannerSubtitle);
      const subText = (page.bannerSubtitle && page.bannerSubtitle[lang]) || '';
      bannerSubtitle.textContent = subText;
      bannerSubtitle.hidden = !subText;
      const bannerImg = new Image();
      bannerImg.onload = () => {
        bannerWrap.style.backgroundImage = `url(${bannerImg.src})`;
        bannerWrap.classList.add('has-photo');
      };
      bannerImg.onerror = () => {
        bannerWrap.classList.remove('has-photo');
        bannerWrap.style.backgroundImage = '';
      };
      bannerImg.src = `images/${page.id}-banner.jpg?t=${Date.now()}`;
    } else {
      bannerWrap.hidden = true;
      if (mainWrap) mainWrap.insertBefore(heading, mainWrap.firstChild);
    }
  }

  const contactBlock = document.getElementById('customPageContact');
  if (contactBlock) contactBlock.hidden = !page.showContactBlock;
  const contactForm = document.getElementById('customPageContactForm');
  if (contactForm) contactForm.hidden = !page.showContactForm;
  // The info block's own "Kontakt" button exists to bring people here from
  // elsewhere (footer, About page) — pointless and visually floating when
  // this very page already has the real form right below it.
  if (contactBlock) {
    const inlineCtaBtn = contactBlock.querySelector('.js-contact-form-btn');
    if (inlineCtaBtn) inlineCtaBtn.hidden = !!page.showContactForm;
  }
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
  renderContentBlocks('heroBody', activeContent.hero && activeContent.hero.body, lang);
  renderContentBlocks('aboutBody', activeContent.about && activeContent.about.body, lang);
  renderContentBlocks('breedBody', activeContent.breed && activeContent.breed.body, lang);
  renderContentBlocks('littersIntroBody', activeContent.littersIntro && activeContent.littersIntro.body, lang);
  renderFactList('breedFacts', activeContent.breed && activeContent.breed.facts, lang);
  applyNavOrder(activeContent.navOrder, activeContent.customPages, lang);
  applyActiveNavLink();
  applyCustomPage(lang);
  applyContactCta(lang);
  applyContactDetails(lang);
  applyFooterPhotos();
}

// Footer "Contact" button — a customizable (label/color/size) shortcut to
// the Google Form, kept separate from the full Formspree form on kontakt.html
// since it links to a different, language-specific URL, not the site's own
// waitlist form.
function applyContactCta(lang) {
  const c = activeContent.contact;
  if (!c) return;
  const label = c.ctaLabel && (c.ctaLabel[lang] || c.ctaLabel.pl);
  const link = lang === 'en' ? c.ctaLinkEn : c.ctaLinkPl;
  document.querySelectorAll('.js-contact-form-btn').forEach(btn => {
    if (label) btn.textContent = label;
    if (link) btn.href = link;
    btn.classList.remove('size-small', 'size-large');
    if (c.ctaSize === 'small' || c.ctaSize === 'large') btn.classList.add(`size-${c.ctaSize}`);
    if (c.ctaColor) btn.style.backgroundColor = c.ctaColor;
  });
}

// Open-ended extra contact details (e.g. "Location", "Phone") added in
// admin.html — appended after the fixed E-mail row in every .contact-info
// list on the page (footer, and any custom page's contact block). Cleared
// and rebuilt each time so language switches don't duplicate rows.
function applyContactDetails(lang) {
  const details = activeContent.contact && activeContent.contact.details;
  document.querySelectorAll('.contact-info').forEach(dl => {
    dl.querySelectorAll('.fact-extra').forEach(row => row.remove());
    (details || []).forEach(item => {
      const row = document.createElement('div');
      row.className = 'fact-extra';
      const dt = document.createElement('dt');
      dt.textContent = (item.label && item.label[lang]) || '';
      const dd = document.createElement('dd');
      dd.textContent = (item.value && item.value[lang]) || '';
      row.appendChild(dt);
      row.appendChild(dd);
      dl.appendChild(row);
    });
  });
}

// Optional footer photo strip — count/frame size set in admin.html; files are
// expected at images/footer-1.jpg, footer-2.jpg, etc. Missing files just
// don't render (no broken-image icon).
function applyFooterPhotos() {
  const wrap = document.getElementById('footerPhotos');
  if (!wrap) return;
  wrap.innerHTML = '';
  const cfg = activeContent.contact && activeContent.contact.footerPhotos;
  if (!cfg || !cfg.enabled) return;
  const size = cfg.size || 64;
  for (let i = 1; i <= (cfg.count || 3); i++) {
    const img = document.createElement('img');
    img.style.width = img.style.height = `${size}px`;
    img.style.borderRadius = borderRadiusFor(cfg.shape);
    img.style.objectFit = cfg.fit || 'cover';
    img.alt = '';
    img.onerror = () => img.remove();
    img.src = `images/footer-${i}.jpg?t=${Date.now()}`;
    wrap.appendChild(img);
  }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

// ---- 7. Photo slots — swap in uploaded photos (images/<slot>.jpg) if present ----
// Photos are uploaded via admin.html (Settings panel), which commits them to
// this exact path in the repo. Until a slot's file exists, the placeholder
// icon markup stays as-is. Re-run after renderDogs since it rebuilds nodes.
// border-radius: '' (browser default) | 'circle' | 'rounded' | 'square'
function borderRadiusFor(shape) {
  return shape === 'circle' ? '50%' : shape === 'square' ? '0' : shape === 'rounded' ? 'var(--radius)' : '';
}
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
      if (slot === 'hero' && activeContent.hero) img.style.objectFit = activeContent.hero.photoFit || '';
      if (slot === 'about' && activeContent.about) img.style.objectFit = activeContent.about.photoFit || '';
    };
    img.onerror = () => { /* no photo uploaded yet — keep placeholder */ };
    img.src = `images/${slot}.jpg`;
  });
}
// Hides the fixed hero/about photo slots when their "photoHidden" toggle
// (admin.html, per-section photo card) is on.
function applyPhotoVisibility() {
  const heroSlot = document.querySelector('[data-photo-slot="hero"]');
  if (heroSlot) {
    heroSlot.hidden = !!(activeContent.hero && activeContent.hero.photoHidden);
    heroSlot.style.maxWidth = `${(activeContent.hero && activeContent.hero.photoSize) || 420}px`;
    heroSlot.style.borderRadius = borderRadiusFor(activeContent.hero && activeContent.hero.photoShape);
  }
  const aboutSlot = document.querySelector('[data-photo-slot="about"]');
  if (aboutSlot) {
    aboutSlot.hidden = !!(activeContent.about && activeContent.about.photoHidden);
    aboutSlot.style.maxWidth = `${(activeContent.about && activeContent.about.photoSize) || 480}px`;
    aboutSlot.style.borderRadius = borderRadiusFor(activeContent.about && activeContent.about.photoShape);
  }
}

// ---- Menu order ----
// Reorders the nav's <a data-section> links (about/breed/dogs/litters/
// contact — each its own page) to match content.json's navOrder, by
// inserting each in turn just before the "Apply now" CTA link.
// Rebuilds the nav from navOrder each time: built-in links (about/breed/
// dogs/litters, already static HTML on every page) are shown and moved
// into position; any built-in key missing from navOrder is hidden rather
// than deleted, since "removing a section" just means taking it out of
// the menu — the page itself still exists. Custom pages (from
// content.json's customPages, each rendered by the shared page.html
// template) get their <a> created/updated here too, since they don't
// exist as static HTML on any page.
function applyNavOrder(order, customPages, lang) {
  const nav = document.getElementById('primaryNav');
  const cta = nav && nav.querySelector('.nav-cta');
  if (!nav || !cta || !Array.isArray(order)) return;

  const byId = {};
  (customPages || []).forEach(p => { byId[p.id] = p; });

  nav.querySelectorAll('a[data-section]').forEach(a => { a.hidden = true; });

  order.forEach(key => {
    if (byId[key]) {
      const page = byId[key];
      let link = nav.querySelector(`a[data-custom-page="${key}"]`);
      if (!link) {
        link = document.createElement('a');
        link.setAttribute('data-custom-page', key);
        link.setAttribute('data-section', `custom:${key}`);
        nav.insertBefore(link, cta);
      } else {
        nav.insertBefore(link, cta);
      }
      link.href = `page.html?slug=${encodeURIComponent(page.slug || page.id)}`;
      link.textContent = (page.navLabel && page.navLabel[lang]) || page.slug || key;
      link.hidden = false;
    } else {
      const link = nav.querySelector(`a[data-section="${key}"]`);
      if (link) {
        nav.insertBefore(link, cta);
        link.hidden = false;
      }
    }
  });
}

// Highlights whichever nav link matches the current page. Custom pages all
// share page.html, so the query string (?slug=...) has to match too, not
// just the pathname.
function applyActiveNavLink() {
  const current = location.pathname.split('/').pop() || 'index.html';
  const currentWithQuery = current + location.search;
  document.querySelectorAll('.primary-nav a[data-section]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || href === currentWithQuery) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
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
  const site = activeContent.site || {};
  const size = site.logoSize || 42;
  slot.style.width = slot.style.height = `${size}px`;
  slot.style.borderRadius = borderRadiusFor(site.logoShape);
  const img = new Image();
  img.onload = () => {
    slot.innerHTML = '';
    img.alt = '';
    img.style.width = img.style.height = `${size}px`;
    img.style.objectFit = site.logoFit || 'contain';
    img.style.borderRadius = borderRadiusFor(site.logoShape);
    slot.appendChild(img);
    slot.classList.add('has-logo');
  };
  img.onerror = () => { /* no custom logo uploaded — keep the default icon */ };
  img.src = 'images/logo.png';
}

// ---- Formspree AJAX submission (kontakt.html only) ----
// Wires the waitlist form up to Formspree's @formspree/ajax library (loaded
// with `defer` in kontakt.html) so submitting stays on-page instead of
// redirecting to Formspree's own confirmation page. The stub below is
// Formspree's standard snippet: it queues the initForm call so it works
// regardless of whether the deferred library has finished loading yet.
function initFormspreeAjax(formEl, formActionUrl) {
  const formId = formActionUrl.split('/').filter(Boolean).pop();
  if (!formId || formId === 'YOUR_FORM_ID') return; // admin hasn't set a real form yet
  window.formspree = window.formspree || function () {
    (formspree.q = formspree.q || []).push(arguments);
  };
  formspree('initForm', { formElement: formEl, formId });
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
  applyPhotoSlots();
  applyPhotoVisibility();
  applyBrandName();
  applyLogo();

  if (activeContent.contact) {
    // Classes, not ids — this same contact block appears twice on a custom
    // "Contact" page (once in the footer, once in the page body when its
    // "showContactBlock" option is on), so every matching element gets set.
    const c = activeContent.contact;
    if (c.email) document.querySelectorAll('.js-contact-email').forEach(el => { el.textContent = c.email; });
    if (c.social) {
      // Icon-only links — only href is set here, never textContent, which
      // would wipe out the <svg> icon inside the <a>. The handle in
      // content.json (e.g. "@curlyheaddoodle") is what admin.html edits; the
      // Instagram URL is derived from it so there's no separate link field.
      const handle = c.social.replace(/^@/, '').trim();
      if (handle) document.querySelectorAll('.js-contact-social').forEach(el => { el.href = `https://www.instagram.com/${encodeURIComponent(handle)}/`; });
    }
    if (c.facebook) {
      const fbHandle = c.facebook.replace(/^@/, '').trim();
      if (fbHandle) document.querySelectorAll('.js-contact-facebook').forEach(el => { el.href = `https://www.facebook.com/${encodeURIComponent(fbHandle)}/`; });
    }
    if (c.formAction) {
      // action/method stay as a no-JS fallback; initFormspreeAjax below takes
      // over the real submission (stays on-page, shows inline success/error).
      // Every Formspree-wired form on the page (the apply form, and any
      // custom page's short contact form) shares this class.
      document.querySelectorAll('.js-formspree-form').forEach(formEl => {
        formEl.setAttribute('action', c.formAction);
        initFormspreeAjax(formEl, c.formAction);
      });
    }
  }

  let savedLang = 'pl';
  try { savedLang = localStorage.getItem('chd_lang') || 'pl'; } catch (e) { /* storage unavailable */ }
  applyLanguage(savedLang);
}

loadContent();
