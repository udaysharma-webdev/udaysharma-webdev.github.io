/* Typing animation */
const text = "Websites • E-commerce • UX/UI • CRM • Automation";
let i = 0;
const typing = document.getElementById("typing");

function type() {
  if (i < text.length) {
    typing.textContent += text.charAt(i);
    i++;
    setTimeout(type, 70);
  }
}
type();

/* Hamburger menu */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

/* Scroll animation */
const fadeUps = document.querySelectorAll(".fade-up");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

fadeUps.forEach(el => observer.observe(el));
