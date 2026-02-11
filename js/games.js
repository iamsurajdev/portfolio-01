window.GamesModule = (function () {
  const AIM_BEST_KEY = "sb-aim-best";

  function initAim() {
    const canvas = document.getElementById("aimCanvas");
    const ctx = canvas.getContext("2d");
    const startBtn = document.getElementById("aimStart");
    const stats = document.getElementById("aimStats");
    const bestNode = document.getElementById("aimBest");

    let running = false;
    let endAt = 0;
    let score = 0;
    let hits = 0;
    let shots = 0;
    let target = { x: 120, y: 120, r: 22 };
    const best = Number(localStorage.getItem(AIM_BEST_KEY) || 0);
    bestNode.textContent = `Best Score: ${best}`;

    const pickTarget = () => {
      target = {
        r: 16 + Math.random() * 18,
        x: 30 + Math.random() * (canvas.width - 60),
        y: 30 + Math.random() * (canvas.height - 60)
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "rgba(124,92,255,.35)");
      grad.addColorStop(1, "rgba(46,229,157,.22)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(234,240,255,0.86)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(target.x, target.y, target.r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#7c5cff";
      ctx.fill();

      if (running) {
        const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
        ctx.fillStyle = "#eaf0ff";
        ctx.font = "600 18px Inter";
        ctx.fillText(`${left}s`, canvas.width - 44, 26);
      }
    };

    const updateStats = () => {
      const accuracy = shots ? Math.round((hits / shots) * 100) : 0;
      stats.textContent = `Score: ${score} | Hits: ${hits} | Shots: ${shots} | Accuracy: ${accuracy}%`;
    };

    const stop = () => {
      running = false;
      startBtn.disabled = false;
      const bestSoFar = Number(localStorage.getItem(AIM_BEST_KEY) || 0);
      if (score > bestSoFar) {
        localStorage.setItem(AIM_BEST_KEY, String(score));
      }
      bestNode.textContent = `Best Score: ${Math.max(score, bestSoFar)}`;
      draw();
    };

    const loop = () => {
      draw();
      if (!running) return;
      if (Date.now() >= endAt) {
        stop();
        return;
      }
      requestAnimationFrame(loop);
    };

    canvas.addEventListener("click", (event) => {
      if (!running) return;
      shots += 1;
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) * canvas.width) / rect.width;
      const y = ((event.clientY - rect.top) * canvas.height) / rect.height;
      const hit = Math.hypot(target.x - x, target.y - y) <= target.r;
      if (hit) {
        hits += 1;
        score += 100;
        pickTarget();
      } else {
        score = Math.max(0, score - 20);
      }
      updateStats();
    });

    startBtn.addEventListener("click", () => {
      running = true;
      startBtn.disabled = true;
      score = 0;
      hits = 0;
      shots = 0;
      endAt = Date.now() + 30000;
      pickTarget();
      updateStats();
      loop();
    });

    draw();
    updateStats();
  }

  function initMemory() {
    const symbols = ["◆", "●", "▲", "■", "✦", "✶", "⬢", "◉"];
    const grid = document.getElementById("memoryGrid");
    const stats = document.getElementById("memoryStats");
    const win = document.getElementById("memoryWin");
    const reset = document.getElementById("memoryReset");

    let cards = [];
    let open = [];
    let matched = 0;
    let moves = 0;
    let startAt = 0;
    let timer = null;

    function updateStats() {
      const seconds = startAt ? Math.floor((Date.now() - startAt) / 1000) : 0;
      stats.textContent = `Moves: ${moves} | Time: ${seconds}s`;
    }

    function reshuffle() {
      cards = [...symbols, ...symbols]
        .map((value) => ({ value, id: crypto.randomUUID(), flipped: false, matched: false }))
        .sort(() => Math.random() - 0.5);
    }

    function flipButton(btn, show, value) {
      btn.dataset.flipped = String(show);
      btn.textContent = show ? value : "";
      btn.setAttribute("aria-label", show ? `Card ${value}` : "Hidden card");
    }

    function checkWin() {
      if (matched !== cards.length) return;
      if (timer) window.clearInterval(timer);
      const seconds = Math.floor((Date.now() - startAt) / 1000);
      win.textContent = `Completed in ${moves} moves and ${seconds}s.`;
    }

    function onCardClick(button, card) {
      if (card.flipped || card.matched || open.length >= 2) return;
      card.flipped = true;
      flipButton(button, true, card.value);
      open.push({ card, button });

      if (open.length < 2) return;
      moves += 1;
      updateStats();

      const [a, b] = open;
      if (a.card.value === b.card.value) {
        a.card.matched = true;
        b.card.matched = true;
        matched += 2;
        open = [];
        checkWin();
        return;
      }

      window.setTimeout(() => {
        a.card.flipped = false;
        b.card.flipped = false;
        flipButton(a.button, false, "");
        flipButton(b.button, false, "");
        open = [];
      }, 520);
    }

    function render() {
      grid.innerHTML = "";
      cards.forEach((card) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "memory-card";
        button.dataset.flipped = "false";
        button.setAttribute("role", "gridcell");
        button.setAttribute("aria-label", "Hidden card");
        button.addEventListener("click", () => onCardClick(button, card));
        grid.appendChild(button);
      });
    }

    function resetGame() {
      reshuffle();
      open = [];
      matched = 0;
      moves = 0;
      startAt = Date.now();
      win.textContent = "";
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(updateStats, 1000);
      render();
      updateStats();
    }

    reset.addEventListener("click", resetGame);
    resetGame();
  }

  function init() {
    initAim();
    initMemory();
  }

  return { init };
})();
