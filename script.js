// Typing animation
const text = "Websites • E-commerce • UX/UI • CRM • Automation";
let i = 0;
const typing = document.getElementById("typing");

function type() {
  if (i < text.length) {
    typing.innerHTML += text.charAt(i);
    i++;
    setTimeout(type, 80);
  }
}
type();

// Dark mode
document.getElementById("darkToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

// Mobile menu
document.getElementById("hamburger").onclick = () => {
  document.getElementById("menu").classList.toggle("open");
};

// Project slider
const slides = document.querySelector(".slides");
document.querySelector(".next").onclick = () => slides.scrollBy(320, 0);
document.querySelector(".prev").onclick = () => slides.scrollBy(-320, 0);

// Auto-play
setInterval(() => {
  slides.scrollBy(320, 0);
}, 3000);
