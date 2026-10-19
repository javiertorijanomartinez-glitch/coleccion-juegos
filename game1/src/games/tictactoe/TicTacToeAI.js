// IA para el 3 en Raya (Tic Tac Toe)
export class TicTacToeAI {
  // Encuentra el mejor movimiento para 'O' usando Minimax
  static getBestMove(board, difficulty = 'hard') {
    const available = [];
    board.forEach((cell, idx) => {
      if (!cell) available.push(idx);
    });

    if (available.length === 0) return null;

    // Modo fácil: movimiento aleatorio
    if (difficulty === 'easy' && Math.random() < 0.6) {
      return available[Math.floor(Math.random() * available.length)];
    }

    // Modo difícil: Minimax
    let bestScore = -Infinity;
    let bestMove = available[0];

    for (const move of available) {
      board[move] = 'O';
      const score = this.minimax(board, 0, false);
      board[move] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  static minimax(board, depth, isMaximizing) {
    const winner = this.checkWinner(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (board.every(cell => cell !== null)) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'O';
          const evalScore = this.minimax(board, depth + 1, false);
          board[i] = null;
          maxEval = Math.max(maxEval, evalScore);
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'X';
          const evalScore = this.minimax(board, depth + 1, true);
          board[i] = null;
          minEval = Math.min(minEval, evalScore);
        }
      }
      return minEval;
    }
  }

  static checkWinner(board) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
      [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }
}
