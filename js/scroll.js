window.ScrollModule = (function () {
  function init() {
    const links = [...document.querySelectorAll('.desktop-nav a, .mobile-links a')];
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      });
    });

    const sections = [...document.querySelectorAll("main section[id]")];
    const desktop = [...document.querySelectorAll(".desktop-nav a")];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          desktop.forEach((link) => {
            link.setAttribute("aria-current", link.getAttribute("href") === id ? "true" : "false");
          });
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  return { init };
})();
