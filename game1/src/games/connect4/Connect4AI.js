// IA para Conecta 4 con evaluación heurística de posiciones
export class Connect4AI {
  static getBestMove(grid, difficulty = 'hard') {
    const validCols = [];
    for (let c = 0; c < 7; c++) {
      if (grid[0][c] === 0) validCols.push(c);
    }

    if (validCols.length === 0) return null;

    // 1. ¿Puede ganar la CPU (2) en este turno?
    for (const c of validCols) {
      const r = this.getNextOpenRow(grid, c);
      grid[r][c] = 2;
      if (this.checkWin(grid, 2)) {
        grid[r][c] = 0;
        return c;
      }
      grid[r][c] = 0;
    }

    // 2. ¿Tiene el jugador (1) una victoria inminente que debamos bloquear?
    for (const c of validCols) {
      const r = this.getNextOpenRow(grid, c);
      grid[r][c] = 1;
      if (this.checkWin(grid, 1)) {
        grid[r][c] = 0;
        return c;
      }
      grid[r][c] = 0;
    }

    // 3. Evaluar cada columna por puntuación de posición (preferir centro y evitar regalar victoria)
    let bestScore = -Infinity;
    let bestCol = validCols[Math.floor(Math.random() * validCols.length)];

    // Orden de prioridad hacia el centro [3, 2, 4, 1, 5, 0, 6]
    const centerOrder = [3, 2, 4, 1, 5, 0, 6].filter(c => validCols.includes(c));

    for (const c of centerOrder) {
      const r = this.getNextOpenRow(grid, c);
      grid[r][c] = 2;

      // Evitar movimientos que permitan al rival ganar justo encima
      if (r > 0) {
        grid[r - 1][c] = 1;
        if (this.checkWin(grid, 1)) {
          grid[r - 1][c] = 0;
          grid[r][c] = 0;
          continue; // Movimiento peligroso
        }
        grid[r - 1][c] = 0;
      }

      let score = this.evaluateBoard(grid, 2);
      // Bonus por jugar más cerca del centro
      score += (3 - Math.abs(3 - c)) * 3;

      grid[r][c] = 0;

      if (score > bestScore) {
        bestScore = score;
        bestCol = c;
      }
    }

    return bestCol;
  }

  static getNextOpenRow(grid, col) {
    for (let r = 5; r >= 0; r--) {
      if (grid[r][col] === 0) return r;
    }
    return -1;
  }

  static checkWin(grid, piece) {
    // Horizontal
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === piece && grid[r][c+1] === piece && grid[r][c+2] === piece && grid[r][c+3] === piece) {
          return true;
        }
      }
    }
    // Vertical
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
        if (grid[r][c] === piece && grid[r+1][c] === piece && grid[r+2][c] === piece && grid[r+3][c] === piece) {
          return true;
        }
      }
    }
    // Diagonal positiva
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === piece && grid[r+1][c+1] === piece && grid[r+2][c+2] === piece && grid[r+3][c+3] === piece) {
          return true;
        }
      }
    }
    // Diagonal negativa
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === piece && grid[r-1][c+1] === piece && grid[r-2][c+2] === piece && grid[r-3][c+3] === piece) {
          return true;
        }
      }
    }
    return false;
  }

  static evaluateBoard(grid, piece) {
    let score = 0;
    // Centro
    for (let r = 0; r < 6; r++) {
      if (grid[r][3] === piece) score += 4;
    }
    return score;
  }
}
