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

// Observe any elements present immediately
observeScrollElements();

// Automatically observe new elements when sections are loaded asynchronously into the DOM
if (typeof MutationObserver !== "undefined") {
  const mutationObserver = new MutationObserver(() => {
    observeScrollElements();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

