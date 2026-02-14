(function () {
  const data = window.PORTFOLIO_DATA;
  const byId = (id) => document.getElementById(id);

  function createLinkIcon(type) {
    if (type === "github") {
      return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 0 0-1.5-3.77A5.07 5.07 0 0 0 20.91 1S19.73.65 17 2.48a13.38 13.38 0 0 0-5 0C9.27.65 8.09 1 8.09 1A5.07 5.07 0 0 0 7 4.75a5.44 5.44 0 0 0-1.5 3.77c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 11 18.13V22" /></svg>';
    }
    if (type === "linkedin") {
      return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12" rx="1"/><circle cx="4" cy="4" r="2"/></svg>';
    }
    if (type === "mail") {
      return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>';
    }
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>';
  }

  function buildNowChips() {
    const wrap = byId("nowChips");
    data.nowChips.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = item;
      wrap.appendChild(chip);
    });
  }

  function buildProjects() {
    const grid = byId("projectsGrid");
    data.projects.forEach((project) => {
      const card = document.createElement("article");
      card.className = "card project-card reveal";
      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <p class="project-meta">${project.tags.join(" • ")}</p>
        <div class="project-links">
          ${project.links
            .map(
              (link) =>
                `<a class="btn btn-ghost" href="${link.href}" target="_blank" rel="noopener noreferrer">${createLinkIcon("external")}${link.label}</a>`
            )
            .join("")}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function buildWriting() {
    const grid = byId("writingGrid");
    data.writing.forEach((post) => {
      const card = document.createElement("article");
      card.className = "card post-card reveal";
      const date = new Date(post.date);
      card.innerHTML = `
        <h3>${post.title}</h3>
        <p class="post-date">${date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</p>
        <div class="post-links">
          <a class="btn btn-ghost" href="${post.href}" target="_blank" rel="noopener noreferrer">${createLinkIcon("external")}Read on Medium</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function buildSocial() {
    const list = byId("socialLinks");
    data.social.forEach((item) => {
      const li = document.createElement("li");
      const key = item.label.toLowerCase();
      li.innerHTML = `<a href="${item.href}" target="_blank" rel="noopener noreferrer">${createLinkIcon(key)}${item.label}</a>`;
      list.appendChild(li);
    });
  }

  function setupContact() {
    const toast = byId("toast");
    const email = data.person.email;
    byId("emailValue").textContent = email;
    byId("emailLink").setAttribute("href", `mailto:${email}`);

    const showToast = (msg) => {
      toast.textContent = msg;
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 1800);
    };

    byId("copyEmail").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        showToast("Email copied.");
      } catch {
        showToast("Clipboard blocked. Copy manually.");
      }
    });
  }

  function setupMenu() {
    const menu = byId("mobileMenu");
    const panel = menu.querySelector(".mobile-menu-panel");
    const openBtn = byId("menuToggle");
    const closeBtn = byId("menuClose");
    const focusables = () => panel.querySelectorAll("a,button");

    const open = () => {
      menu.hidden = false;
      openBtn.setAttribute("aria-expanded", "true");
      panel.focus();
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      menu.hidden = true;
      openBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      openBtn.focus();
    };

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    menu.addEventListener("click", (event) => {
      if (event.target === menu) close();
    });

    panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = [...focusables()];
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  }

  function injectStructuredData() {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            name: data.person.name,
            jobTitle: data.person.role,
            email: `mailto:${data.person.email}`,
            url: data.person.website,
            sameAs: data.person.sameAs
          },
          {
            "@type": "WebSite",
            name: `${data.person.name} Personal Website`,
            url: data.person.website
          }
        ]
      },
      null,
      0
    );
    document.head.appendChild(script);
  }

  function setupEasterEgg() {
    document.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() !== "k") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      document.body.classList.add("pulse");
      window.setTimeout(() => document.body.classList.remove("pulse"), 900);
    });
  }

  function init() {
    buildNowChips();
    buildProjects();
    buildWriting();
    buildSocial();
    setupContact();
    setupMenu();
    setupEasterEgg();
    injectStructuredData();
    byId("year").textContent = String(new Date().getFullYear());
    if (window.RevealModule) window.RevealModule.observe();
    if (window.ScrollModule) window.ScrollModule.init();
    if (window.ThemeModule) window.ThemeModule.init();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
