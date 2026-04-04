// ===== TYPING ANIMATION =====
const typingEl = document.getElementById('typingText');
const phrases = [
  'Websites · E-commerce · UX/UI',
  'CRM Systems · Automation',
  'Shopify · WordPress · Webflow',
  'Full Stack · React · Node.js',
];
let phraseIndex = 0, charIndex = 0, deleting = false;

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typingEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 40 : 70);
}
type();

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');

function closeMenu() {
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  const isOpen = mobileOverlay.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileClose.addEventListener('click', closeMenu);

mobileOverlay.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ===== WORK SCROLLER =====
const scroller = document.getElementById('workScroller');
const prevBtn = document.getElementById('workPrev');
const nextBtn = document.getElementById('workNext');
const dotsContainer = document.getElementById('workDots');
const cards = scroller.querySelectorAll('.work__card');
const cardWidth = () => cards[0].offsetWidth + 24;
let autoTimer;

cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'work__dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Go to project ' + (i + 1));
  dot.addEventListener('click', () => { scroller.scrollTo({ left: i * cardWidth(), behavior: 'smooth' }); resetAuto(); });
  dotsContainer.appendChild(dot);
});

function updateDots() {
  const index = Math.round(scroller.scrollLeft / cardWidth());
  dotsContainer.querySelectorAll('.work__dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
}

function startAuto() {
  autoTimer = setInterval(() => {
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    if (scroller.scrollLeft >= maxScroll - 10) {
      scroller.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scroller.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    }
  }, 3000);
}

function resetAuto() { clearInterval(autoTimer); startAuto(); }

prevBtn.addEventListener('click', () => { scroller.scrollBy({ left: -cardWidth(), behavior: 'smooth' }); resetAuto(); });
nextBtn.addEventListener('click', () => { scroller.scrollBy({ left: cardWidth(), behavior: 'smooth' }); resetAuto(); });
scroller.addEventListener('scroll', updateDots);
scroller.addEventListener('mouseenter', () => clearInterval(autoTimer));
scroller.addEventListener('mouseleave', startAuto);
startAuto();

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    status.style.color = '#f87171';
    status.textContent = 'Please fill in all required fields.';
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      status.style.color = '#4ade80';
      status.textContent = "Thanks! I'll get back to you within 24 hours.";
      form.reset();
    } else {
      status.style.color = '#f87171';
      status.textContent = 'Something went wrong. Please email me directly.';
    }
  } catch {
    status.style.color = '#f87171';
    status.textContent = 'Network error. Please try again.';
  }

  btn.textContent = 'Send Message';
  btn.disabled = false;
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .skill').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
