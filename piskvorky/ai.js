/* Piškvorky pro posádku — počítačový soupeř */

const AI = (() => {

  const LARGE_BOARD_THRESHOLD = 5; // nad touto velikostí se prohledávají jen tahy poblíž obsazených polí
  const NEIGHBOR_RADIUS = 2;

  function pickDepth(size, difficulty) {
    if (size === 3) {
      return difficulty === "easy" ? 1 : difficulty === "medium" ? 4 : 9;
    }
    if (size === 4) {
      return difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
    }
    if (size === 5) {
      return difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
    }
    // velké plochy (6-20): prohledávání je omezené na okolí obsazených polí, hloubka může zůstat malá
    return difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
  }

  function randomChance(difficulty) {
    if (difficulty === "easy") return 0.55;
    if (difficulty === "medium") return 0.15;
    return 0;
  }

  function weightFor(count, winLength) {
    if (count >= winLength) return 100000;
    return Math.pow(10, count);
  }

  function evaluateBoard(board, lines, aiPlayer, humanPlayer, winLength) {
    let score = 0;
    for (const line of lines) {
      let aiCount = 0;
      let humanCount = 0;
      for (const idx of line) {
        const v = board[idx];
        if (v === aiPlayer) aiCount++;
        else if (v === humanPlayer) humanCount++;
      }
      if (aiCount > 0 && humanCount > 0) continue;
      if (aiCount > 0) score += weightFor(aiCount, winLength);
      else if (humanCount > 0) score -= weightFor(humanCount, winLength);
    }
    return score;
  }

  /** Tahy poblíž již obsazených polí — drží prohledávací strom na velkých plochách zvládnutelný. */
  function getNeighborMoves(board, size) {
    const candidates = new Set();
    let anyFilled = false;
    for (let idx = 0; idx < board.length; idx++) {
      if (!board[idx]) continue;
      anyFilled = true;
      const row = Math.floor(idx / size);
      const col = idx % size;
      for (let dr = -NEIGHBOR_RADIUS; dr <= NEIGHBOR_RADIUS; dr++) {
        for (let dc = -NEIGHBOR_RADIUS; dc <= NEIGHBOR_RADIUS; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = row + dr, c = col + dc;
          if (r < 0 || r >= size || c < 0 || c >= size) continue;
          const nIdx = r * size + c;
          if (!board[nIdx]) candidates.add(nIdx);
        }
      }
    }
    if (!anyFilled) return Game.availableMoves(board);
    return Array.from(candidates);
  }

  /** Seřadí a ořízne tahy podle rychlého heuristického ohodnocení — pro dané "forPlayer". */
  function orderedMoves(board, size, winLength, lines, forPlayer, cap) {
    const raw = getNeighborMoves(board, size);
    if (raw.length <= cap) return raw;

    const opponent = Game.otherPlayer(forPlayer);
    const scored = raw.map((move) => {
      board[move] = forPlayer;
      const win = Game.findWinningLine(board, size, winLength);
      const score = win && win.winner === forPlayer
        ? 1e6
        : evaluateBoard(board, lines, forPlayer, opponent, winLength);
      board[move] = null;
      return { move, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, cap).map((s) => s.move);
  }

  function capForDepth(depth) {
    if (depth <= 1) return 18;
    if (depth === 2) return 12;
    return 8;
  }

  function minimax(board, size, winLength, lines, depth, isMaximizing, alpha, beta, aiPlayer, humanPlayer, useCandidates) {
    const result = Game.findWinningLine(board, size, winLength);
    if (result) {
      const bonus = depth; // rychlejší výhra / pomalejší prohra je preferovaná
      return result.winner === aiPlayer ? 100000 + bonus : -100000 - bonus;
    }
    if (Game.isFull(board)) return 0;
    if (depth === 0) return evaluateBoard(board, lines, aiPlayer, humanPlayer, winLength);

    const forPlayer = isMaximizing ? aiPlayer : humanPlayer;
    const moves = useCandidates
      ? orderedMoves(board, size, winLength, lines, forPlayer, capForDepth(depth))
      : Game.availableMoves(board);

    if (isMaximizing) {
      let best = -Infinity;
      for (const move of moves) {
        board[move] = aiPlayer;
        const score = minimax(board, size, winLength, lines, depth - 1, false, alpha, beta, aiPlayer, humanPlayer, useCandidates);
        board[move] = null;
        best = Math.max(best, score);
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const move of moves) {
        board[move] = humanPlayer;
        const score = minimax(board, size, winLength, lines, depth - 1, true, alpha, beta, aiPlayer, humanPlayer, useCandidates);
        board[move] = null;
        best = Math.min(best, score);
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
      return best;
    }
  }

  function findImmediateWin(board, moves, player, size, winLength) {
    for (const move of moves) {
      board[move] = player;
      const win = Game.findWinningLine(board, size, winLength);
      board[move] = null;
      if (win && win.winner === player) return move;
    }
    return -1;
  }

  /**
   * Vybere tah pro počítač.
   * @param {Array} board
   * @param {number} size
   * @param {number} winLength
   * @param {string} aiPlayer 'X' | 'O'
   * @param {'easy'|'medium'|'hard'} difficulty
   * @returns {number} index tahu
   */
  function chooseMove(board, size, winLength, aiPlayer, difficulty) {
    const moves = Game.availableMoves(board);
    if (moves.length === 0) return -1;
    if (moves.length === board.length) {
      // první tah na prázdné ploše — vždy střed, ušetří výpočet
      const mid = Math.floor(size / 2);
      return Game.toIndex(size, mid, mid);
    }

    const humanPlayer = Game.otherPlayer(aiPlayer);

    // volnou výhru nikdy nenechá ležet ladem
    const winMove = findImmediateWin(board, moves, aiPlayer, size, winLength);
    if (winMove >= 0) return winMove;

    // od střední obtížnosti výš vždy zablokuje soupeřovu hrozící výhru
    if (difficulty !== "easy") {
      const blockMove = findImmediateWin(board, moves, humanPlayer, size, winLength);
      if (blockMove >= 0) return blockMove;
    }

    // náhodný tah dle obtížnosti (nováček/pilot občas chybuje)
    if (Math.random() < randomChance(difficulty)) {
      return moves[Math.floor(Math.random() * moves.length)];
    }

    const depth = pickDepth(size, difficulty);
    const lines = Game.getAllLines(size, winLength);
    const useCandidates = size > LARGE_BOARD_THRESHOLD;
    const rootMoves = useCandidates
      ? orderedMoves(board, size, winLength, lines, aiPlayer, capForDepth(depth))
      : moves;

    let bestScore = -Infinity;
    let bestMoves = [];

    for (const move of rootMoves) {
      board[move] = aiPlayer;
      const score = minimax(board, size, winLength, lines, depth - 1, false, -Infinity, Infinity, aiPlayer, humanPlayer, useCandidates);
      board[move] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  return { chooseMove };
})();
