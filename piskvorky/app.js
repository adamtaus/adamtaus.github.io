/* Piškvorky pro posádku — UI, nastavení a propojení PWA */

(() => {
  "use strict";

  const STORAGE_SETTINGS = "piskvorky-air-settings-v2";
  const STORAGE_SCORE = "piskvorky-air-score-v1";

  const MIN_BOARD_SIZE = 3;
  const MAX_BOARD_SIZE = 20;
  const MAX_WIN_LENGTH = 5; // i na velké ploše se hraje na max. 5 v řadě (jako gomoku)

  const DEFAULT_SETTINGS = {
    nameX: "Hráč 1",
    nameO: "Hráč 2",
    mode: "pvp",          // 'pvp' | 'pvc'
    aiSide: "O",          // 'X' | 'O'
    difficulty: "medium", // 'easy' | 'medium' | 'hard'
    starting: "X",        // 'X' | 'O' | 'alternate'
    boardSize: 3,
    winLength: 3,
    theme: "day",         // 'day' | 'crew' | 'night' | 'desert' | 'storm'
    symbolX: "jet",
    symbolO: "cloud",
    colorX: "blue",
    colorO: "orange",
    animation: true,
    sound: true,
    vibration: true,
  };

  const DEFAULT_SCORE = { X: 0, O: 0, draw: 0 };

  // ---------- Symboly (SVG, obarvené přes currentColor) ----------
  // Každý hráč si volí symbol nezávisle na druhém hráči.
  const SYMBOLS = {
    cross: {
      label: "Křížek",
      draw: () => `<g stroke="currentColor" stroke-width="14" stroke-linecap="round">
                     <line x1="18" y1="18" x2="82" y2="82"/>
                     <line x1="82" y1="18" x2="18" y2="82"/>
                   </g>`,
    },
    circle: {
      label: "Kolečko",
      draw: () => `<circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" stroke-width="14"/>`,
    },
    jet: {
      label: "Stíhačka",
      draw: () => `<path d="M50 6 L90 88 L52 70 L50 98 L48 70 L10 88 Z"/>`,
    },
    cloud: {
      label: "Mrak",
      draw: () => `<rect x="20" y="55" width="60" height="25" rx="12"/>
                   <circle cx="35" cy="50" r="18"/>
                   <circle cx="55" cy="40" r="22"/>
                   <circle cx="72" cy="52" r="16"/>`,
    },
    helicopter: {
      label: "Vrtulník",
      draw: () => `<rect x="10" y="24" width="80" height="4" rx="2"/>
                   <rect x="38" y="28" width="4" height="18"/>
                   <ellipse cx="42" cy="55" rx="26" ry="16"/>
                   <rect x="60" y="51" width="30" height="8" rx="4"/>
                   <circle cx="88" cy="55" r="6"/>
                   <rect x="30" y="70" width="6" height="14"/>
                   <rect x="54" y="70" width="6" height="14"/>`,
    },
    balloon: {
      label: "Balón",
      draw: () => `<path d="M50 4 C74 4 86 30 86 46 C86 66 70 80 50 80 C30 80 14 66 14 46 C14 30 26 4 50 4 Z"/>
                   <rect x="40" y="86" width="20" height="12" rx="3"/>
                   <line x1="34" y1="78" x2="42" y2="87" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                   <line x1="66" y1="78" x2="58" y2="87" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
    },
    rocket: {
      label: "Raketa",
      draw: () => `<path d="M50 4 C66 22 70 46 70 60 L30 60 C30 46 34 22 50 4 Z"/>
                   <path d="M30 60 L16 84 L34 74 Z"/>
                   <path d="M70 60 L84 84 L66 74 Z"/>
                   <rect x="41" y="70" width="18" height="20" rx="5"/>
                   <circle cx="50" cy="38" r="8" fill-opacity="0.45"/>`,
    },
    target: {
      label: "Terč",
      draw: () => `<g fill="none" stroke="currentColor" stroke-width="7">
                     <circle cx="50" cy="50" r="42"/>
                     <circle cx="50" cy="50" r="25"/>
                   </g>
                   <circle cx="50" cy="50" r="8"/>
                   <g stroke="currentColor" stroke-width="7">
                     <line x1="50" y1="0" x2="50" y2="16"/>
                     <line x1="50" y1="84" x2="50" y2="100"/>
                     <line x1="0" y1="50" x2="16" y2="50"/>
                     <line x1="84" y1="50" x2="100" y2="50"/>
                   </g>`,
    },
    star: {
      label: "Hvězda",
      draw: () => `<path d="M50 6 L58 40 L92 50 L58 60 L50 94 L42 60 L8 50 L42 40 Z"/>`,
    },
  };

  function pieceSVG(symbolKey, role) {
    const symbol = SYMBOLS[symbolKey] || SYMBOLS.jet;
    return `<svg viewBox="0 0 100 100" fill="currentColor" class="piece piece--${role.toLowerCase()}">${symbol.draw()}</svg>`;
  }

  // ---------- Stav ----------
  let settings = loadSettings();
  let score = loadScore();
  let board = Game.createBoard(settings.boardSize);
  let currentPlayer = "X";
  let gameOver = false;
  let aiThinking = false;
  let nextStarter = settings.starting === "O" ? "O" : "X";
  let deferredInstallPrompt = null;

  // ---------- DOM ----------
  const dom = {
    board: document.getElementById("board"),
    statusBanner: document.getElementById("statusBanner"),
    scoreNameX: document.getElementById("scoreNameX"),
    scoreNameO: document.getElementById("scoreNameO"),
    scoreValueX: document.getElementById("scoreValueX"),
    scoreValueO: document.getElementById("scoreValueO"),
    scoreValueDraw: document.getElementById("scoreValueDraw"),
    scoreIconX: document.getElementById("scoreIconX"),
    scoreIconO: document.getElementById("scoreIconO"),
    btnNewGame: document.getElementById("btnNewGame"),
    btnResetScore: document.getElementById("btnResetScore"),
    btnSettings: document.getElementById("btnSettings"),
    btnCloseSettings: document.getElementById("btnCloseSettings"),
    btnApplySettings: document.getElementById("btnApplySettings"),
    btnRestoreDefaults: document.getElementById("btnRestoreDefaults"),
    btnInstall: document.getElementById("btnInstall"),
    settingsOverlay: document.getElementById("settingsOverlay"),
    toast: document.getElementById("toast"),

    inputNameX: document.getElementById("inputNameX"),
    inputNameO: document.getElementById("inputNameO"),
    selectMode: document.getElementById("selectMode"),
    selectAiSide: document.getElementById("selectAiSide"),
    selectDifficulty: document.getElementById("selectDifficulty"),
    selectStarting: document.getElementById("selectStarting"),
    inputBoardSize: document.getElementById("inputBoardSize"),
    selectWinLength: document.getElementById("selectWinLength"),
    selectTheme: document.getElementById("selectTheme"),
    pickerSymbolX: document.getElementById("pickerSymbolX"),
    pickerSymbolO: document.getElementById("pickerSymbolO"),
    selectColorX: document.getElementById("selectColorX"),
    selectColorO: document.getElementById("selectColorO"),
    checkAnimation: document.getElementById("checkAnimation"),
    checkSound: document.getElementById("checkSound"),
    checkVibration: document.getElementById("checkVibration"),
    fieldAiSide: document.getElementById("fieldAiSide"),
    fieldDifficulty: document.getElementById("fieldDifficulty"),
  };

  // ---------- Persistence ----------
  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_SETTINGS);
      if (!raw) return { ...DEFAULT_SETTINGS };
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
  }

  function loadScore() {
    try {
      const raw = localStorage.getItem(STORAGE_SCORE);
      if (!raw) return { ...DEFAULT_SCORE };
      return { ...DEFAULT_SCORE, ...JSON.parse(raw) };
    } catch (e) {
      return { ...DEFAULT_SCORE };
    }
  }

  function saveScore() {
    localStorage.setItem(STORAGE_SCORE, JSON.stringify(score));
  }

  // ---------- Vzhled ----------
  function applyAppearance() {
    document.body.dataset.theme = settings.theme;
    document.body.dataset.colorX = settings.colorX;
    document.body.dataset.colorO = settings.colorO;
    document.body.classList.toggle("no-anim", !settings.animation);
    SoundFX.setEnabled(settings.sound);
  }

  function playerLabel(player) {
    return player === "X" ? settings.nameX || "Hráč 1" : settings.nameO || "Hráč 2";
  }

  function symbolFor(player) {
    return player === "X" ? settings.symbolX : settings.symbolO;
  }

  // ---------- Vykreslení plochy ----------
  function renderBoard() {
    dom.board.innerHTML = "";
    dom.board.style.setProperty("--size", settings.boardSize);
    dom.board.dataset.size = settings.boardSize;

    for (let i = 0; i < board.length; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.index = String(i);
      cell.setAttribute("role", "gridcell");
      if (board[i]) {
        cell.classList.add("cell--filled");
        cell.innerHTML = pieceSVG(symbolFor(board[i]), board[i]);
      }
      cell.addEventListener("click", onCellClick);
      dom.board.appendChild(cell);
    }
  }

  function updateScoreboard() {
    dom.scoreNameX.textContent = settings.nameX || "Hráč 1";
    dom.scoreNameO.textContent = settings.nameO || "Hráč 2";
    dom.scoreValueX.textContent = String(score.X);
    dom.scoreValueO.textContent = String(score.O);
    dom.scoreValueDraw.textContent = String(score.draw);
    dom.scoreIconX.innerHTML = pieceSVG(settings.symbolX, "X");
    dom.scoreIconO.innerHTML = pieceSVG(settings.symbolO, "O");
  }

  function updateStatus(text) {
    dom.statusBanner.textContent = text;
  }

  function setStatusForTurn() {
    if (settings.mode === "pvc" && settings.aiSide === currentPlayer) {
      updateStatus(`${playerLabel(currentPlayer)} (počítač) přemýšlí…`);
    } else {
      updateStatus(`Táhne ${playerLabel(currentPlayer)}`);
    }
  }

  // ---------- Herní tok ----------
  function onCellClick(e) {
    if (gameOver || aiThinking) return;
    const idx = Number(e.currentTarget.dataset.index);
    if (board[idx]) return;
    if (settings.mode === "pvc" && settings.aiSide === currentPlayer) return; // není lidský tah
    makeMove(idx);
  }

  function makeMove(idx) {
    board[idx] = currentPlayer;
    const cell = dom.board.children[idx];
    cell.classList.add("cell--filled");
    cell.innerHTML = pieceSVG(symbolFor(currentPlayer), currentPlayer);

    if (settings.sound) (currentPlayer === "X" ? SoundFX.moveX : SoundFX.moveO)();
    if (settings.vibration) SoundFX.vibrate(18);

    const result = Game.findWinningLine(board, settings.boardSize, settings.winLength);
    if (result) {
      endGame(result);
      return;
    }
    if (Game.isFull(board)) {
      endGame(null);
      return;
    }

    currentPlayer = Game.otherPlayer(currentPlayer);
    setStatusForTurn();
    maybeTriggerAI();
  }

  function maybeTriggerAI() {
    if (gameOver) return;
    if (settings.mode !== "pvc") return;
    if (settings.aiSide !== currentPlayer) return;

    aiThinking = true;
    setStatusForTurn();
    setTimeout(() => {
      if (gameOver) { aiThinking = false; return; }
      const idx = AI.chooseMove(board, settings.boardSize, settings.winLength, settings.aiSide, settings.difficulty);
      aiThinking = false;
      if (idx >= 0 && !board[idx]) makeMove(idx);
    }, 420 + Math.random() * 380);
  }

  function endGame(result) {
    gameOver = true;
    if (result) {
      result.line.forEach((idx) => dom.board.children[idx].classList.add("cell--win"));
      score[result.winner]++;
      updateStatus(`${playerLabel(result.winner)} vyhrává! 🏆`);
      if (settings.sound) SoundFX.win();
      if (settings.vibration) SoundFX.vibrate([30, 60, 30, 60, 60]);
    } else {
      score.draw++;
      updateStatus("Remíza.");
      if (settings.sound) SoundFX.draw();
      if (settings.vibration) SoundFX.vibrate([40, 40, 40]);
    }
    saveScore();
    updateScoreboard();
  }

  function newGame() {
    if (settings.starting === "alternate") {
      nextStarter = Game.otherPlayer(nextStarter);
    } else {
      nextStarter = settings.starting;
    }
    currentPlayer = nextStarter;
    board = Game.createBoard(settings.boardSize);
    gameOver = false;
    aiThinking = false;
    renderBoard();
    setStatusForTurn();
    maybeTriggerAI();
  }

  function resetScore() {
    score = { ...DEFAULT_SCORE };
    saveScore();
    updateScoreboard();
    showToast("Skóre vynulováno");
  }

  // ---------- Toast ----------
  let toastTimer = null;
  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add("toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => dom.toast.classList.remove("toast--show"), 2200);
  }

  // ---------- Nastavení: modal ----------
  function buildSymbolPicker(container, selectedKey) {
    container.innerHTML = "";
    container.dataset.value = selectedKey;

    Object.entries(SYMBOLS).forEach(([key, sym]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "symbol-option" + (key === selectedKey ? " symbol-option--selected" : "");
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", key === selectedKey ? "true" : "false");
      btn.title = sym.label;
      btn.innerHTML = `<svg viewBox="0 0 100 100" fill="currentColor">${sym.draw()}</svg><span class="symbol-option__label">${sym.label}</span>`;
      btn.addEventListener("click", () => {
        container.querySelectorAll(".symbol-option").forEach((b) => {
          b.classList.remove("symbol-option--selected");
          b.setAttribute("aria-checked", "false");
        });
        btn.classList.add("symbol-option--selected");
        btn.setAttribute("aria-checked", "true");
        container.dataset.value = key;
      });
      container.appendChild(btn);
    });
  }

  function clampBoardSize(value) {
    const n = Math.round(Number(value) || MIN_BOARD_SIZE);
    return Math.min(Math.max(n, MIN_BOARD_SIZE), MAX_BOARD_SIZE);
  }

  function populateWinLengthOptions() {
    const size = clampBoardSize(dom.inputBoardSize.value);
    const maxWin = Math.min(size, MAX_WIN_LENGTH);
    dom.selectWinLength.innerHTML = "";
    for (let n = 3; n <= maxWin; n++) {
      const opt = document.createElement("option");
      opt.value = String(n);
      opt.textContent = `${n} v řadě`;
      dom.selectWinLength.appendChild(opt);
    }
    const desired = Math.min(Math.max(settings.winLength, 3), maxWin);
    dom.selectWinLength.value = String(desired);
  }

  function updateConditionalFields() {
    const isPvc = dom.selectMode.value === "pvc";
    dom.fieldAiSide.style.display = isPvc ? "flex" : "none";
    dom.fieldDifficulty.style.display = isPvc ? "flex" : "none";
  }

  function openSettingsModal() {
    dom.inputNameX.value = settings.nameX;
    dom.inputNameO.value = settings.nameO;
    dom.selectMode.value = settings.mode;
    dom.selectAiSide.value = settings.aiSide;
    dom.selectDifficulty.value = settings.difficulty;
    dom.selectStarting.value = settings.starting;
    dom.inputBoardSize.value = String(settings.boardSize);
    populateWinLengthOptions();
    dom.selectTheme.value = settings.theme;
    buildSymbolPicker(dom.pickerSymbolX, settings.symbolX);
    buildSymbolPicker(dom.pickerSymbolO, settings.symbolO);
    dom.selectColorX.value = settings.colorX;
    dom.selectColorO.value = settings.colorO;
    dom.checkAnimation.checked = settings.animation;
    dom.checkSound.checked = settings.sound;
    dom.checkVibration.checked = settings.vibration;
    updateConditionalFields();

    dom.settingsOverlay.classList.add("modal-overlay--open");
  }

  function closeSettingsModal() {
    dom.settingsOverlay.classList.remove("modal-overlay--open");
  }

  function applySettingsFromModal() {
    settings.nameX = dom.inputNameX.value.trim() || DEFAULT_SETTINGS.nameX;
    settings.nameO = dom.inputNameO.value.trim() || DEFAULT_SETTINGS.nameO;
    settings.mode = dom.selectMode.value;
    settings.aiSide = dom.selectAiSide.value;
    settings.difficulty = dom.selectDifficulty.value;
    settings.starting = dom.selectStarting.value;
    settings.boardSize = clampBoardSize(dom.inputBoardSize.value);
    settings.winLength = Number(dom.selectWinLength.value);
    settings.theme = dom.selectTheme.value;
    settings.symbolX = dom.pickerSymbolX.dataset.value;
    settings.symbolO = dom.pickerSymbolO.dataset.value;
    settings.colorX = dom.selectColorX.value;
    settings.colorO = dom.selectColorO.value;
    settings.animation = dom.checkAnimation.checked;
    settings.sound = dom.checkSound.checked;
    settings.vibration = dom.checkVibration.checked;

    saveSettings();
    applyAppearance();
    updateScoreboard();
    closeSettingsModal();
    newGame();
    showToast("Nastavení uloženo");
  }

  function restoreDefaults() {
    settings = { ...DEFAULT_SETTINGS };
    saveSettings();
    applyAppearance();
    openSettingsModal();
    showToast("Obnoveno výchozí nastavení");
  }

  // ---------- Instalace PWA ----------
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    dom.btnInstall.classList.remove("icon-btn--hidden");
  });

  dom.btnInstall.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    dom.btnInstall.classList.add("icon-btn--hidden");
  });

  window.addEventListener("appinstalled", () => {
    dom.btnInstall.classList.add("icon-btn--hidden");
    showToast("Aplikace nainstalována.");
  });

  // ---------- Event listenery ----------
  dom.btnNewGame.addEventListener("click", () => { SoundFX.uiClick(); newGame(); });
  dom.btnResetScore.addEventListener("click", () => { SoundFX.uiClick(); resetScore(); });
  dom.btnSettings.addEventListener("click", () => { SoundFX.uiClick(); openSettingsModal(); });
  dom.btnCloseSettings.addEventListener("click", () => { SoundFX.uiClick(); closeSettingsModal(); });
  dom.btnApplySettings.addEventListener("click", applySettingsFromModal);
  dom.btnRestoreDefaults.addEventListener("click", restoreDefaults);
  dom.settingsOverlay.addEventListener("click", (e) => {
    if (e.target === dom.settingsOverlay) closeSettingsModal();
  });
  dom.inputBoardSize.addEventListener("input", populateWinLengthOptions);
  dom.inputBoardSize.addEventListener("change", () => {
    dom.inputBoardSize.value = String(clampBoardSize(dom.inputBoardSize.value));
    populateWinLengthOptions();
  });
  dom.selectMode.addEventListener("change", updateConditionalFields);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSettingsModal();
  });

  // ---------- Service worker ----------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => { /* offline cache je jen bonus */ });
    });
  }

  // ---------- Start ----------
  applyAppearance();
  updateScoreboard();
  newGame();
})();
