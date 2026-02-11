window.RevealModule = (function () {
  function observe() {
    const nodes = document.querySelectorAll(".reveal");
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("reduce-motion");
    if (reduce) {
      nodes.forEach((node) => node.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    nodes.forEach((node) => io.observe(node));
  }

  return { observe };
})();
