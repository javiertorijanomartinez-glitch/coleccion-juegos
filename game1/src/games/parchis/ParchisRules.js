// Reglas oficiales españolas del Parchís:
// - Sentido antihorario
// - Salida 5 en el brazo Norte (Amarillo), Salida 22 en el brazo Oeste (Verde), Salida 39 en el brazo Sur (Rojo), Salida 56 en el brazo Este (Azul)
// - En 2 Jugadores: Rojo y Amarillo (esquinas opuestas)
export const PARCHIS_COLORS = {
  red:    { id: 'red',    name: 'Rojo',     hex: '#ef4444', darkHex: '#b91c1c', salida: 39, metaEntrada: 34 },
  blue:   { id: 'blue',   name: 'Azul',     hex: '#38bdf8', darkHex: '#0369a1', salida: 56, metaEntrada: 51 },
  yellow: { id: 'yellow', name: 'Amarillo', hex: '#fbbf24', darkHex: '#b45309', salida: 5,  metaEntrada: 68 },
  green:  { id: 'green',  name: 'Verde',    hex: '#10b981', darkHex: '#047857', salida: 22, metaEntrada: 17 }
};

// 12 Casillas de seguro tradicionales
export const SAFE_SQUARES = [5, 12, 17, 22, 29, 34, 39, 46, 51, 56, 63, 68];

export const TRACK_CELLS = {};
export const GOAL_CORRIDOR_CELLS = { yellow: [], blue: [], red: [], green: [] };

export const HOUSE_AREAS = {
  yellow: { x: 15, y: 15,  w: 165, h: 165, color: '#fbbf24', name: 'AMARILLO' },
  blue:   { x: 420, y: 15, w: 165, h: 165, color: '#38bdf8', name: 'AZUL' },
  red:    { x: 420, y: 420, w: 165, h: 165, color: '#ef4444', name: 'ROJO' },
  green:  { x: 15, y: 420,  w: 165, h: 165, color: '#10b981', name: 'VERDE' }
};

export const HOUSE_TOKEN_SLOTS = {
  yellow: [{ cx: 65, cy: 65 },  { cx: 130, cy: 65 },  { cx: 65, cy: 130 },  { cx: 130, cy: 130 }],
  blue:   [{ cx: 470, cy: 65 }, { cx: 535, cy: 65 },  { cx: 470, cy: 130 }, { cx: 535, cy: 130 }],
  red:    [{ cx: 470, cy: 470 }, { cx: 535, cy: 470 }, { cx: 470, cy: 535 }, { cx: 535, cy: 535 }],
  green:  [{ cx: 65, cy: 470 },  { cx: 130, cy: 470 },  { cx: 65, cy: 535 },  { cx: 130, cy: 535 }]
};

function generateBoardGeometry() {
  const armW = 240; // 180 to 420
  const laneW = armW / 3; // 80px cada carril
  const armL = 205; // 15 a 220
  const stepL = armL / 8; // 25.625px cada tablilla rectangular

  // =========================================================================
  // 1. BRAZO NORTE (AMARILLO / AZUL)
  // =========================================================================
  // Carril izquierdo (X: 180..260, Y: 15..220, adyacente a Casa Amarillo):
  // Casillas 1 a 8 avanzan hacia el centro
  // Casilla 5 es la SALIDA AMARILLO (la 5ª casilla desde el borde superior)
  for (let i = 0; i < 8; i++) {
    const num = 1 + i;
    const x = 180;
    const y = 15 + i * stepL;
    TRACK_CELLS[num] = { x, y, w: laneW, h: stepL, cx: x + laneW / 2, cy: y + stepL / 2 };
  }

  // Casilla 68 en el extremo exterior del carril central (Entrada a meta Amarillo)
  TRACK_CELLS[68] = {
    x: 180 + laneW,
    y: 15,
    w: laneW,
    h: stepL,
    cx: 180 + 1.5 * laneW,
    cy: 15 + stepL / 2
  };

  // Pasillo de meta Amarillo (7 casillas hacia el centro)
  GOAL_CORRIDOR_CELLS.yellow = [];
  for (let i = 0; i < 7; i++) {
    const x = 180 + laneW;
    const y = 15 + (i + 1) * stepL;
    GOAL_CORRIDOR_CELLS.yellow.push({ x, y, w: laneW, h: stepL, cx: x + laneW / 2, cy: y + stepL / 2 });
  }

  // Carril derecho (X: 340..420, Y: 220..15, adyacente a Casa Azul):
  // Casillas 60 a 67 avanzan desde el centro hacia el borde exterior
  for (let i = 0; i < 8; i++) {
    const num = 60 + i;
    const x = 180 + 2 * laneW;
    const y = 220 - (i + 1) * stepL;
    TRACK_CELLS[num] = { x, y, w: laneW, h: stepL, cx: x + laneW / 2, cy: y + stepL / 2 };
  }

  // =========================================================================
  // 2. BRAZO OESTE (AMARILLO / VERDE)
  // =========================================================================
  // Carril superior (X: 220..15, Y: 180..260, adyacente a Casa Amarillo):
  // Casillas 9 a 16 avanzan desde el centro hacia el borde exterior
  for (let i = 0; i < 8; i++) {
    const num = 9 + i;
    const x = 220 - (i + 1) * stepL;
    const y = 180;
    TRACK_CELLS[num] = { x, y, w: stepL, h: laneW, cx: x + stepL / 2, cy: y + laneW / 2 };
  }

  // Casilla 17 en el extremo exterior del carril central (Entrada a meta Verde)
  TRACK_CELLS[17] = {
    x: 15,
    y: 180 + laneW,
    w: stepL,
    h: laneW,
    cx: 15 + stepL / 2,
    cy: 180 + 1.5 * laneW
  };

  // Pasillo de meta Verde (7 casillas hacia el centro)
  GOAL_CORRIDOR_CELLS.green = [];
  for (let i = 0; i < 7; i++) {
    const x = 15 + (i + 1) * stepL;
    const y = 180 + laneW;
    GOAL_CORRIDOR_CELLS.green.push({ x, y, w: stepL, h: laneW, cx: x + stepL / 2, cy: y + laneW / 2 });
  }

  // Carril inferior (X: 15..220, Y: 340..420, adyacente a Casa Verde):
  // Casillas 18 a 25 avanzan hacia el centro
  // Casilla 22 es la SALIDA VERDE (la 5ª casilla desde el borde izquierdo)
  for (let i = 0; i < 8; i++) {
    const num = 18 + i;
    const x = 15 + i * stepL;
    const y = 180 + 2 * laneW;
    TRACK_CELLS[num] = { x, y, w: stepL, h: laneW, cx: x + stepL / 2, cy: y + laneW / 2 };
  }

  // =========================================================================
  // 3. BRAZO SUR (VERDE / ROJO)
  // =========================================================================
  // Carril izquierdo (X: 180..260, Y: 380..585, adyacente a Casa Verde):
  // Casillas 26 a 33 avanzan desde el centro hacia el borde exterior
  for (let i = 0; i < 8; i++) {
    const num = 26 + i;
    const x = 180;
    const y = 380 + i * stepL;
    TRACK_CELLS[num] = { x, y, w: laneW, h: stepL, cx: x + laneW / 2, cy: y + stepL / 2 };
  }

  // Casilla 34 en el extremo exterior del carril central (Entrada a meta Rojo)
  TRACK_CELLS[34] = {
    x: 180 + laneW,
    y: 585 - stepL,
    w: laneW,
    h: stepL,
    cx: 180 + 1.5 * laneW,
    cy: 585 - stepL / 2
  };

  // Pasillo de meta Rojo (7 casillas hacia el centro)
  GOAL_CORRIDOR_CELLS.red = [];
  for (let i = 0; i < 7; i++) {
    const x = 180 + laneW;
    const y = 585 - (i + 2) * stepL;
    GOAL_CORRIDOR_CELLS.red.push({ x, y, w: laneW, h: stepL, cx: x + laneW / 2, cy: y + stepL / 2 });
  }

  // Carril derecho (X: 340..420, Y: 585..380, adyacente a Casa Rojo):
  // Casillas 35 a 42 avanzan hacia el centro
  // Casilla 39 es la SALIDA ROJO (la 5ª casilla desde el borde inferior)
  for (let i = 0; i < 8; i++) {
    const num = 35 + i;
    const x = 180 + 2 * laneW;
    const y = 585 - (i + 1) * stepL;
    TRACK_CELLS[num] = { x, y, w: laneW, h: stepL, cx: x + laneW / 2, cy: y + stepL / 2 };
  }

  // =========================================================================
  // 4. BRAZO ESTE (ROJO / AZUL)
  // =========================================================================
  // Carril inferior (X: 380..585, Y: 340..420, adyacente a Casa Rojo):
  // Casillas 43 a 50 avanzan desde el centro hacia el borde exterior
  for (let i = 0; i < 8; i++) {
    const num = 43 + i;
    const x = 380 + i * stepL;
    const y = 180 + 2 * laneW;
    TRACK_CELLS[num] = { x, y, w: stepL, h: laneW, cx: x + stepL / 2, cy: y + laneW / 2 };
  }

  // Casilla 51 en el extremo exterior del carril central (Entrada a meta Azul)
  TRACK_CELLS[51] = {
    x: 585 - stepL,
    y: 180 + laneW,
    w: stepL,
    h: laneW,
    cx: 585 - stepL / 2,
    cy: 180 + 1.5 * laneW
  };

  // Pasillo de meta Azul (7 casillas hacia el centro)
  GOAL_CORRIDOR_CELLS.blue = [];
  for (let i = 0; i < 7; i++) {
    const x = 585 - (i + 2) * stepL;
    const y = 180 + laneW;
    GOAL_CORRIDOR_CELLS.blue.push({ x, y, w: stepL, h: laneW, cx: x + stepL / 2, cy: y + laneW / 2 });
  }

  // Carril superior (X: 585..380, Y: 180..260, adyacente a Casa Azul):
  // Casillas 52 a 59 avanzan hacia el centro
  // Casilla 56 es la SALIDA AZUL (la 5ª casilla desde el borde derecho)
  for (let i = 0; i < 8; i++) {
    const num = 52 + i;
    const x = 585 - (i + 1) * stepL;
    const y = 180;
    TRACK_CELLS[num] = { x, y, w: stepL, h: laneW, cx: x + stepL / 2, cy: y + laneW / 2 };
  }
}

generateBoardGeometry();
