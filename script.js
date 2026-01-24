/* Typing Effect */
const text = "I design & build websites, e-commerce stores, UX/UI, CRM & automation solutions.";
let i = 0;
const typing = document.getElementById("typing");

function type(){
  if(i < text.length){
    typing.textContent += text.charAt(i++);
    setTimeout(type,40);
  }
}
type();

/* Mobile Menu */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
hamburger.onclick = () => navMenu.classList.toggle("active");

/* Scroll Reveal */
window.addEventListener("scroll",()=>{
  document.querySelectorAll(".reveal").forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight - 80){
      el.classList.add("active");
    }
  });
});

/* Project Slider */
const track = document.getElementById("projectTrack");
const cardWidth = 316;
const visible = 3;
let offset = 0;

function slide(dir){
  offset += dir * cardWidth;
  const max = 0;
  const min = -(track.scrollWidth - cardWidth * visible);
  offset = Math.max(Math.min(offset,max),min);
  track.style.transform = `translateX(${offset}px)`;
}

/* Auto Play */
setInterval(()=>{
  offset -= cardWidth;
  if(Math.abs(offset) > track.scrollWidth - cardWidth * visible){
    offset = 0;
  }
  track.style.transform = `translateX(${offset}px)`;
},3500);

/* Dark Mode */
const toggle = document.getElementById("themeToggle");
toggle.onclick = ()=>{
  document.body.classList.toggle("dark");
  toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};
