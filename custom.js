function scalePageToFit() {
  const baseWidth = 1440;
  const baseHeight = window.innerHeight;

  const scaleX = window.innerWidth / baseWidth;
  const scaleY = window.innerHeight / baseHeight;

  const scale = Math.min(scaleX, scaleY);

  const page = document.getElementById("pageWrapper");
  page.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", scalePageToFit);
window.addEventListener("load", scalePageToFit);

// body overflow hidden
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.getElementById("Hamburger");

  nav.addEventListener("click", function () {
    document.body.classList.toggle("overflow-hidden");
  });
});

gsap.to(".scroll-indicator", {
  y: "100%", // move full height of parent
  duration: 10, // slower animation
  ease: "none",
  repeat: -1, // infinite loop
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
    start: "top bottom",
    end: "+=800",
    scrub: 1,
  },
});

// animate each content block on scroll
document.querySelectorAll(".content").forEach((content, index) => {
  gsap.to(content, {
    opacity: 1,
    y: 100,
    duration: 1,
    filter: "blur(0px)",
    ease: "power2.out",
    scrollTrigger: {
      trigger: content,
      start: "top bottom+=200",
      end: "bottom center",
      scrub: 2,
      toggleActions: "play none none reverse",
      markers: false,
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
        end: "top center",
        scrub: true,
        pin: false,
        markers: false,
      },
    }
  );
});

// Draggable

// Make each .content-bg draggable
// document.querySelectorAll(".content-bg").forEach((el) => {
//   Draggable.create(el, {
//     type: "x,y",
//     edgeResistance: 0.65,
//     bounds: "#heroSection",
//     inertia: true,
//     onPress() {
//       gsap.to(el, { scale: 1.02, duration: 0.2, ease: "power1.out" }); // optional scale on pick up
//     },
//     onRelease() {
//       gsap.to(el, { scale: 1, duration: 0.3, ease: "power1.out" }); // reset scale
//     },
//   });
// });

// triangle
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#triangleSection",
    start: "top top",
    end: "+=950",
    scrub: 3,
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

tl.to("#triangle2", {
  opacity: 1,
  scale: 1,
  duration: 1.2,
  ease: "power2.out",
});

tl.to("#triangle3", {
  opacity: 1,
  scale: 1,
  duration: 1.2,
  ease: "power2.out",
});

tl.to("#triangle4", {
  opacity: 1,
  scale: 1,
  duration: 1.2,
  ease: "power2.out",
});

tl.to("#triangle5", {
  opacity: 1,
  scale: 1,
  duration: 1.2,
  ease: "power2.out",
});

tl.to(".triangleText1", {
  opacity: 1,
  duration: 1.5,
  ease: "power1.inOut",
});

tl.to(
  ".triangleText2",
  {
    opacity: 1,
    duration: 1.5,
    ease: "power1.inOut",
  },
  "-=1"
);

tl.to(
  ".triangleText3",
  {
    opacity: 1,
    duration: 1.5,
    ease: "power1.inOut",
  },
  "-=1"
);

tl.to(".triangleText4", {
  opacity: 1,
  duration: 1.5,
  ease: "power1.inOut",
});

tl.to(".triangleText5", {
  opacity: 1,
  duration: 1.5,
  ease: "power1.inOut",
});

// Show Triangle popup
// function openPopup(id) {
//   event.preventDefault();

//   const popup = document.getElementById("popup" + id);

//   // Prevent re-clicking the same anchor
//   if (popup.classList.contains("active")) return;

//   // Close any other open popups
//   document.querySelectorAll(".popup").forEach((p) => {
//     if (p.classList.contains("active")) {
//       gsap.to(p, {
//         x: "100%",
//         duration: 0.5,
//         ease: "power2.inOut",
//         onComplete: () => {
//           p.style.display = "none";
//           p.classList.remove("active");
//         },
//       });
//     }
//   });

//   // Show the target popup
//   popup.style.display = "block";
//   popup.classList.add("active");

//   // Disable background scroll
//   document.body.classList.add("overflow-hidden");

//   gsap.fromTo(
//     popup,
//     { x: "100%" },
//     {
//       x: "0%",
//       duration: 0.7,
//       ease: "power3.out",
//     }
//   );
// }

// function closePopup() {
//   const activePopup = document.querySelector(".popup.active");
//   if (activePopup) {
//     gsap.to(activePopup, {
//       x: "100%",
//       duration: 0.5,
//       ease: "power2.inOut",
//       onComplete: () => {
//         activePopup.style.display = "none";
//         activePopup.classList.remove("active");

//         // Re-enable scroll
//         document.body.classList.remove("overflow-hidden");
//       },
//     });
//   }
// }

// designer text

gsap.registerPlugin(ScrollTrigger);

gsap.fromTo(
  ".gsap-text-stroke",
  {
    x: -200, // start from left
    opacity: 0,
    filter: "blur(10px)",
  },
  {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".gsap-text-stroke",
      start: "top 80%",
      end: "top 10%", // add an end point
      toggleActions: "play reverse none none ", // stronger control
      markers: false,
    },
  }
);

// about

gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".gsap-fade").forEach((el, i) => {
  gsap.from(el, {
    opacity: 0,
    x: -50,
    filter: "blur(10px)",
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
    delay: i * 0.1, // Stagger effect
  });
});

// progress bar
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".progress-bar").forEach((bar) => {
  const percentage = +bar.getAttribute("data-percentage");
  const label = bar.querySelector(".percentage-label");

  // Timeline for bar fill + label
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: bar,
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
  });

  // Animate width
  tl.to(bar, {
    width: percentage + "%",
    duration: 1.5,
    ease: "power2.out",
  });

  // Animate number count and label fade-in
  tl.to(
    label,
    {
      opacity: 1,
      duration: 0.3,
      ease: "power1.inOut",
    },
    "<+=0.2"
  ); // Starts slightly after the width animation

  // Count up the number
  tl.fromTo(
    label,
    {
      innerText: 0,
    },
    {
      innerText: percentage,
      duration: 1.2,
      ease: "power1.out",
      snap: { innerText: 1 },
      onUpdate: function () {
        label.textContent = Math.round(label.innerText) + "%";
      },
    },
    "-=1.2"
  );
});

// portfolio cards

const cards = Array.from(document.querySelectorAll(".card"));
let activeIndex = 1;

function updateCardStack(targetIndex) {
  cards.forEach((card) => {
    const index = +card.dataset.index;
    const depth = index - targetIndex;

    const z = 100 - Math.abs(depth);
    const scale = 1 - Math.abs(depth) * 0.05;
    const opacity = depth < 4 ? 1 - Math.abs(depth) * 0.2 : 0;

    // Offset left for previous cards
    const x = depth < 0 ? depth * 50 : 0;
    const y = depth * 5;

    gsap.to(card, {
      scale,
      opacity,
      zIndex: z,
      x,
      y,
      duration: 0.5,
      ease: "power3.out",
    });
  });

  activeIndex = targetIndex;
}

// Initial stack
updateCardStack(activeIndex);

// List click handling
document.querySelectorAll(".list-item").forEach((item) => {
  item.addEventListener("click", () => {
    const target = +item.dataset.target;
    if (target !== activeIndex) {
      updateCardStack(target);
    }
  });
});

// wave

// portfolio cards

gsap.registerPlugin(ScrollTrigger);

const items = document.querySelectorAll(".section-item");

items.forEach((item, index) => {
  const imageWrapper = item.querySelector(".image-wrapper");
  const textContent = item.querySelector(".text-content");
  const heading = textContent.querySelector("h2");
  const paragraph = textContent.querySelector("p");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: item,
      start: "top 80%",
      end: "bottom 20%",
      scrub: 2,
      toggleActions: "play reverse play reverse", // Allow reverse
      markers: false, // Turn to true for debugging
    },
  });

  // Unique effects per item
  switch (index % 3) {
    case 0:
      tl.from(imageWrapper, {
        x: -200,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      }).from(
        textContent,
        { x: 200, opacity: 0, duration: 1, ease: "power4.out" },
        "-=0.8"
      );
      break;
    case 1:
      tl.from(imageWrapper, {
        rotateY: 90,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
      }).from(
        textContent,
        { y: 100, opacity: 0, duration: 1, ease: "power3.out" },
        "-=0.8"
      );
      break;
    case 2:
      tl.from(imageWrapper, {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      }).from(
        textContent,
        { rotate: 15, opacity: 0, duration: 1, ease: "expo.out" },
        "-=0.8"
      );
      break;
  }
});
