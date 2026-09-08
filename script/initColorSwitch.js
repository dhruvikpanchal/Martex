/**
 * Martex Color & Theme Switcher
 */

const STORAGE_KEY_MODE = "martex_theme_mode";
const STORAGE_KEY_COLOR = "martex_theme_color";

const DEFAULT_COLOR = {
  name: "Pink",
  primary: "#f6467f",
  dark: "#e8306c",
};

export function initColorSwitch() {
  const panel = document.getElementById("switcherPanel");
  const toggleBtn = document.getElementById("switcherToggleBtn");
  const closeBtn = document.getElementById("switcherCloseBtn");
  const backdrop = document.getElementById("switcherBackdrop");

  const modeLightBtn = document.getElementById("modeLightBtn");
  const modeDarkBtn = document.getElementById("modeDarkBtn");

  const colorBtns = document.querySelectorAll(".color-preset-btn");
  const activeColorNameEl = document.getElementById("activeColorName");
  const previewSampleBtn = document.getElementById("previewSampleBtn");
  const previewSampleBadge = document.getElementById("previewSampleBadge");
  const switcherBrandDot = document.getElementById("switcherBrandDot");
  const resetBtn = document.getElementById("switcherResetBtn");

  if (!panel || !toggleBtn) {
    return;
  }

  // --- Drawer Open / Close ---
  let isOpen = false;

  function openDrawer() {
    isOpen = true;
    panel.classList.remove("translate-x-full");
    panel.classList.add("translate-x-0");
    if (backdrop) {
      backdrop.classList.remove("opacity-0", "pointer-events-none");
      backdrop.classList.add("opacity-100", "pointer-events-auto");
    }
  }

  function closeDrawer() {
    isOpen = false;
    panel.classList.remove("translate-x-0");
    panel.classList.add("translate-x-full");
    if (backdrop) {
      backdrop.classList.remove("opacity-100", "pointer-events-auto");
      backdrop.classList.add("opacity-0", "pointer-events-none");
    }
  }

  toggleBtn.addEventListener("click", () => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeDrawer);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      closeDrawer();
    }
  });

  // --- Dark / Light Mode ---
  function setMode(mode) {
    const isDark = mode === "dark";
    document.documentElement.classList.toggle("dark", isDark);

    if (modeLightBtn && modeDarkBtn) {
      if (isDark) {
        modeDarkBtn.className =
          "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 bg-white/10 text-white shadow-sm";
        modeLightBtn.className =
          "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 text-slate-400 hover:text-white";
      } else {
        modeLightBtn.className =
          "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 bg-white/10 text-white shadow-sm";
        modeDarkBtn.className =
          "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 text-slate-400 hover:text-white";
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY_MODE, mode);
    } catch {
      // Storage unavailable
    }
  }

  if (modeLightBtn) {
    modeLightBtn.addEventListener("click", () => setMode("light"));
  }

  if (modeDarkBtn) {
    modeDarkBtn.addEventListener("click", () => setMode("dark"));
  }

  // --- Accent Color Selection ---
  function applyColor(color) {
    document.documentElement.style.setProperty("--color-brand-pink", color.primary);
    document.documentElement.style.setProperty("--color-brand-pinkDark", color.dark);
    document.documentElement.style.setProperty("--theme-accent", color.primary);

    // Update header & footer logo marks according to scroll position
    const siteHeaderEl = document.getElementById("siteHeader");
    const isScrolled = siteHeaderEl && siteHeaderEl.classList.contains("is-scrolled");
    document.querySelectorAll(".header-logo-mark").forEach((el) => {
      el.style.backgroundColor = isScrolled ? color.primary : "#ffffff";
    });
    document.querySelectorAll(".footer-logo-mark").forEach((el) => {
      el.style.backgroundColor = color.primary;
    });

    // Update switcher elements
    if (activeColorNameEl) {
      activeColorNameEl.textContent = color.name;
      activeColorNameEl.style.color = color.primary;
    }
    if (previewSampleBtn) {
      previewSampleBtn.style.backgroundColor = color.primary;
    }
    if (previewSampleBadge) {
      previewSampleBadge.style.backgroundColor = color.primary;
    }
    if (switcherBrandDot) {
      switcherBrandDot.style.backgroundColor = color.primary;
    }
    const toggleSvg = toggleBtn.querySelector("svg");
    if (toggleSvg) {
      toggleSvg.style.color = color.primary;
    }

    // Update active swatch state
    colorBtns.forEach((btn) => {
      const btnName = btn.dataset.colorName;
      const checkIcon = btn.querySelector(".check-icon");
      const isSelected = btnName === color.name;

      if (isSelected) {
        btn.classList.remove("ring-0");
        btn.classList.add("ring-2", "ring-white", "scale-105");
        if (checkIcon) checkIcon.classList.remove("hidden");
      } else {
        btn.classList.remove("ring-2", "ring-white", "scale-105");
        btn.classList.add("ring-0");
        if (checkIcon) checkIcon.classList.add("hidden");
      }
    });

    try {
      localStorage.setItem(STORAGE_KEY_COLOR, JSON.stringify(color));
    } catch {
      // Storage unavailable
    }
  }

  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = {
        name: btn.dataset.colorName || "Pink",
        primary: btn.dataset.colorPrimary || DEFAULT_COLOR.primary,
        dark: btn.dataset.colorDark || DEFAULT_COLOR.dark,
      };
      applyColor(color);
    });
  });

  // --- Reset to Default ---
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      setMode("light");
      applyColor(DEFAULT_COLOR);
    });
  }

  // --- Restore Stored Preferences ---
  try {
    const savedMode = localStorage.getItem(STORAGE_KEY_MODE);
    if (savedMode === "dark" || savedMode === "light") {
      setMode(savedMode);
    }

    const savedColorStr = localStorage.getItem(STORAGE_KEY_COLOR);
    if (savedColorStr) {
      const savedColor = JSON.parse(savedColorStr);
      if (savedColor && savedColor.primary) {
        applyColor(savedColor);
      }
    }
  } catch {
    // Storage unavailable
  }
}
