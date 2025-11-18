/* ---------- CONFIG: add your Web3Forms access key here ---------- */
const WEB3FORMS_ACCESS_KEY = ""; // <-- paste your access_key to enable form submissions

/* small DOM helpers */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));

/* NAV toggle */
const navToggle = $('#navToggle');
const navList = $('#navMenu .nav-list') || document.querySelector('#navMenu .nav-list');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    if (!navList) return;
    const open = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

/* Smooth anchor scroll */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const t = document.querySelector(href);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (navList && navList.classList.contains('open')) navList.classList.remove('open');
    }
  });
});

/* Reveal-on-scroll */
const itemsToReveal = $$('.card-in');
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      obs.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
itemsToReveal.forEach(it => io.observe(it));

/* CAROUSEL: manual + autoplay + keyboard + touch */
const track = document.getElementById('carouselTrack');
const btnPrev = document.querySelector('.carousel-btn.prev');
const btnNext = document.querySelector('.carousel-btn.next');

function cardWidth() {
  if (!track) return 420;
  const card = track.querySelector('.project');
  if (!card) return 420;
  const gap = parseFloat(getComputedStyle(track).gap || 18);
  return Math.round(card.getBoundingClientRect().width + gap);
}

function scrollByOffset(offset) {
  if (!track) return;
  track.scrollBy({ left: offset, behavior: 'smooth' });
}

btnPrev && btnPrev.addEventListener('click', () => scrollByOffset(-cardWidth()));
btnNext && btnNext.addEventListener('click', () => scrollByOffset(cardWidth()));

// keyboard
if (track) {
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') scrollByOffset(-cardWidth());
    if (e.key === 'ArrowRight') scrollByOffset(cardWidth());
  });
}

// autoplay
let autoplay = null;
function startAuto() {
  stopAuto();
  autoplay = setInterval(() => {
    if (!track) return;
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    }
  }, 4200);
}
function stopAuto() { if (autoplay) { clearInterval(autoplay); autoplay = null; } }
track && track.addEventListener('mouseenter', stopAuto);
track && track.addEventListener('mouseleave', startAuto);
track && track.addEventListener('touchstart', stopAuto);
track && track.addEventListener('touchend', startAuto);

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  // year
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  // focusable track for keyboard
  if (track) track.setAttribute('tabindex', '0');

  // set web3forms access key if provided
  const access = document.getElementById('access_key');
  if (access && WEB3FORMS_ACCESS_KEY) access.value = WEB3FORMS_ACCESS_KEY;

  // start carousel autoplay
  if (track) startAuto();
});

/* CONTACT FORM (Web3Forms) */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status && (status.textContent = 'Sending…');

    const fd = new FormData(form);
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const phone = (fd.get('phone') || '').toString().trim();
    const service = (fd.get('service') || '').toString().trim();
    const message = (fd.get('message') || '').toString().trim();

    if (!name || !email || !phone || !service || !message) {
      status && (status.textContent = 'Please complete all fields.');
      return;
    }

    const payload = {
      access_key: (document.getElementById('access_key') || {}).value || '',
      name, email, phone, service, message, subject: 'Portfolio inquiry'
    };

    if (!payload.access_key) {
      status && (status.textContent = 'Tip: add Web3Forms access_key in script.js to enable form submissions.');
      return;
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        status && (status.textContent = 'Thanks — I will get back to you soon.');
        form.reset();
      } else {
        console.error('web3forms:', json);
        status && (status.textContent = 'Submission failed — try again or contact directly.');
      }
    } catch (err) {
      console.error(err);
      status && (status.textContent = 'Network error — try again later.');
    }
  });
}
