/* v4 script - left nav, GSAP animations, manual project slider, form handling */

/* ---------- CONFIG: add your Web3Forms access key here ---------- */
const WEB3FORMS_ACCESS_KEY = ""; // ← paste your access_key here to enable form submissions

/* Helpers */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from((r || document).querySelectorAll(s));

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
      if (navList.classList.contains('open')) navList.classList.remove('open');
    }
  });
});

/* GSAP Animations (if available) */
if (window.gsap && window.gsap.registerPlugin) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.brand-title', { y: -8, opacity: 0, duration: .7, ease: 'power2.out' });
  gsap.from('.brand-sub', { y: -6, opacity: 0, duration: .6, delay: .08 });

  gsap.from('.nav-left-list li', { y: 6, opacity: 0, duration: .6, stagger: .06, ease: 'power2.out' });

  gsap.utils.toArray('.card-in').forEach((el, i) => {
    gsap.fromTo(el, { y: 14, opacity: 0 }, {
      y: 0, opacity: 1, duration: .8, delay: i * 0.03,
      scrollTrigger: { trigger: el, start: 'top 88%' , once: true}
    });
  });

  $$('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      gsap.to(card, { rotationY: dx * 4, rotationX: dy * -4, transformPerspective: 800, duration: .4, ease: 'power3.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationY: 0, rotationX: 0, duration: .6, ease: 'power3.out' });
    });
  });
}

/* Projects manual slider (horizontal scroll with buttons) */
const pTrack = document.getElementById('projectsTrack');
const btnPrev = document.querySelector('.proj-nav.prev');
const btnNext = document.querySelector('.proj-nav.next');

function cardWidth(el = pTrack) {
  if (!el) return 420;
  const card = el.querySelector('.proj-card');
  if (!card) return 420;
  const gap = parseFloat(getComputedStyle(el).gap || 22);
  return Math.round(card.getBoundingClientRect().width + gap);
}

btnPrev && btnPrev.addEventListener('click', () => {
  if (!pTrack) return;
  pTrack.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
});
btnNext && btnNext.addEventListener('click', () => {
  if (!pTrack) return;
  pTrack.scrollBy({ left: cardWidth(), behavior: 'smooth' });
});

/* Back to top */
const toTop = $('#toTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 600) toTop.style.display = 'block';
  else toTop.style.display = 'none';
});
toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Contact form: Web3Forms */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form) {
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
