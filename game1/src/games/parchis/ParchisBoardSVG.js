import { 
  PARCHIS_COLORS, 
  SAFE_SQUARES, 
  TRACK_CELLS, 
  GOAL_CORRIDOR_CELLS, 
  HOUSE_AREAS, 
  HOUSE_TOKEN_SLOTS 
} from './ParchisRules.js';

export class ParchisBoardSVG {
  static renderSVG(players, onPieceClick, movablePieceIds = []) {
    const W = 600;
    const H = 600;

    let svg = `<svg viewBox="0 0 ${W} ${H}" class="parchis-board-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="p-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.8"/>
        </filter>
        <filter id="p-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#ffd700" flood-opacity="1"/>
        </filter>
        <radialGradient id="grad-yellow" cx="35%" cy="35%">
          <stop offset="0%" stop-color="#fffbeb"/><stop offset="30%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#b45309"/>
        </radialGradient>
        <radialGradient id="grad-blue" cx="35%" cy="35%">
          <stop offset="0%" stop-color="#f0f9ff"/><stop offset="30%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0369a1"/>
        </radialGradient>
        <radialGradient id="grad-red" cx="35%" cy="35%">
          <stop offset="0%" stop-color="#fef2f2"/><stop offset="30%" stop-color="#ef4444"/><stop offset="100%" stop-color="#991b1b"/>
        </radialGradient>
        <radialGradient id="grad-green" cx="35%" cy="35%">
          <stop offset="0%" stop-color="#f0fdf4"/><stop offset="30%" stop-color="#10b981"/><stop offset="100%" stop-color="#065f46"/>
        </radialGradient>
      </defs>

      <!-- Fondo general de madera / pizarra oscura -->
      <rect width="${W}" height="${H}" rx="16" fill="#111628" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>

      <!-- 4 Casas en las esquinas más compactas (165x165) -->
      ${Object.entries(HOUSE_AREAS).map(([key, h]) => {
        const activeColorKeys = players.map(p => p.colorKey);
        const isActive = activeColorKeys.includes(key);
        const houseOpacity = isActive ? '1' : '0.22';
        return `
        <g class="parchis-house" data-house="${key}" opacity="${houseOpacity}">
          <rect x="${h.x}" y="${h.y}" width="${h.w}" height="${h.h}" rx="18" fill="#182035" stroke="${h.color}" stroke-width="2.5"/>
          <circle cx="${h.x + h.w/2}" cy="${h.y + h.h/2}" r="64" fill="rgba(255,255,255,0.03)" stroke="${h.color}" stroke-width="1.5" stroke-dasharray="4 2"/>
          <text x="${h.x + h.w/2}" y="${h.y + h.h/2 + 5}" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="900" font-size="16" fill="${h.color}" letter-spacing="1">${h.name}</text>
        </g>
        `;
      }).join('')}
    `;

    // Renderizar casillas del recorrido (1 a 68) como tablillas rectangulares alargadas
    for (let i = 1; i <= 68; i++) {
      const c = TRACK_CELLS[i];
      if (!c) continue;

      const isSafe = SAFE_SQUARES.includes(i);
      let fill = '#1c243c';
      let stroke = 'rgba(255,255,255,0.18)';
      let isSalida = false;
      let salidaColor = '';

      // Salidas
      if (i === 5) { fill = 'rgba(251, 191, 36, 0.45)'; stroke = '#fbbf24'; isSalida = true; salidaColor = '#fbbf24'; }
      else if (i === 22) { fill = 'rgba(16, 185, 129, 0.45)'; stroke = '#10b981'; isSalida = true; salidaColor = '#10b981'; }
      else if (i === 39) { fill = 'rgba(239, 68, 68, 0.45)'; stroke = '#ef4444'; isSalida = true; salidaColor = '#ef4444'; }
      else if (i === 56) { fill = 'rgba(56, 189, 248, 0.45)'; stroke = '#38bdf8'; isSalida = true; salidaColor = '#38bdf8'; }
      else if (isSafe) { fill = '#283350'; stroke = '#94a3b8'; }

      svg += `
        <rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="${isSalida ? '2' : '1.2'}"/>
        ${isSafe && !isSalida ? `<circle cx="${c.cx}" cy="${c.cy}" r="3.5" fill="#cbd5e1" opacity="0.65"/>` : ''}
        ${isSalida ? `<text x="${c.cx}" y="${c.cy + 3}" text-anchor="middle" font-size="7.5" font-family="'Fredoka', sans-serif" font-weight="900" fill="${salidaColor}" opacity="0.95">SALIDA</text>` : ''}
        <text x="${c.x + 3.5}" y="${c.y + 10.5}" font-size="8" font-family="'Outfit', sans-serif" fill="rgba(255,255,255,0.6)" font-weight="800">${i}</text>
      `;
    }

    // Renderizar los 4 Pasillos de meta
    const corridorColors = [
      { key: 'yellow', hex: '#fbbf24' },
      { key: 'green',  hex: '#10b981' },
      { key: 'red',    hex: '#ef4444' },
      { key: 'blue',   hex: '#38bdf8' }
    ];

    corridorColors.forEach(cc => {
      const cells = GOAL_CORRIDOR_CELLS[cc.key];
      cells.forEach((c, step) => {
        svg += `
          <rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="3" fill="${cc.hex}" opacity="0.45" stroke="${cc.hex}" stroke-width="1.2"/>
          <text x="${c.cx}" y="${c.cy + 3}" text-anchor="middle" font-size="8" font-family="'Outfit', sans-serif" fill="#ffffff" font-weight="900">${step + 1}</text>
        `;
      });
    });

    // Triángulos de Meta Central (centro de 220 a 380 en X e Y)
    const cx = 300, cy = 300;
    const xL = 220, xR = 380;
    const yT = 220, yB = 380;

    svg += `
      <!-- Triángulo Central Amarillo (Norte) -->
      <polygon points="${xL},${yT} ${xR},${yT} ${cx},${cy}" fill="#fbbf24" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
      <!-- Triángulo Central Azul (Este) -->
      <polygon points="${xR},${yT} ${xR},${yB} ${cx},${cy}" fill="#38bdf8" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
      <!-- Triángulo Central Rojo (Sur) -->
      <polygon points="${xR},${yB} ${xL},${yB} ${cx},${cy}" fill="#ef4444" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
      <!-- Triángulo Central Verde (Oeste) -->
      <polygon points="${xL},${yB} ${xL},${yT} ${cx},${cy}" fill="#10b981" opacity="0.85" stroke="#ffffff" stroke-width="1"/>
      
      <!-- Trofeo Central -->
      <circle cx="${cx}" cy="${cy}" r="22" fill="#141a2d" stroke="#ffd700" stroke-width="2.5" filter="url(#p-shadow)"/>
      <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="18">🏆</text>
    `;

    // Renderizar FICHAS MÁS GRANDES Y VISIBLES (radio 14px)
    players.forEach(player => {
      player.tokens.forEach((token, idx) => {
        const coords = this.getTokenCoords(player.colorKey, token, idx, players);
        const isMovable = movablePieceIds.includes(`${player.colorKey}_${token.id}`);
        const gradName = `grad-${player.colorKey}`;
        const tokenRadius = 14;

        svg += `
          <g class="parchis-token-group ${isMovable ? 'movable' : ''}" 
             data-token-id="${player.colorKey}_${token.id}" 
             data-player-color="${player.colorKey}"
             style="cursor: ${isMovable ? 'pointer' : 'default'};">
            
            ${isMovable ? `
              <circle cx="${coords.x}" cy="${coords.y}" r="${tokenRadius + 6}" fill="none" stroke="#ffd700" stroke-width="3.5" filter="url(#p-glow)">
                <animate attributeName="r" values="${tokenRadius + 5};${tokenRadius + 9};${tokenRadius + 5}" dur="1s" repeatCount="indefinite"/>
              </circle>
            ` : ''}

            <circle cx="${coords.x}" cy="${coords.y}" r="${tokenRadius}" 
                    fill="url(#${gradName})" 
                    stroke="#ffffff" 
                    stroke-width="2.5" 
                    filter="url(#p-shadow)"/>
            <text x="${coords.x}" y="${coords.y + 4.5}" 
                  text-anchor="middle" 
                  font-family="'Fredoka', sans-serif" 
                  font-weight="900" 
                  font-size="13" 
                  fill="#ffffff">${token.id}</text>
          </g>
        `;
      });
    });

    svg += `</svg>`;
    return svg;
  }

  static getTokenCoords(colorKey, token, tokenIndex, allPlayers) {
    if (token.status === 'home') {
      const slot = HOUSE_TOKEN_SLOTS[colorKey][tokenIndex];
      return { x: slot.cx, y: slot.cy };
    }

    if (token.status === 'board') {
      const c = TRACK_CELLS[token.pos];
      if (!c) return { x: 300, y: 300 };

      // Comprobar si hay otra ficha en la misma casilla para desplazarlas ligeramente
      let sameSquareTokens = [];
      allPlayers.forEach(p => {
        p.tokens.forEach(t => {
          if (t.status === 'board' && t.pos === token.pos) {
            sameSquareTokens.push(t);
          }
        });
      });

      if (sameSquareTokens.length > 1) {
        const orderIdx = sameSquareTokens.findIndex(t => t.id === token.id);
        const offset = orderIdx === 0 ? -9 : 9;
        // Desplazar a lo largo del eje más ancho
        if (c.w > c.h) {
          return { x: c.cx + offset, y: c.cy };
        } else {
          return { x: c.cx, y: c.cy + offset };
        }
      }

      return { x: c.cx, y: c.cy };
    }

    if (token.status === 'corridor') {
      const cells = GOAL_CORRIDOR_CELLS[colorKey];
      const pt = cells[token.pos - 1];
      return pt ? { x: pt.cx, y: pt.cy } : { x: 300, y: 300 };
    }

    if (token.status === 'goal') {
      const offsets = [
        { x: -10, y: -10 }, { x: 10, y: -10 }, { x: -10, y: 10 }, { x: 10, y: 10 }
      ];
      const off = offsets[tokenIndex % 4];
      return { x: 300 + off.x, y: 300 + off.y };
    }

    return { x: 300, y: 300 };
  }
}
