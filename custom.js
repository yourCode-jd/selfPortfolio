// body overflow hidden
// document.addEventListener("DOMContentLoaded", function () {
//   const nav = document.getElementById("Hamburger");

//   nav.addEventListener("click", function () {
//     document.body.classList.toggle("overflow-hidden");
//   });
// });

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

// text fade

gsap.registerPlugin(ScrollTrigger);

gsap.to(".line", {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
  duration: 1.2,
  ease: "power3.out",
  stagger: 0.2, // line-by-line feel
  scrollTrigger: {
    trigger: ".text-container",
    start: "top 80%", // when top of h3 hits 80% of viewport
    toggleActions: "play none none reverse",
    scrub: 3,
  },
});

// circle scale

gsap.registerPlugin(ScrollTrigger);

// existing circle scale effect
gsap.to(".scaling-circle", {
  scale: 1.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#heroSection",
    start: "10px center",
    end: "+=800",
    scrub: 3,
  },
});

// animate each content block on scroll
document.querySelectorAll(".content").forEach((content, index) => {
  gsap.to(content, {
    opacity: 1,
    y: 50,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: content,
      start: "top top+=250",
      end: "bottom center",
      scrub: true,
      toggleActions: "play none none reverse",
      markers: true,
    },
  });
});

document.querySelectorAll(".step").forEach((step, index) => {
  const content = step.querySelector(".content");

  gsap.fromTo(
    content,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: step,
        start: "top top",
        end: "bottom center",
        scrub: true,
        pin: true,
        markers: false,
      },
    }
  );
});

// triangle
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#triangleSection",
    start: "top top",
    end: "+=1000",
    scrub: 1,
    pin: true,
    markers: false,
  },
});

tl.to("#triangle1", {
  opacity: 1,
  left: "20%",
  top: "15%",
  scale: 0.3,
  rotate: 45,
  filter: "blur(6px)",
  duration: 1,
  ease: "power1.out",
});

tl.to("#triangle1", {
  left: "50%",
  top: "15%",
  scale: 1,
  rotate: 360,
  filter: "blur(0px)",
  duration: 2,
  ease: "power2.out",
});

tl.to(["#triangle2", "#triangle3"], {
  opacity: 1,
  duration: 1.5,
  stagger: 0.3,
  ease: "power2.out",
});
