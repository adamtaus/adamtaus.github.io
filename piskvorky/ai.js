/* Piškvorky: Vzdušný souboj — počítačový soupeř */

const AI = (() => {

  function pickDepth(size, difficulty) {
    if (size === 3) {
      return difficulty === "easy" ? 1 : difficulty === "medium" ? 4 : 9;
    }
    if (size === 4) {
      return difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
    }
    // 5x5 a větší
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

  function minimax(board, size, winLength, lines, depth, isMaximizing, alpha, beta, aiPlayer, humanPlayer) {
    const result = Game.findWinningLine(board, size, winLength);
    if (result) {
      const bonus = depth; // rychlejší výhra / pomalejší prohra je preferovaná
      return result.winner === aiPlayer ? 100000 + bonus : -100000 - bonus;
    }
    if (Game.isFull(board)) return 0;
    if (depth === 0) return evaluateBoard(board, lines, aiPlayer, humanPlayer, winLength);

    const moves = Game.availableMoves(board);

    if (isMaximizing) {
      let best = -Infinity;
      for (const move of moves) {
        board[move] = aiPlayer;
        const score = minimax(board, size, winLength, lines, depth - 1, false, alpha, beta, aiPlayer, humanPlayer);
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
        const score = minimax(board, size, winLength, lines, depth - 1, true, alpha, beta, aiPlayer, humanPlayer);
        board[move] = null;
        best = Math.min(best, score);
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
      return best;
    }
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
      // první tah na prázdné ploše — vždy střed nebo blízko středu, ušetří výpočet
      return Math.floor(board.length / 2);
    }

    const humanPlayer = Game.otherPlayer(aiPlayer);

    // náhodný tah dle obtížnosti (nováček/pilot občas chybuje)
    if (Math.random() < randomChance(difficulty)) {
      return moves[Math.floor(Math.random() * moves.length)];
    }

    const depth = pickDepth(size, difficulty);
    const lines = Game.getAllLines(size, winLength);

    let bestScore = -Infinity;
    let bestMoves = [];

    for (const move of moves) {
      board[move] = aiPlayer;
      const score = minimax(board, size, winLength, lines, depth - 1, false, -Infinity, Infinity, aiPlayer, humanPlayer);
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
