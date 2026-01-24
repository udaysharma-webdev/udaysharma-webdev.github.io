const slides = document.querySelector('.slides');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

let index = 0;

function moveSlide(dir) {
  index += dir;
  if (index < 0) index = slides.children.length - 1;
  if (index >= slides.children.length) index = 0;
  slides.style.transform = `translateX(-${index * 320}px)`;
}

next.onclick = () => moveSlide(1);
prev.onclick = () => moveSlide(-1);

setInterval(() => moveSlide(1), 4000);

function scrollToContact() {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}
