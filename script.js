/* Typing */
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
document.addEventListener("scroll",()=>{
  document.querySelectorAll(".reveal").forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight - 80){
      el.classList.add("active");
    }
  });
});

/* Project Slider */
let offset = 0;
function slide(dir){
  const track = document.getElementById("projectTrack");
  offset += dir * 320;
  offset = Math.max(Math.min(offset,0), -(track.scrollWidth - 960));
  track.style.transform = `translateX(${offset}px)`;
}
