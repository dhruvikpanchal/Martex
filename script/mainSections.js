import { load } from "./load.js";
import { initColorSwitch } from "./initColorSwitch.js";

// Helper to smoothly hide the preloader
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  preloader.classList.add("preloader-hidden");
  setTimeout(() => {
    preloader.remove();
  }, 700);
}

// Track loading tasks
const loadingPromises = [];

// HEADER
loadingPromises.push(
  load("header", "components/common/header.html", { executeScripts: true })
);

// FOOTER
loadingPromises.push(load("footer", "components/common/footer.html"));

// COLOR SWITCH
loadingPromises.push(
  load("switchOFColour", "components/common/switchOFColour.html").then(() => {
    initColorSwitch();
  })
);

// WELCOME MODAL — shown on every new page load and browser refresh.
loadingPromises.push(
  load("modal", "components/common/modal.html").then(() => {
    const modal = document.getElementById("welcome-modal");

    if (!modal) return;

    let previousActiveElement = null;

    const closeModal = () => {
      // 1. Move focus outside the modal before adding aria-hidden="true" and inert
      const closeBtn = modal.querySelector(".welcome-modal__close");
      const activeEl = document.activeElement;

      // Blur the close button and any element inside the modal that currently has focus
      if (activeEl && (activeEl === closeBtn || modal.contains(activeEl))) {
        activeEl.blur();
      }
      if (closeBtn) {
        closeBtn.blur();
      }

      // If there was a previous element outside the modal (other than document.body), restore focus
      if (
        previousActiveElement &&
        previousActiveElement !== document.body &&
        document.body.contains(previousActiveElement) &&
        !modal.contains(previousActiveElement) &&
        typeof previousActiveElement.focus === "function"
      ) {
        previousActiveElement.focus();
      }

      // Fallback check to ensure focus is outside the modal
      if (modal.contains(document.activeElement)) {
        document.activeElement?.blur();
      }

      // 2. Add aria-hidden="true" and inert now that focus is definitely outside the modal
      modal.setAttribute("aria-hidden", "true");
      modal.setAttribute("inert", "");
      modal.classList.remove("is-open");
      document.body.classList.remove("modal-is-open");
    };

    const openModal = () => {
      previousActiveElement = document.activeElement;

      modal.removeAttribute("inert");
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("is-open");
      document.body.classList.add("modal-is-open");

      requestAnimationFrame(() => {
        modal.querySelector(".welcome-modal__close")?.focus();
      });
    };

    modal.querySelectorAll("[data-modal-close]").forEach((element) => {
      element.addEventListener("click", closeModal);
    });

    modal.querySelector(".welcome-modal__link")?.addEventListener("click", closeModal);

    // Focus trap & keyboard navigation
    modal.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        const focusables = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });

    requestAnimationFrame(openModal);
  })
);

// Ensure hero section & common components are loaded before dismissing preloader
Promise.allSettled(loadingPromises).then(() => {
  // Add a minimum display buffer (e.g. 500ms) for pleasant transition
  setTimeout(() => {
    hidePreloader();
  }, 500);
});

// Fallback safety: hide preloader after 3 seconds in case of slow network/failure
window.addEventListener("load", () => {
  setTimeout(hidePreloader, 2000);
});
