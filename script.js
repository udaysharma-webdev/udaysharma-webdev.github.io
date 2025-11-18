/* ---------- CONFIG: add your Web3Forms access key here ---------- */
const WEB3FORMS_ACCESS_KEY = ""; // ← paste your access_key here to enable form submissions

/* Simple helpers */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));

/* Mobile nav toggle */
const navToggle = $('#navToggle');
const navList = $('#navList');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

/* Smooth anchor scrolling */
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

/* Reveal on scroll */
const revealItems = $$('.card-in');
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach(it => io.observe(it));

/* Projects infinite-ish carousel by duplicating content */
const track = document.getElementById('projectsTrack');
const prevBtn = document.querySelector('.proj-nav.prev');
const nextBtn = document.querySelector('.proj-nav.next');

function duplicateTrack() {
  if (!track) return;
  if (track.dataset.duplicated === '1') return;
  const nodes = Array.from(track.children);
  nodes.forEach(n => track.appendChild(n.cloneNode(true)));
  track.dataset.duplicated = '1';
}

function cardWidth() {
  if (!track) return 360;
  const card = track.querySelector('.proj-card');
  if (!card) return 360;
  const gap = parseFloat(getComputedStyle(track).gap || 18);
  return Math.round(card.getBoundingClientRect().width + gap);
}

let autoScroll = null;
function startAuto() {
  stopAuto();
  autoScroll = setInterval(() => {
    if (!track) return;
    const half = track.scrollWidth / 2;
    if (track.scrollLeft >= half) track.scrollLeft = track.scrollLeft - half;
    track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
  }, 3800);
}
function stopAuto() {
  if (autoScroll) { clearInterval(autoScroll); autoScroll = null; }
}

if (track) {
  duplicateTrack();
  track.setAttribute('tabindex', '0');

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
  track.addEventListener('touchstart', stopAuto);
  track.addEventListener('touchend', startAuto);

  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    if (e.key === 'ArrowRight') track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
  });

  startAuto();
}

prevBtn && prevBtn.addEventListener('click', () => { track && track.scrollBy({ left: -cardWidth(), behavior: 'smooth' }); });
nextBtn && nextBtn.addEventListener('click', () => { track && track.scrollBy({ left: cardWidth(), behavior: 'smooth' }); });

/* Back to top */
const toTop = $('#toTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 600) toTop.style.display = 'block';
  else toTop.style.display = 'none';
});
toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Contact form (Web3Forms) */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form) {
  // set hidden access_key if defined in JS
  const accessInput = document.getElementById('access_key');
  if (accessInput && WEB3FORMS_ACCESS_KEY) accessInput.value = WEB3FORMS_ACCESS_KEY;

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
      status && (status.textContent = 'Tip: add Web3Forms access_key in script.js to enable submissions.');
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
        status && (status.textContent = 'Submission failed — try again.');
      }
    } catch (err) {
      console.error(err);
      status && (status.textContent = 'Network error — try again later.');
    }
  });
}

/* Set current year in footer (if you later add a year span) */
document.addEventListener('DOMContentLoaded', () => {
  // (Left intentionally blank for minimal JS overhead)
});
