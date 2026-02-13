window.ThemeModule = (function () {
  const THEME_KEY = "sb-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const pressed = theme === "light";
    const btn = document.getElementById("themeToggle");
    btn?.setAttribute("aria-pressed", String(pressed));
  }

  function init() {
    const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
    applyTheme(savedTheme);

    document.getElementById("themeToggle")?.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  return { init };
})();
