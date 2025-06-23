// body overflow hidden
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.getElementById("Hamburger");

  nav.addEventListener("click", function () {
    document.body.classList.toggle("overflow-hidden");
  });
});

// toggle menu
function toggleHighlight() {
  const element = document.getElementById("slideNavigation");
  element.classList.toggle("slideMenu");
}

// tilt effect on banner title
const title = document.getElementById("bannerTitle");

document.addEventListener("mousemove", (e) => {
  const { innerWidth, innerHeight } = window;
  const xRotation = (e.clientY / innerHeight - 0.5) * 20; // Vertical tilt
  const yRotation = (e.clientX / innerWidth - 0.5) * 20; // Horizontal tilt

  gsap.to(title, {
    rotationX: -xRotation,
    rotationY: yRotation,
    transformPerspective: 1000,
    ease: "power2.out",
    duration: 0.3,
  });
});

// cursor

const cursor = document.getElementById("customCursor");

document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX - 12,
    y: e.clientY - 12,
    duration: 0.2,
    ease: "power2.out",
  });
});

document.querySelectorAll("a, button, .hover-target").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("bg-white", "scale-150", "mix-blend-difference");
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("bg-white", "scale-150", "mix-blend-difference");
  });
});

// wave
