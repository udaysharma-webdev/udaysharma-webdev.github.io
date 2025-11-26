const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('.main-nav');

navToggle?.addEventListener('click', () => {
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});
