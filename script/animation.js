/**
 * Scroll Animation Observer
 * Automatically detects and observes static and dynamically loaded .scroll-animate elements
 */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        // Once visible, we can unobserve so it remains visible
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px",
  },
);

export function observeScrollElements() {
  document
    .querySelectorAll(
      ".scroll-animate:not([data-scroll-observed]), .reveal:not([data-scroll-observed])"
    )
    .forEach((element) => {
      element.setAttribute("data-scroll-observed", "true");
      observer.observe(element);
    });
}

/**
 * Statistics Count-Up Animation
 * Smoothly animates numbers from 0 to target value in 2 seconds when scrolled into view
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounterElement(el, duration = 2000) {
  if (el.dataset.animated === "true") return;
  el.dataset.animated = "true";

  const target = parseFloat(el.getAttribute("data-target"));
  if (isNaN(target)) return;

  const suffix = el.getAttribute("data-suffix") || "";
  const prefix = el.getAttribute("data-prefix") || "";
  const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
  const startValue = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = startValue + (target - startValue) * eased;

    if (decimals > 0) {
      el.textContent = prefix + current.toFixed(decimals) + suffix;
    } else {
      el.textContent = prefix + Math.round(current) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
    }
  }

  requestAnimationFrame(update);
}

const statisticObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        obs.unobserve(entry.target);
        const numbers = entry.target.querySelectorAll(".statistic-number");
        numbers.forEach((num) => animateCounterElement(num, 2000));
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -30px 0px",
  }
);

export function observeStatisticCounters() {
  const sections = document.querySelectorAll(
    "#statistic-1:not([data-counter-observed]), [data-counter-section]:not([data-counter-observed])"
  );

  sections.forEach((sec) => {
    sec.setAttribute("data-counter-observed", "true");
    statisticObserver.observe(sec);
  });
}

// Observe any elements present immediately
observeScrollElements();
observeStatisticCounters();

// Automatically observe new elements when sections are loaded asynchronously into the DOM
if (typeof MutationObserver !== "undefined") {
  const mutationObserver = new MutationObserver(() => {
    observeScrollElements();
    observeStatisticCounters();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}


