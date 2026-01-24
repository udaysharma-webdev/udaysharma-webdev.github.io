const slides = document.querySelector(".slides");
const left = document.querySelector(".left");
const right = document.querySelector(".right");

right.addEventListener("click", () => {
  slides.scrollBy({ left: 300, behavior: "smooth" });
});

left.addEventListener("click", () => {
  slides.scrollBy({ left: -300, behavior: "smooth" });
});
