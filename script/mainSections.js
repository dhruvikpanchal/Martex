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

    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-is-open");
    };

    const openModal = () => {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-is-open");
      modal.querySelector(".welcome-modal__close")?.focus();
    };

    modal.querySelectorAll("[data-modal-close]").forEach((element) => {
      element.addEventListener("click", closeModal);
    });

    modal.querySelector(".welcome-modal__link")?.addEventListener("click", closeModal);

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
