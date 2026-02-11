window.ThemeModule = (function () {
  const THEME_KEY = "sb-theme";
  const MOTION_KEY = "sb-reduce-motion";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const pressed = theme === "light";
    const btn = document.getElementById("themeToggle");
    btn?.setAttribute("aria-pressed", String(pressed));
  }

  function applyMotion(enabled) {
    const btn = document.getElementById("motionToggle");
    btn?.setAttribute("aria-pressed", String(enabled));
    document.documentElement.classList.toggle("reduce-motion", enabled);
    document.documentElement.setAttribute("data-reduce-motion", enabled ? "true" : "false");
    if (enabled) {
      document.querySelectorAll(".reveal").forEach((node) => node.classList.add("in"));
    }
  }

  function init() {
    const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
    const savedMotion = localStorage.getItem(MOTION_KEY) === "true";
    applyTheme(savedTheme);
    applyMotion(savedMotion);

    document.getElementById("themeToggle")?.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });

    document.getElementById("motionToggle")?.addEventListener("click", () => {
      const current = localStorage.getItem(MOTION_KEY) === "true";
      const next = !current;
      localStorage.setItem(MOTION_KEY, String(next));
      applyMotion(next);
    });
  }

  return { init };
})();
