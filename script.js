/* MODERN PROJECT CAROUSEL */
const track = document.getElementById("carouselTrack");
const nextBtn = document.querySelector(".carousel-btn.next");
const prevBtn = document.querySelector(".carousel-btn.prev");

let index = 0;
const cardWidth = track.children[0].offsetWidth + 24;

function updateSlider() {
  track.style.transform = `translateX(-${index * cardWidth}px)`;
}

nextBtn.addEventListener("click", () => {
  if (index < track.children.length - 3) {
    index++;
    updateSlider();
  }
});

prevBtn.addEventListener("click", () => {
  if (index > 0) {
    index--;
    updateSlider();
  }
});

/* autoplay */
let autoSlide = setInterval(() => {
  if (index < track.children.length - 3) {
    index++;
  } else {
    index = 0;
  }
  updateSlider();
}, 3500);

/* pause on hover */
track.addEventListener("mouseenter", () => clearInterval(autoSlide));
track.addEventListener("mouseleave", () => {
  autoSlide = setInterval(() => {
    if (index < track.children.length - 3) {
      index++;
    } else {
      index = 0;
    }
    updateSlider();
  }, 3500);
});
