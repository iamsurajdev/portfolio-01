window.GamesModule = (function () {
  const REFLEX_BEST_KEY = "sb-reflex-best";

  function initReflexGrid() {
    const grid = document.getElementById("reflexGrid");
    const startBtn = document.getElementById("reflexStart");
    const stats = document.getElementById("reflexStats");
    const bestNode = document.getElementById("reflexBest");
    if (!grid || !startBtn || !stats || !bestNode) return;

    const tiles = [];
    let running = false;
    let score = 0;
    let hits = 0;
    let misses = 0;
    let timeLeft = 20;
    let activeIndex = -1;
    let countdownTimer = null;
    let targetTimer = null;

    function updateStats() {
      stats.textContent = `Score: ${score} | Hits: ${hits} | Misses: ${misses} | Time: ${timeLeft}s`;
    }

    function setActive(index) {
      activeIndex = index;
      tiles.forEach((tile, i) => {
        const active = i === index;
        tile.classList.toggle("is-active", active);
        tile.setAttribute("aria-label", active ? "Active tile" : "Idle tile");
      });
    }

    function pickTarget() {
      const next = Math.floor(Math.random() * tiles.length);
      setActive(next === activeIndex ? (next + 1) % tiles.length : next);
    }

    function stopGame() {
      running = false;
      startBtn.disabled = false;
      startBtn.textContent = "Start 20s";
      setActive(-1);
      if (countdownTimer) window.clearInterval(countdownTimer);
      if (targetTimer) window.clearInterval(targetTimer);
      const bestSoFar = Number(localStorage.getItem(REFLEX_BEST_KEY) || 0);
      if (score > bestSoFar) localStorage.setItem(REFLEX_BEST_KEY, String(score));
      bestNode.textContent = `Best Score: ${Math.max(score, bestSoFar)}`;
      updateStats();
    }

    function startGame() {
      running = true;
      score = 0;
      hits = 0;
      misses = 0;
      timeLeft = 20;
      startBtn.disabled = true;
      startBtn.textContent = "Running...";
      updateStats();
      pickTarget();

      targetTimer = window.setInterval(() => {
        if (!running) return;
        misses += 1;
        score = Math.max(0, score - 25);
        pickTarget();
        updateStats();
      }, 820);

      countdownTimer = window.setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
          timeLeft = 0;
          stopGame();
          return;
        }
        updateStats();
      }, 1000);
    }

    function onTilePress(index) {
      if (!running) return;
      if (index === activeIndex) {
        hits += 1;
        score += 100;
        pickTarget();
      } else {
        misses += 1;
        score = Math.max(0, score - 30);
      }
      updateStats();
    }

    function buildGrid() {
      grid.innerHTML = "";
      for (let i = 0; i < 9; i += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "reflex-tile";
        button.setAttribute("role", "gridcell");
        button.setAttribute("aria-label", "Idle tile");
        button.addEventListener("click", () => onTilePress(i));
        grid.appendChild(button);
        tiles.push(button);
      }
    }

    startBtn.addEventListener("click", startGame);
    buildGrid();
    bestNode.textContent = `Best Score: ${Number(localStorage.getItem(REFLEX_BEST_KEY) || 0)}`;
    updateStats();
  }

  function init() {
    initReflexGrid();
  }

  return { init };
})();
