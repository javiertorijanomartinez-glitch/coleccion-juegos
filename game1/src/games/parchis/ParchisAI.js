import { PARCHIS_COLORS, SAFE_SQUARES } from './ParchisRules.js';

export class ParchisAI {
  static getBestMove(player, roll, allPlayers) {
    const legalMoves = this.getLegalMoves(player, roll, allPlayers);
    if (legalMoves.length === 0) return null;

    // Prioridades estratégicas del Parchís tradicional:
    // 1. Salir de casa si saca un 5 (obligación en reglas españolas)
    // 2. Meter ficha en la meta
    // 3. Comer ficha rival (+20 casillas)
    // 4. Entrar en un seguro
    // 5. Avanzar la ficha más adelantada

    let bestMove = legalMoves[0];
    let bestScore = -Infinity;

    for (const move of legalMoves) {
      let score = 0;

      if (move.type === 'exit_home') {
        score += 1000; // Obligatorio y máxima prioridad
      }
      if (move.type === 'to_goal') {
        score += 600;
      }
      if (move.captures) {
        score += 400;
      }
      if (move.destPos && SAFE_SQUARES.includes(move.destPos)) {
        score += 100;
      }
      if (move.destType === 'corridor') {
        score += 60;
      }
      if (move.type === 'move_board') {
        score += move.token.pos;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  static getLegalMoves(player, roll, allPlayers) {
    const config = PARCHIS_COLORS[player.colorKey];
    const moves = [];

    // REGLA DEL 5 (ESPAÑA): Si sacas un 5 y tienes fichas en casa, es OBLIGATORIO sacar ficha a la Salida.
    // Simplemente se coloca en la casilla de salida (no se avanza ninguna posición adicional).
    if (roll === 5) {
      const homeTokens = player.tokens.filter(t => t.status === 'home');
      if (homeTokens.length > 0) {
        const salida = config.salida;
        const myTokensOnSalida = player.tokens.filter(t => t.status === 'board' && t.pos === salida);
        
        // Si no hay barrera propia en la salida, es obligatorio sacar
        if (myTokensOnSalida.length < 2) {
          const rivalOnSalida = this.findRivalOnSquare(salida, player.colorKey, allPlayers);
          return [{
            type: 'exit_home',
            token: homeTokens[0],
            destPos: salida,
            destType: 'board',
            captures: rivalOnSalida
          }];
        }
      }
    }

    // Fichas en el recorrido del tablero
    player.tokens.filter(t => t.status === 'board').forEach(token => {
      const distToEntrance = this.calcDistanceToEntrance(token.pos, config.metaEntrada);
      
      if (roll <= distToEntrance) {
        let newPos = token.pos + roll;
        if (newPos > 68) newPos -= 68;

        const tokensOnDest = this.getTokensOnSquare(newPos, allPlayers);
        const myTokensOnDest = tokensOnDest.filter(t => t.colorKey === player.colorKey);
        
        // No puede entrar en casilla con 2 fichas (barrera)
        if (tokensOnDest.length < 2 || (tokensOnDest.length === 1 && myTokensOnDest.length === 0)) {
          const rival = this.findRivalOnSquare(newPos, player.colorKey, allPlayers);
          const canCapture = rival && !SAFE_SQUARES.includes(newPos);
          moves.push({
            type: 'move_board',
            token,
            destPos: newPos,
            destType: 'board',
            captures: canCapture ? rival : null
          });
        }
      } else {
        // Pasa al pasillo de meta hacia el centro
        const corridorStep = roll - distToEntrance;
        if (corridorStep <= 8) {
          moves.push({
            type: corridorStep === 8 ? 'to_goal' : 'to_corridor',
            token,
            destPos: corridorStep,
            destType: corridorStep === 8 ? 'goal' : 'corridor',
            captures: null
          });
        }
      }
    });

    // Fichas en el pasillo de meta
    player.tokens.filter(t => t.status === 'corridor').forEach(token => {
      const newStep = token.pos + roll;
      if (newStep <= 8) {
        moves.push({
          type: newStep === 8 ? 'to_goal' : 'move_corridor',
          token,
          destPos: newStep,
          destType: newStep === 8 ? 'goal' : 'corridor',
          captures: null
        });
      }
    });

    return moves;
  }

  static calcDistanceToEntrance(fromPos, entrancePos) {
    if (entrancePos >= fromPos) {
      return entrancePos - fromPos;
    } else {
      return (68 - fromPos) + entrancePos;
    }
  }

  static getTokensOnSquare(square, allPlayers) {
    const res = [];
    allPlayers.forEach(p => {
      p.tokens.forEach(t => {
        if (t.status === 'board' && t.pos === square) {
          res.push({ ...t, colorKey: p.colorKey, playerId: p.id });
        }
      });
    });
    return res;
  }

  static findRivalOnSquare(square, myColorKey, allPlayers) {
    const tokens = this.getTokensOnSquare(square, allPlayers);
    const rivals = tokens.filter(t => t.colorKey !== myColorKey);
    return rivals.length === 1 ? rivals[0] : null;
  }
}
