/* ---------- CONFIG: add your Web3Forms access key here ---------- */
const WEB3FORMS_ACCESS_KEY = ""; // <-- paste your access_key to enable form submissions

/* Helpers */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

/* Mobile pill nav toggle */
const navToggle = $('#navToggle');
const pillList = $('#pillList');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = pillList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

/* Smooth scroll for internal links */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const t = document.querySelector(href);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({behavior:'smooth', block:'start'});
      // close mobile pill nav if open
      if (pillList.classList.contains('open')) pillList.classList.remove('open');
    }
  });
});

/* Reveal on scroll */
const reveal = $$('.card-in');
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      obs.unobserve(en.target);
    }
  });
}, {threshold:0.12});
reveal.forEach(r => io.observe(r));

/* Projects carousel: manual + auto + touch + keyboard */
const track = $('#projectsTrack');
const prevBtn = document.querySelector('.proj-nav.prev');
const nextBtn = document.querySelector('.proj-nav.next');
let auto = null;

function cardWidth() {
  if (!track) return 420;
  const card = track.querySelector('.proj-card');
  if (!card) return 420;
  const gap = parseFloat(getComputedStyle(track).gap || 18);
  return Math.round(card.getBoundingClientRect().width + gap);
}
function scrollBy(offset) {
  if (!track) return;
  track.scrollBy({ left: offset, behavior: 'smooth' });
}
prevBtn && prevBtn.addEventListener('click', () => scrollBy(-cardWidth()));
nextBtn && nextBtn.addEventListener('click', () => scrollBy(cardWidth()));

if (track) {
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') scrollBy(-cardWidth());
    if (e.key === 'ArrowRight') scrollBy(cardWidth());
  });

  track.addEventListener('mouseenter', () => stopAuto());
  track.addEventListener('mouseleave', () => startAuto());
  track.addEventListener('touchstart', () => stopAuto());
  track.addEventListener('touchend', () => startAuto());
}

function startAuto() {
  stopAuto();
  auto = setInterval(() => {
    if (!track) return;
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    }
  }, 4200);
}
function stopAuto() {
  if (auto) { clearInterval(auto); auto = null; }
}

/* Back to top */
const toTop = $('#toTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 600) toTop.style.display = 'block';
  else toTop.style.display = 'none';
});
toTop && toTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

/* Init on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  // set year
  const y = new Date().getFullYear();
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = y;

  // ensure track focusable
  if (track) track.setAttribute('tabindex','0');

  // start carousel
  startAuto();

  // set access key if provided in JS constant
  const access = document.getElementById('access_key');
  if (access && WEB3FORMS_ACCESS_KEY) access.value = WEB3FORMS_ACCESS_KEY;
});

/* Contact form (Web3Forms) */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status && (status.textContent = 'Sending…');

    const fd = new FormData(form);
    const name = (fd.get('name')||'').toString().trim();
    const email = (fd.get('email')||'').toString().trim();
    const phone = (fd.get('phone')||'').toString().trim();
    const service = (fd.get('service')||'').toString().trim();
    const message = (fd.get('message')||'').toString().trim();

    if (!name || !email || !phone || !service || !message) {
      status && (status.textContent = 'Please complete all fields.');
      return;
    }

    const payload = {
      access_key: (document.getElementById('access_key')||{}).value || '',
      name, email, phone, service, message, subject: 'Portfolio inquiry'
    };

    if (!payload.access_key) {
      status && (status.textContent = 'Tip: add Web3Forms access_key in script.js to enable submissions.');
      return;
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        status && (status.textContent = 'Thanks — I will get back to you soon.');
        form.reset();
      } else {
        console.error('web3forms:',json);
        status && (status.textContent = 'Submission failed — try again or contact directly.');
      }
    } catch (err) {
      console.error(err);
      status && (status.textContent = 'Network error — try again later.');
    }
  });
}

