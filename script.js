/* Typing Animation */
const text = "Websites • E-commerce • UX/UI • CRM • Automation";
let i = 0;
const typingEl = document.getElementById("typing");

function type() {
  if (i < text.length) {
    typingEl.innerHTML += text.charAt(i);
    i++;
    setTimeout(type, 80);
  }
}
type();

/* Project Slider */
const slides = document.getElementById("slides");
let index = 0;

document.querySelector(".next").onclick = () => {
  index++;
  slides.style.transform = `translateX(-${index * 340}px)`;
};

document.querySelector(".prev").onclick = () => {
  index = Math.max(0, index - 1);
  slides.style.transform = `translateX(-${index * 340}px)`;
};

/* Auto play */
setInterval(() => {
  index++;
  slides.style.transform = `translateX(-${index * 340}px)`;
}, 4000);
