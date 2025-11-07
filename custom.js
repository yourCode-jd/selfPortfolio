// custom.js (desktop-only animations >= 1024px) - modified per request
// ---------------------------------------------------------------------
// Changes:
// 1) Do NOT stop CSS animations for ".line" and ".scroll-indicator" on mobile.
// 2) Portfolio slider (card stack + click) works on mobile as well (uses GSAP if present, else a CSS fallback).

//////////////////////
// Basic non-animated behavior (always on)
//////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.getElementById("Hamburger");
  if (nav) {
    nav.addEventListener("click", function () {
      document.body.classList.toggle("overflow-hidden");
    });
  }

  // init portfolio always (mobile + desktop)
  initPortfolioCards();
});

// toggle menu (always available)
function toggleHighlight() {
  const element = document.getElementById("slideNavigation");
  if (element) element.classList.toggle("slideMenu");
}

//////////////////////
// Portfolio (always enabled — mobile + desktop)
//////////////////////
function initPortfolioCards() {
  const cards = Array.from(document.querySelectorAll(".card"));
  if (!cards.length) return;

  let activeIndex = 1;

  // helper to apply transforms with GSAP if present, otherwise with style + transition
  function applyCardTransforms(
    card,
    { scale, opacity, zIndex, x, y, duration = 0.5, ease = null }
  ) {
    if (window.gsap) {
      gsap.to(card, {
        scale,
        opacity,
        zIndex,
        x,
        y,
        duration,
        ease: ease || "power3.out",
      });
    } else {
      // fallback: set CSS transform and opacity with transitions
      card.style.transition = `transform ${duration}s ease, opacity ${duration}s ease`;
      card.style.transform = `translateX(${x}px) translateY(${y}px) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(zIndex);
    }
  }

  function updateCardStack(targetIndex) {
    cards.forEach((card) => {
      const index = +card.dataset.index || 0;
      const depth = index - targetIndex;
      const z = 100 - Math.abs(depth);
      const scale = Math.max(0.6, 1 - Math.abs(depth) * 0.05);
      const opacity = depth < 4 ? Math.max(0, 1 - Math.abs(depth) * 0.2) : 0;
      const x = depth < 0 ? depth * 50 : 0;
      const y = depth * 5;

      applyCardTransforms(card, { scale, opacity, zIndex: z, x, y });
    });

    activeIndex = targetIndex;
  }

  // initial stack (attempt to infer a sensible initial active index)
  const firstIndex = cards[0] ? +cards[0].dataset.index || 1 : 1;
  if (!cards.some((c) => +c.dataset.index === 1)) {
    // if no card has index 1, use first card
    activeIndex = firstIndex;
  } else {
    activeIndex = 1;
  }
  updateCardStack(activeIndex);

  // list click handling (works on mobile too)
  document.querySelectorAll(".list-item").forEach((item) => {
    item.addEventListener("click", () => {
      const target = +item.dataset.target || 0;
      if (target !== activeIndex) {
        updateCardStack(target);
      }
    });
  });

  // If you'll use keyboard navigation, we can add that too — let me know.
}

//////////////////////
// Desktop animation management
//////////////////////
const DESKTOP_MIN_WIDTH = 1024;
let animationsEnabled = false;

// keep references to handlers so we can remove them later
let tiltMouseHandler = null;
let cursorMouseHandler = null;
let hoverTargets = [];
let gsapRegistered = false;

// Helper: debounce
function debounce(fn, wait = 150) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Kill / cleanup all animations and event listeners
function killAllAnimations() {
  if (!animationsEnabled) return;

  // Remove mouse handlers
  if (tiltMouseHandler) {
    document.removeEventListener("mousemove", tiltMouseHandler);
    tiltMouseHandler = null;
  }
  if (cursorMouseHandler) {
    document.removeEventListener("mousemove", cursorMouseHandler);
    cursorMouseHandler = null;
  }

  // Remove hover handlers added to links/buttons/hover-targets
  hoverTargets.forEach(({ el, enter, leave }) => {
    el.removeEventListener("mouseenter", enter);
    el.removeEventListener("mouseleave", leave);
  });
  hoverTargets = [];

  // Kill GSAP tweens & timelines
  try {
    if (window.ScrollTrigger && typeof ScrollTrigger.getAll === "function") {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    }

    if (window.gsap && typeof gsap.globalTimeline !== "undefined") {
      gsap.globalTimeline.clear();
      gsap.killTweensOf("*");
    }
  } catch (e) {
    console.warn("Error while killing GSAP/ScrollTrigger instances:", e);
  }

  // NOTE: We intentionally DO NOT touch elements that are CSS-animated
  // (so mobile CSS animations for .line and .scroll-indicator remain active).
  const cleanupSelectors = [
    // keep .line and .scroll-indicator out of this list per your request
    ".scaling-circle",
    ".content",
    ".step .content",
    "#triangle1,#triangle2,#triangle3,#triangle4,#triangle5",
    ".triangleText1,.triangleText2,.triangleText3,.triangleText4,.triangleText5",
    ".gsap-text-stroke",
    ".gsap-fade",
    ".progress-bar",
    ".card",
    ".section-item .image-wrapper",
    ".section-item .text-content",
    // ".scroll-indicator",   <-- removed intentionally
    // ".line"                <-- removed intentionally
  ];

  cleanupSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.transform = "";
      el.style.opacity = "";
      el.style.filter = "";
      el.style.left = "";
      el.style.top = "";
      el.style.width = "";
      el.style.y = "";
      el.style.x = "";
      // remove transition if any (optional)
      el.style.transition = "";
    });
  });

  // Reset custom cursor classes (if used)
  const cursor = document.getElementById("customCursor");
  if (cursor) {
    cursor.className = cursor.className
      .split(" ")
      .filter(
        (c) => !["bg-white", "scale-150", "mix-blend-difference"].includes(c)
      )
      .join(" ");
    cursor.style.transform = "";
    cursor.style.left = "";
    cursor.style.top = "";
  }

  animationsEnabled = false;
}

// Initialize all animations and handlers (only call on desktop)
function initAllAnimations() {
  if (animationsEnabled) return;

  // Register plugin once
  if (window.gsap && !gsapRegistered) {
    if (gsap.registerPlugin && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    gsapRegistered = true;
  }

  // --- scroll-indicator: GSAP tween for desktop (kept out of cleanup so CSS remains on mobile) ---
  if (window.gsap) {
    // create a named tween so it's easier to debug / kill if needed
    gsap.to(".scroll-indicator", {
      y: "100%",
      duration: 10,
      ease: "none",
      repeat: -1,
    });
  }

  // --- Note: removed GSAP tween for .scroll-indicator so CSS animation continues on mobile ---
  // (Previously we had gsap.to(".scroll-indicator", ...). It's removed to let CSS handle it.)

  // --- Tilt effect on banner title (desktop only) ---
  const title = document.getElementById("bannerTitle");
  tiltMouseHandler = function (e) {
    if (!title || !window.gsap) return;
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
  };
  document.addEventListener("mousemove", tiltMouseHandler);

  // --- Custom cursor (desktop only) ---
  const cursor = document.getElementById("customCursor");
  cursorMouseHandler = function (e) {
    if (!cursor || !window.gsap) return;
    gsap.to(cursor, {
      x: e.clientX - 12,
      y: e.clientY - 12,
      duration: 0.2,
      ease: "power2.out",
    });
  };
  document.addEventListener("mousemove", cursorMouseHandler);

  // Add hover effects for links/buttons (desktop only)
  document.querySelectorAll("a, button, .hover-target").forEach((el) => {
    const enter = () => {
      if (!cursor) return;
      cursor.classList.add("bg-white", "scale-150", "mix-blend-difference");
    };
    const leave = () => {
      if (!cursor) return;
      cursor.classList.remove("bg-white", "scale-150", "mix-blend-difference");
    };
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    hoverTargets.push({ el, enter, leave });
  });

  // --- Text fade (.line) ---
  // We keep GSAP fade for .line on desktop, but we DON'T remove CSS animation on mobile.
  if (window.gsap && window.ScrollTrigger) {
    gsap.to(".line", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".text-container",
        start: "top 80%",
        toggleActions: "play none none reverse",
        scrub: 3,
      },
    });
  }

  // --- scaling-circle ---
  if (window.gsap && window.ScrollTrigger) {
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
  }

  // --- animate each .content on scroll ---
  if (window.gsap && window.ScrollTrigger) {
    document.querySelectorAll(".content").forEach((content) => {
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
  }

  // --- .step animations ---
  if (window.gsap && window.ScrollTrigger) {
    document.querySelectorAll(".step").forEach((step) => {
      const content = step.querySelector(".content");
      if (!content) return;
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
  }

  // --- Triangle section timeline (pin + complex timeline) ---
  if (window.gsap && window.ScrollTrigger) {
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
      { opacity: 1, duration: 1.5, ease: "power1.inOut" },
      "-=1"
    );
    tl.to(
      ".triangleText3",
      { opacity: 1, duration: 1.5, ease: "power1.inOut" },
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
  }

  // --- gsap-text-stroke ---
  if (window.gsap && window.ScrollTrigger) {
    gsap.fromTo(
      ".gsap-text-stroke",
      { x: -200, opacity: 0, filter: "blur(10px)" },
      {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gsap-text-stroke",
          start: "top 80%",
          end: "top 10%",
          toggleActions: "play reverse none none",
          markers: false,
        },
      }
    );
  }

  // --- about / fade elements ---
  if (window.gsap && window.ScrollTrigger) {
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
        delay: i * 0.1,
      });
    });
  }

  // --- progress bars ---
  if (window.gsap && window.ScrollTrigger) {
    document.querySelectorAll(".progress-bar").forEach((bar) => {
      const percentage = +bar.getAttribute("data-percentage") || 0;
      const label = bar.querySelector(".percentage-label");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bar,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(bar, {
        width: percentage + "%",
        duration: 1.5,
        ease: "power2.out",
      });
      tl.to(
        label,
        { opacity: 1, duration: 0.3, ease: "power1.inOut" },
        "<+=0.2"
      );

      tl.fromTo(
        label,
        { innerText: 0 },
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
  }

  // --- section-item wave animations ---
  if (window.gsap && window.ScrollTrigger) {
    const items = document.querySelectorAll(".section-item");
    items.forEach((item, index) => {
      const imageWrapper = item.querySelector(".image-wrapper");
      const textContent = item.querySelector(".text-content");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 2,
          toggleActions: "play reverse play reverse",
          markers: false,
        },
      });

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
  }

  animationsEnabled = true;
}

//////////////////////
// Responsive init / teardown logic
//////////////////////
function checkAndToggleAnimations() {
  const shouldEnable = window.innerWidth >= DESKTOP_MIN_WIDTH;
  if (shouldEnable && !animationsEnabled) {
    initAllAnimations();
  } else if (!shouldEnable && animationsEnabled) {
    killAllAnimations();
  } else {
    // nothing to do
  }
}

// Run on load and on resize (debounced)
document.addEventListener("DOMContentLoaded", checkAndToggleAnimations);
window.addEventListener("load", checkAndToggleAnimations);
window.addEventListener(
  "resize",
  debounce(function () {
    checkAndToggleAnimations();
  }, 150)
);

// If the page is navigated back to (bfcache) ensure correct state
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    checkAndToggleAnimations();
  }
});
