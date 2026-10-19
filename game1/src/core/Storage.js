// Persistencia local de puntuaciones y partidas
class StorageManager {
  static getStats(gameId) {
    try {
      const data = localStorage.getItem(`stats_${gameId}`);
      return data ? JSON.parse(data) : { p1Wins: 0, p2Wins: 0, ties: 0 };
    } catch (_) {
      return { p1Wins: 0, p2Wins: 0, ties: 0 };
    }
  }

  static recordWin(gameId, winner) {
    const stats = this.getStats(gameId);
    if (winner === 'p1' || winner === 1 || winner === 'X') {
      stats.p1Wins = (stats.p1Wins || 0) + 1;
    } else if (winner === 'p2' || winner === 2 || winner === 'O' || winner === 'cpu') {
      stats.p2Wins = (stats.p2Wins || 0) + 1;
    } else {
      stats.ties = (stats.ties || 0) + 1;
    }

    try {
      localStorage.setItem(`stats_${gameId}`, JSON.stringify(stats));
    } catch (_) {}
    return stats;
  }

  static resetStats(gameId) {
    const fresh = { p1Wins: 0, p2Wins: 0, ties: 0 };
    try {
      localStorage.setItem(`stats_${gameId}`, JSON.stringify(fresh));
    } catch (_) {}
    return fresh;
  }
}

export { StorageManager };
