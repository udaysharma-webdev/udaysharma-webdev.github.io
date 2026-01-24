const tracks = document.querySelectorAll(".project-track, .skills-track");

tracks.forEach(track => {
  track.addEventListener("mouseenter", () => {
    track.style.animationPlayState = "paused";
  });
  track.addEventListener("mouseleave", () => {
    track.style.animationPlayState = "running";
  });
});
