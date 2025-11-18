/* CONFIG: Paste your Web3Forms access key here to enable form submissions */
const WEB3FORMS_ACCESS_KEY = ""; // <-- paste access_key if you have it

// helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// NAV toggle
const navToggle = $('#navToggle');
const navList = $('#navList');
navToggle && navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navList && navList.classList.toggle('open');
});

// smooth scroll for internal links
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({behavior:'smooth', block:'start'});
    if (navList && navList.classList.contains('open')) navList.classList.remove('open');
  });
});

// reveal on scroll (IntersectionObserver)
const revealEls = $$('.wrap .card, .wrap .project, .wrap .skill');
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      obs.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
revealEls.forEach(el => obs.observe(el));

// PROJECT CAROUSEL (auto + manual + touch)
const track = $('#carouselTrack');
const btnPrev = $('.carousel-btn.prev');
const btnNext = $('.carousel-btn.next');
let autoTimer = null;
const cardWidth = () => {
  const card = track && track.querySelector('.project');
  return card ? card.getBoundingClientRect().width + 18 : 420;
};

function scrollByOffset(offset) {
  if (!track) return;
  track.scrollBy({ left: offset, behavior: 'smooth' });
}

btnPrev && btnPrev.addEventListener('click', () => scrollByOffset(-cardWidth()));
btnNext && btnNext.addEventListener('click', () => scrollByOffset(cardWidth()));

// autoplay
function startAuto() {
  stopAuto();
  autoTimer = setInterval(() => {
    if (!track) return;
    // if near end, snap to start
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    }
  }, 4200);
}
function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
track && track.addEventListener('mouseenter', stopAuto);
track && track.addEventListener('mouseleave', startAuto);
track && track.addEventListener('touchstart', stopAuto);
track && track.addEventListener('touchend', startAuto);

// initialize autoplay
document.addEventListener('DOMContentLoaded', () => {
  // insert year
  const y = new Date().getFullYear();
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = y;

  if (track) {
    // allow arrow-key navigation
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') scrollByOffset(-cardWidth());
      if (e.key === 'ArrowRight') scrollByOffset(cardWidth());
    });
    startAuto();
  }
});

// CONTACT FORM: Web3Forms integration (no email/phone in form)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const accessInput = document.getElementById('access_key');
if (accessInput && WEB3FORMS_ACCESS_KEY) accessInput.value = WEB3FORMS_ACCESS_KEY;

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status && (status.textContent = 'Sending…');

    const fd = new FormData(form);
    // basic validation
    const name = (fd.get('name') || '').toString().trim();
    const service = (fd.get('service') || '').toString().trim();
    const message = (fd.get('message') || '').toString().trim();
    if (!name || !service || !message) {
      status && (status.textContent = 'Please complete all fields.');
      return;
    }

    const payload = {
      access_key: accessInput ? accessInput.value : '',
      name, service, message, subject: 'Portfolio inquiry'
    };

    if (!payload.access_key) {
      status && (status.textContent = 'Tip: Add Web3Forms access_key in script.js to enable submissions.');
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
        status && (status.textContent = 'Error sending. Try again or contact directly.');
      }
    } catch (err) {
      console.error(err);
      status && (status.textContent = 'Network error — try again later.');
    }
  });
}
