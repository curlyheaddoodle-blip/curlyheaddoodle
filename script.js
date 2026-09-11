/* =============================================================
   CURLY HEAD DOODLE — BEHAVIOR
   =============================================================
   1. Mobile nav toggle
   2. Header background on scroll
   3. PL / EN translations — Polish text lives in index.html itself
      (the default). This file only holds the English replacements,
      keyed to match each element's data-i18n="..." attribute.
      To edit English copy: find the key below (e.g. "hero_headline")
      and change its value. To add a language: add a new object next
      to `en` (e.g. `de: { ... }`) with the same keys, then add a
      matching button in the .lang-switch in index.html.
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

// ---- 3. Translations ----
const translations = {
  en: {
    page_title: "Curly Head Doodle — Mini Goldendoodle Kennel, Mielec",
    page_description: "An exclusive, home-raised Mini Goldendoodle kennel in Mielec, Poland. Meet Karolina and Paweł and our puppies.",

    nav_about: "About us",
    nav_breed: "The breed",
    nav_dogs: "Our dogs",
    nav_puppies: "Puppies",
    nav_contact: "Contact",
    nav_cta: "Apply now",

    hero_headline: "Love with four paws and a curly coat.",
    hero_subhead: "An exclusive, home-raised Mini Goldendoodle kennel in Mielec.",
    hero_cta_primary: "Apply now",
    hero_cta_secondary: "See our puppies",

    about_kicker: "Welcome to our world!",
    about_heading: "We're Karolina and Paweł",
    about_body1: "Curly Head Doodle, based in Mielec, is the fulfillment of our dream. Our journey began with a love for the breed, and now we get to share that passion with you.",
    about_body2: "We raise our puppies at home, with no outdoor kennels, to give them the best possible start in life.",
    about_cta: "Discover our philosophy",

    why_heading: "Why choose us",
    why1_title: "A real home",
    why1_body: "Puppies grow up at the center of family life — used to the vacuum cleaner and city noise from day one. We don't keep kennels.",
    why2_title: "Genetics without compromise",
    why2_body: "We run an extensive testing panel (including Laboklin and Labogenetics XXL) that rules out the most serious genetic diseases.",
    why3_title: "Advanced socialization",
    why3_body: "We test each puppy's temperament, use ENS/ESI early stimulation, and introduce grooming procedures from their earliest days.",
    why4_title: "Multi-generational lines",
    why4_body: "We breed puppies (including F2B generations) in beautiful colors, with coats especially friendly to allergy sufferers.",

    breed_heading: "Meet the Mini Goldendoodle",
    breed_body1: "The Mini Goldendoodle combines the Poodle's intelligence with the Golden Retriever's warm, family-oriented nature — affectionate, eager to learn, and equally at home in an apartment or a house with a yard.",
    breed_body2: "Thanks to their curly or wavy Poodle-type coat, many people with dog allergies tolerate Goldendoodles well — though no breed is ever 100% hypoallergenic.",
    breed_fact1_label: "Height",
    breed_fact1_value: "approx. 35–45 cm at the shoulder",
    breed_fact2_label: "Weight",
    breed_fact2_value: "approx. 7–14 kg",
    breed_fact3_label: "Temperament",
    breed_fact3_value: "gentle, social, intelligent",
    breed_fact4_label: "Coat",
    breed_fact4_value: "curly/wavy, low-shedding",

    dogs_heading: "Our dogs",
    dogs_lede: "Meet the parents behind our litters — each fully health- and genetically tested.",
    dog1_name: "[Dam's name]",
    dog1_role: "Breeding female",
    dog1_bio: "Space for a short note on temperament, coloring, and health clearances.",
    dog2_name: "[Sire's name]",
    dog2_role: "Stud",
    dog2_bio: "Space for a short note on temperament, coloring, and health clearances.",
    dogs_note: "Photos and full profiles of our dogs will go here.",

    litters_heading: "Puppies",
    litters_lede: "Current, expecting, and already reserved litters.",
    litter1_status: "Available now",
    litter1_title: "[Dam] × [Sire]",
    litter1_desc: "Birth date, number of puppies available, and pickup date — fill in here.",
    litter1_cta: "Ask about this litter",
    litter2_status: "Expecting",
    litter2_title: "[Dam] × [Sire]",
    litter2_desc: "Planned litter date — fill in here.",
    litter2_cta: "Join this waitlist",
    litter3_status: "Reserved",
    litter3_title: "[Dam] × [Sire]",
    litter3_desc: "All puppies have found their homes.",
    litters_note: "Swap in your real litters, dates, and photos here.",

    contact_heading: "Apply now",
    contact_lede: "Tell us a bit about your home. We read every application ourselves and reply within a few days.",
    contact_location_label: "Location",
    contact_location_value: "Mielec, Poland",
    contact_email_label: "Email",
    contact_social_label: "Instagram / Facebook",

    field_name: "Full name",
    field_email: "Email",
    field_phone: "Phone (optional)",
    field_litter: "Which litter are you interested in?",
    field_litter_opt1: "[Dam] × [Sire] — available now",
    field_litter_opt2: "[Dam] × [Sire] — expecting",
    field_litter_opt3: "Not sure yet / future litter",
    field_message: "Tell us about your home",
    field_message_placeholder: "Household, other pets, yard, why a Goldendoodle...",
    submit_btn: "Send application",
    form_fineprint: "We only use this information to respond to your inquiry and manage the waitlist. We don't share it with anyone else.",

    footer_disclaimer: "We do not sell puppies through classifieds sites such as OLX.",
    footer_copyright: "© 2026 Curly Head Doodle. All rights reserved."
  }
};

// Polish is the source language already written in index.html, so we only
// need to snapshot it once (to restore when switching back from English).
let polishSnapshotTaken = false;
const polish = {};

function snapshotPolish() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    polish[el.getAttribute('data-i18n') + '__' + indexOfEl(el)] = el.textContent;
  });
  polishSnapshotTaken = true;
}

// Elements can repeat the same data-i18n key (e.g. "contact_location_value"
// appears in both the Kontakt section and the footer), so track each
// element instance individually rather than relying on the key alone.
let elCounter = new WeakMap();
let counterSeed = 0;
function indexOfEl(el) {
  if (!elCounter.has(el)) elCounter.set(el, counterSeed++);
  return elCounter.get(el);
}

function applyLanguage(lang) {
  if (!polishSnapshotTaken) snapshotPolish();
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const idKey = key + '__' + indexOfEl(el);
    if (lang === 'pl') {
      el.textContent = polish[idKey];
    } else if (translations[lang] && translations[lang][key] !== undefined) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (lang === 'pl') {
      el.setAttribute('placeholder', el.dataset.plPlaceholder || el.getAttribute('placeholder'));
    } else if (translations[lang] && translations[lang][key] !== undefined) {
      if (!el.dataset.plPlaceholder) el.dataset.plPlaceholder = el.getAttribute('placeholder');
      el.setAttribute('placeholder', translations[lang][key]);
    }
  });

  const titleEl = document.querySelector('title');
  const descEl = document.querySelector('meta[name="description"]');
  if (lang === 'pl') {
    if (titleEl && titleEl.dataset.pl) titleEl.textContent = titleEl.dataset.pl;
    if (descEl && descEl.dataset.pl) descEl.setAttribute('content', descEl.dataset.pl);
  } else if (translations[lang]) {
    if (titleEl) { titleEl.dataset.pl = titleEl.dataset.pl || titleEl.textContent; titleEl.textContent = translations[lang].page_title; }
    if (descEl) { descEl.dataset.pl = descEl.dataset.pl || descEl.getAttribute('content'); descEl.setAttribute('content', translations[lang].page_description); }
  }

  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  try { localStorage.setItem('chd_lang', lang); } catch (e) { /* storage unavailable, ignore */ }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

let savedLang = 'pl';
try { savedLang = localStorage.getItem('chd_lang') || 'pl'; } catch (e) { /* storage unavailable */ }
applyLanguage(savedLang);
