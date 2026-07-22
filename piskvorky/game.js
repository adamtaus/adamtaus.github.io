/* Piškvorky pro posádku — herní jádro (nezávislé na DOM) */

const Game = (() => {

  function createBoard(size) {
    return new Array(size * size).fill(null);
  }

  function toIndex(size, row, col) {
    return row * size + col;
  }

  const DIRECTIONS = [
    [0, 1],   // vodorovně
    [1, 0],   // svisle
    [1, 1],   // diagonála \
    [1, -1],  // diagonála /
  ];

  /**
   * Najde vítěznou linii, pokud existuje.
   * @returns {{winner:string,line:number[]}|null}
   */
  function findWinningLine(board, size, winLength) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const idx = toIndex(size, row, col);
        const player = board[idx];
        if (!player) continue;

        for (const [dr, dc] of DIRECTIONS) {
          const line = [idx];
          let r = row, c = col;
          for (let k = 1; k < winLength; k++) {
            r += dr; c += dc;
            if (r < 0 || r >= size || c < 0 || c >= size) break;
            const nIdx = toIndex(size, r, c);
            if (board[nIdx] !== player) break;
            line.push(nIdx);
          }
          if (line.length === winLength) {
            return { winner: player, line };
          }
        }
      }
    }
    return null;
  }

  function isFull(board) {
    return board.every((cell) => cell !== null);
  }

  function availableMoves(board) {
    const moves = [];
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) moves.push(i);
    }
    return moves;
  }

  function otherPlayer(player) {
    return player === "X" ? "O" : "X";
  }

  /**
   * Vrátí seznam všech možných "linií" (polí indexů) dané délky pro danou velikost.
   * Používá se pro heuristické hodnocení pozice v AI.
   */
  const lineCache = new Map();
  function getAllLines(size, winLength) {
    const key = `${size}-${winLength}`;
    if (lineCache.has(key)) return lineCache.get(key);

    const lines = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        for (const [dr, dc] of DIRECTIONS) {
          const endR = row + dr * (winLength - 1);
          const endC = col + dc * (winLength - 1);
          if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;

          const line = [];
          for (let k = 0; k < winLength; k++) {
            line.push(toIndex(size, row + dr * k, col + dc * k));
          }
          lines.push(line);
        }
      }
    }
    lineCache.set(key, lines);
    return lines;
  }

  return {
    createBoard,
    toIndex,
    findWinningLine,
    isFull,
    availableMoves,
    otherPlayer,
    getAllLines,
  };
})();
