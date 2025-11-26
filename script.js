/* script.js — final v7 (free-scroll portfolio + GSAP reveals + form) */

/* ---------- CONFIG: add your Web3Forms access key here ---------- */
const WEB3FORMS_ACCESS_KEY = ""; // <-- paste your access_key here to enable form submissions

/* helpers */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from((r || document).querySelectorAll(s));

/* mobile nav toggle */
const navToggle = $('#navToggle');
const navList = $('#navList');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

/* smooth anchor scrolling */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (navList && navList.classList.contains('open')) navList.classList.remove('open');
    }
  });
});

/* GSAP animations (if available) */
if (window.gsap && window.gsap.registerPlugin) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.brand-title', { y: -8, opacity: 0, duration: .7, ease: 'power2.out' });
  gsap.from('.brand-sub', { y: -6, opacity: 0, duration: .6, delay: .08 });

  gsap.from('.nav-right-list li', { y: 6, opacity: 0, duration: .6, stagger: .06, ease: 'power2.out' });

  gsap.utils.toArray('.card-in').forEach((el, i) => {
    gsap.fromTo(el, { y: 14, opacity: 0 }, {
      y: 0, opacity: 1, duration: .7, delay: i * 0.02,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  $$('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      gsap.to(card, { rotationY: dx * 4, rotationX: dy * -4, transformPerspective: 800, duration: .35, ease: 'power3.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationY: 0, rotationX: 0, duration: .6, ease: 'power3.out' });
    });
  });
}

/* Projects free scroll + buttons */
const track = document.getElementById('projectsTrack');
const prevBtn = document.querySelector('.proj-nav.prev');
const nextBtn = document.querySelector('.proj-nav.next');

function computeScrollOffset() {
  if (!track) return 420;
  const card = track.querySelector('.proj-card');
  if (!card) return 420;
  const style = getComputedStyle(track);
  const gap = parseFloat(style.gap || 18) || 18;
  return Math.round(card.getBoundingClientRect().width + gap);
}

if (prevBtn) prevBtn.addEventListener('click', () => {
  if (!track) return;
  track.scrollBy({ left: -computeScrollOffset(), behavior: 'smooth' });
});
if (nextBtn) nextBtn.addEventListener('click', () => {
  if (!track) return;
  track.scrollBy({ left: computeScrollOffset(), behavior: 'smooth' });
});

/* enable keyboard control on track */
if (track) {
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') track.scrollBy({ left: computeScrollOffset(), behavior: 'smooth' });
    if (e.key === 'ArrowLeft') track.scrollBy({ left: -computeScrollOffset(), behavior: 'smooth' });
  });
  track.setAttribute('tabindex', '0');
}

/* back-to-top button */
const toTop = $('#toTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 600) toTop.style.display = 'block';
  else toTop.style.display = 'none';
});
toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* contact form (Web3Forms) */
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (form) {
  const accessInput = document.getElementById('access_key');
  if (accessInput && WEB3FORMS_ACCESS_KEY) accessInput.value = WEB3FORMS_ACCESS_KEY;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus && (formStatus.textContent = 'Sending…');

    const fd = new FormData(form);
    const payload = {
      access_key: (document.getElementById('access_key') || {}).value || '',
      name: (fd.get('name') || '').toString().trim(),
      email: (fd.get('email') || '').toString().trim(),
      phone: (fd.get('phone') || '').toString().trim(),
      service: (fd.get('service') || '').toString().trim(),
      message: (fd.get('message') || '').toString().trim(),
      subject: 'Portfolio inquiry'
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.service || !payload.message) {
      formStatus && (formStatus.textContent = 'Please complete all fields.');
      return;
    }

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
      formStatus && (formStatus.textContent = 'Network error — try again later.');
    }
  });
}

/* DOM ready fallback reveal if GSAP missing */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap) {
    $$('.card-in').forEach((el, idx) => setTimeout(()=> el.classList.add('in'), idx * 40));
  }
});
