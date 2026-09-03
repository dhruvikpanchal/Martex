import { load } from "./load.js";
import { initColorSwitch } from "./initColorSwitch.js";

// HEADER
load("header", "components/common/header.html", { executeScripts: true });

// FOOTER
load("footer", "components/common/footer.html");

// COLOR SWITCH
load("switchOFColour", "components/common/switchOFColour.html").then(() => {
  initColorSwitch();
});

// WELCOME MODAL — shown on every new page load and browser refresh.
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
});
