import { TicTacToeGame } from '../games/tictactoe/TicTacToeGame.js';
import { Connect4Game } from '../games/connect4/Connect4Game.js';
import { OcaGame } from '../games/oca/OcaGame.js';
import { ParchisGame } from '../games/parchis/ParchisGame.js';

export const GAME_CATALOG = [
  {
    id: 'tictactoe',
    title: '3 en Raya',
    subtitle: 'El duelo táctico más icónico',
    icon: '⭕',
    badge: '1P / 2P',
    color: '#38bdf8',
    gameClass: TicTacToeGame,
    available: true
  },
  {
    id: 'connect4',
    title: 'Conecta 4',
    subtitle: 'Gravedad, estrategia y 4 en línea',
    icon: '🔴',
    badge: '1P / 2P',
    color: '#ef4444',
    gameClass: Connect4Game,
    available: true
  },
  {
    id: 'oca',
    title: 'La Oca',
    subtitle: '¡De oca a oca y tiro porque me toca!',
    icon: '🦆',
    badge: 'Tablero 63',
    color: '#10b981',
    gameClass: OcaGame,
    available: true
  },
  {
    id: 'parchis',
    title: 'Parchís',
    subtitle: 'El rey de los juegos de mesa',
    icon: '🎲',
    badge: '1 a 4 Jug.',
    color: '#fbbf24',
    gameClass: ParchisGame,
    available: true
  },
  {
    id: 'flota',
    title: 'Hundir la Flota',
    subtitle: 'Agua, tocado y hundido',
    icon: '🚢',
    badge: 'Próximamente',
    color: '#a855f7',
    gameClass: null,
    available: false
  }
];
