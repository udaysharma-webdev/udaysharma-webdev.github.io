/* Typing */
const text = "I build modern websites & digital solutions.";
let i = 0;
const typing = document.getElementById("typing");

function type() {
  if (i < text.length) {
    typing.textContent += text.charAt(i++);
    setTimeout(type, 50);
  }
}
type();

/* Mobile Menu */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.onclick = () => navMenu.classList.toggle("active");

/* Scroll Reveal */
const reveals = document.querySelectorAll(".reveal");
window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      el.classList.add("active");
    }
  });
});

/* Auto Slider */
const slides = document.getElementById("slides");
let index = 0;
setInterval(() => {
  index = (index + 1) % slides.children.length;
  slides.style.transform = `translateX(-${index * 100}%)`;
}, 4000);
