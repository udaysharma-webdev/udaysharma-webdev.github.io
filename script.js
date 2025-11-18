/* ---------- CONFIG: add your Web3Forms access key here ---------- */
const WEB3FORMS_ACCESS_KEY = ""; // <-- paste your access_key to enable form submissions

/* small helpers */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from((r || document).querySelectorAll(s));

/* MOBILE NAV toggle */
const navToggle = $('#navToggle');
const sideList = $('#sideList');
if (navToggle && sideList) {
  navToggle.addEventListener('click', () => {
    const open = sideList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

/* Smooth anchor scrolling */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (sideList && sideList.classList.contains('open')) sideList.classList.remove('open');
    }
  });
});

/* Reveal on scroll */
const revealTargets = $$('.card-in');
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => io.observe(el));

/* PROJECTS: continuous/infinite scrolling implementation */
const track = document.getElementById('projectsTrack');
const btnPrev = document.querySelector('.proj-nav.prev');
const btnNext = document.querySelector('.proj-nav.next');

function duplicateTrackContent() {
  if (!track) return;
  // if already duplicated, skip
  if (track.dataset.dup === '1') return;
  const items = Array.from(track.children);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });
  track.dataset.dup = '1';
}

// calculate slide width
function slideWidth() {
  if (!track) return 420;
  const card = track.querySelector('.proj-card');
  if (!card) return 420;
  const style = getComputedStyle(track);
  const gap = parseFloat(style.gap || 18);
  return Math.round(card.getBoundingClientRect().width + gap);
}

let auto = null;
function startAutoScroll() {
  stopAutoScroll();
  auto = setInterval(() => {
    if (!track) return;
    const maxScroll = track.scrollWidth / 2; // because we duplicated
    if (track.scrollLeft >= maxScroll) {
      // jump back seamlessly
      track.scrollLeft = track.scrollLeft - maxScroll;
    }
    track.scrollBy({ left: slideWidth(), behavior: 'smooth' });
  }, 3800);
}
function stopAutoScroll() {
  if (auto) { clearInterval(auto); auto = null; }
}

// manual buttons
btnPrev && btnPrev.addEventListener('click', () => {
  track && track.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
});
btnNext && btnNext.addEventListener('click', () => {
  track && track.scrollBy({ left: slideWidth(), behavior: 'smooth' });
});

// pause on hover/touch
if (track) {
  track.addEventListener('mouseenter', stopAutoScroll);
  track.addEventListener('mouseleave', startAutoScroll);
  track.addEventListener('touchstart', stopAutoScroll);
  track.addEventListener('touchend', startAutoScroll);
  // keyboard
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') track.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
    if (e.key === 'ArrowRight') track.scrollBy({ left: slideWidth(), behavior: 'smooth' });
  });
}

/* BACK TO TOP */
const toTop = $('#toTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 600) toTop.style.display = 'block';
  else toTop.style.display = 'none';
});
toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Contact form: Web3Forms */
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (form) {
  // set access_key if set in JS
  const accessInput = document.getElementById('access_key');
  if (accessInput && WEB3FORMS_ACCESS_KEY) accessInput.value = WEB3FORMS_ACCESS_KEY;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus && (formStatus.textContent = 'Sending…');

    const fd = new FormData(form);
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const phone = (fd.get('phone') || '').toString().trim();
    const service = (fd.get('service') || '').toString().trim();
    const message = (fd.get('message') || '').toString().trim();

    if (!name || !email || !phone || !service || !message) {
      formStatus && (formStatus.textContent = 'Please complete all fields.');
      return;
    }

    const payload = {
      access_key: (document.getElementById('access_key') || {}).value || '',
      name, email, phone, service, message, subject: 'Portfolio inquiry'
    };

    if (!payload.access_key) {
      formStatus && (formStatus.textContent = 'Tip: add Web3Forms access_key in script.js to enable submissions.');
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
        formStatus && (formStatus.textContent = 'Thanks — I will get back to you soon.');
        form.reset();
      } else {
        console.error('web3forms:', json);
        formStatus && (formStatus.textContent = 'Submission failed — try again.');
      }
    } catch (err) {
      console.error(err);
      formStatus && (formStatus.textContent = 'Network error. Try again later.');
    }
  });
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  // duplicate track for infinite feel
  duplicateTrackContent();

  // ensure track focusable
  if (track) track.setAttribute('tabindex', '0');

  // start autoplay
  startAutoScroll();

  // reveal targets are observed above (already set)
  const year = new Date().getFullYear();
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = year;
});
