// ---- CONFIG: Insert your Web3Forms access key here ----
// Get a free access key at https://web3forms.com/ and paste it below
const WEB3FORMS_ACCESS_KEY = ""; // <--- paste your access_key here

document.addEventListener('DOMContentLoaded', () => {

  // year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // IntersectionObserver reveal for sections & project cards
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));
  document.querySelectorAll('.project-card').forEach(el => io.observe(el));

  // ---------- Contact form handling (Web3Forms) ----------
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const accessInput = document.getElementById('access_key');

  // if user has not pasted access key, insert blank but continue
  if (WEB3FORMS_ACCESS_KEY) {
    accessInput.value = WEB3FORMS_ACCESS_KEY;
  } else {
    accessInput.value = "";
    // show small hint
    status.textContent = "Tip: Add Web3Forms access_key in script.js to enable the form.";
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = "Sending…";

    const formData = new FormData(form);

    // Basic client-side validation
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();
    if (!name || !email || !message) {
      status.textContent = "Please fill all fields.";
      return;
    }

    // POST to Web3Forms API
    try {
      const payload = Object.fromEntries(formData.entries());
      // ensure the reply_to is your email
      payload.reply_to = "Udaysharma561@gmail.com";

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        status.textContent = "Thanks! I'll get back to you soon.";
        form.reset();
      } else {
        console.error('web3forms error', json);
        status.textContent = "Error sending message — please try again or email me directly.";
      }
    } catch (err) {
      console.error(err);
      status.textContent = "Network error. Try again later.";
    }
  });

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });

});
