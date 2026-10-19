/**
 * StaffVisualizer.js
 * Visualizador interactivo de Gran Pentagrama (Clave de Sol + Clave de Fa) mediante SVG.
 * Soporta compás dinámico en tiempo real, todo el registro de 88 teclas de piano (A0 a C8),
 * y codificación visual de Mano Izquierda (Clave de Fa / Azul) vs Mano Derecha (Clave de Sol / Dorado).
 */

export class StaffVisualizer {
  constructor(containerElement) {
    this.container = containerElement;
    this.activeNotes = new Set(); // Notas que se están tocando actualmente
    this.targetNote = null;       // Nota objetivo en modo guiado
    this.targetHand = null;       // Mano ('left' | 'right')
    this.notationType = 'solfege'; // 'solfege' (Do, Re, Mi) o 'anglo' (C, D, E)
    this.timeSignature = { num: 4, denom: 4 };

    // Dimensiones del Gran Pentagrama SVG
    this.viewWidth = 800;
    this.viewHeight = 180;
    this.lineSpacing = 11;
    this.stepSize = 5.5; // Distancia entre línea y espacio adyacente

    // Líneas Pentagrama Superior (Clave de Sol): F5, D5, B4, G4, E4
    // F5=30, D5=41, B4=52, G4=63, E4=74
    // C4 (Do central / Ledger line central) = 85
    // Líneas Pentagrama Inferior (Clave de Fa): A3, F3, D3, B2, G2
    // A3=96, F3=107, D3=118, B2=129, G2=140
    this.trebleTopLineY = 30;
    this.c4Y = 85;
    this.bassTopLineY = 96;

    this.notePositions = this._calculateAll88NotePositions();
    this.initSvg();
  }

  setNotation(type) {
    this.notationType = type;
    this.render();
  }

  setTimeSignature(numerator, denominator = 4) {
    this.timeSignature = { num: numerator, denom: denominator };
    const numEls = this.container.querySelectorAll('.time-sig-num');
    const denomEls = this.container.querySelectorAll('.time-sig-denom');
    numEls.forEach(el => el.textContent = numerator);
    denomEls.forEach(el => el.textContent = denominator);
  }

  _calculateAll88NotePositions() {
    const baseOffsets = { 'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6 };
    const solfegeNames = { 'C': 'Do', 'D': 'Re', 'E': 'Mi', 'F': 'Fa', 'G': 'Sol', 'A': 'La', 'B': 'Si' };
    const positions = {};

    // Cubrir todo el rango del piano de 88 teclas: A0 a C8
    for (let oct = 0; oct <= 8; oct++) {
      const bases = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      for (const base of bases) {
        // En octava 0 solo existen A0, B0 en un piano de 88 teclas
        if (oct === 0 && !['A', 'B'].includes(base)) continue;
        // En octava 8 solo existe C8
        if (oct === 8 && base !== 'C') continue;

        const naturalKey = `${base}${oct}`;
        // Paso diatónico respecto a Do4 (C4 = 0)
        const step = (oct - 4) * 7 + baseOffsets[base];
        const y = this.c4Y - (step * this.stepSize);
        const hand = step < 0 ? 'left' : 'right';

        positions[naturalKey] = {
          y,
          step,
          isSharp: false,
          baseNote: base,
          octave: oct,
          hand,
          solfege: `${solfegeNames[base]}${oct}`,
          anglo: naturalKey,
          ledgerLines: this._getLedgerLines(step, y)
        };

        // Notas sostenidas (#)
        if (['C', 'D', 'F', 'G', 'A'].includes(base)) {
          if (oct === 0 && base !== 'A') continue;
          if (oct === 8) continue;

          const sharpKey = `${base}#${oct}`;
          positions[sharpKey] = {
            y,
            step,
            isSharp: true,
            baseNote: base,
            octave: oct,
            hand,
            solfege: `${solfegeNames[base]}#${oct}`,
            anglo: sharpKey,
            ledgerLines: this._getLedgerLines(step, y)
          };
        }
      }
    }

    return positions;
  }

  _getLedgerLines(step, noteY) {
    const lines = [];

    // 1. Do central C4 (step 0, y=85)
    if (step === 0) {
      lines.push(this.c4Y);
      return lines;
    }

    // 2. Líneas adicionales superiores a Clave de Sol (por encima de F5 / step 10 / y=30)
    // A5 = step 12 (y=19), C6 = step 14 (y=8), etc.
    if (step >= 12) {
      for (let y = this.trebleTopLineY - this.lineSpacing; y >= noteY - 1; y -= this.lineSpacing) {
        lines.push(y);
      }
    }

    // 3. Líneas adicionales inferiores a Clave de Fa (por debajo de G2 / step -12 / y=140)
    // E2 = step -14 (y=151), C2 = step -16 (y=162), A1 = step -18 (y=173)
    if (step <= -14) {
      const bassBottomLine = this.bassTopLineY + 4 * this.lineSpacing; // 140
      for (let y = bassBottomLine + this.lineSpacing; y <= noteY + 1; y += this.lineSpacing) {
        lines.push(y);
      }
    }

    return lines;
  }

  initSvg() {
    const trebleLines = [0, 1, 2, 3, 4].map(i => {
      const y = this.trebleTopLineY + i * this.lineSpacing;
      return `<line x1="20" y1="${y}" x2="${this.viewWidth - 20}" y2="${y}" class="staff-line treble-line" />`;
    }).join('');

    const bassLines = [0, 1, 2, 3, 4].map(i => {
      const y = this.bassTopLineY + i * this.lineSpacing;
      return `<line x1="20" y1="${y}" x2="${this.viewWidth - 20}" y2="${y}" class="staff-line bass-line" />`;
    }).join('');

    this.container.innerHTML = `
      <svg id="pentagramSvg" viewBox="0 0 ${this.viewWidth} ${this.viewHeight}" preserveAspectRatio="xMidYMid meet" class="staff-svg">
        <defs>
          <!-- Filtro de resplandor neón Dorado (Mano Derecha) -->
          <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <!-- Filtro de resplandor neón Azul/Cian (Mano Izquierda) -->
          <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Fondo del Gran Pentagrama -->
        <rect x="0" y="0" width="${this.viewWidth}" height="${this.viewHeight}" rx="12" class="staff-bg" />

        <!-- Llave inicial de Gran Pentagrama (Brace vertical izquierda) -->
        <line x1="20" y1="${this.trebleTopLineY}" x2="20" y2="${this.bassTopLineY + 4 * this.lineSpacing}" stroke="#64748b" stroke-width="2.5" />

        <!-- 5 Líneas Clave de Sol (Superior) -->
        <g class="staff-lines treble-stave">
          ${trebleLines}
        </g>

        <!-- 5 Líneas Clave de Fa (Inferior) -->
        <g class="staff-lines bass-stave">
          ${bassLines}
        </g>

        <!-- Clave de Sol (Mano Derecha) -->
        <g class="treble-clef" transform="translate(36, 26) scale(0.62)">
          <path d="M 28 65 C 24 55 24 40 33 32 C 40 25 50 25 52 35 C 53 45 42 53 33 53 C 24 53 14 45 14 30 C 14 12 30 -5 45 -20 C 52 -28 55 -40 50 -55 C 47 -64 38 -72 30 -72 C 22 -72 16 -65 17 -58 C 18 -52 23 -48 29 -50 C 33 -51 34 -47 31 -42 C 24 -30 7 -10 7 22 C 7 42 20 62 38 65 C 44 66 52 63 56 56 C 60 48 58 38 52 32 C 48 27 41 27 37 32 C 34 36 36 42 41 43 C 44 43 45 40 44 38 C 42 37 40 38 39 41 C 37 38 41 33 46 36 C 49 38 50 43 47 47 C 43 53 36 53 32 48 C 26 40 28 26 38 18 C 50 8 68 25 61 44 C 58 52 50 58 40 60 L 40 75 C 40 85 36 95 28 98 C 20 101 12 96 14 88 C 15 82 23 80 27 86 C 29 89 27 94 22 93 C 26 95 32 91 32 82 L 32 65 Z" fill="#e2e8f0" opacity="0.85" />
        </g>

        <!-- Clave de Fa (Mano Izquierda) -->
        <g class="bass-clef" transform="translate(34, 98) scale(0.68)">
          <path d="M 8 16 C 8 10 13 6 19 6 C 25 6 30 10 30 16 C 30 28 17 38 7 49 C 13 40 22 35 30 35 C 43 35 52 44 52 54 C 52 66 41 75 28 75 C 14 75 5 64 5 48 C 5 28 15 13 26 1" fill="none" stroke="#e2e8f0" stroke-width="4.5" stroke-linecap="round" opacity="0.85"/>
          <circle cx="18" cy="16" r="4.2" fill="#e2e8f0" opacity="0.9" />
          <circle cx="43" cy="16" r="2.8" fill="#e2e8f0" opacity="0.9" />
          <circle cx="43" cy="34" r="2.8" fill="#e2e8f0" opacity="0.9" />
        </g>

        <!-- Insignias de Mano Derecha (Clave de Sol) y Mano Izquierda (Clave de Fa) -->
        <g class="clef-hand-badges">
          <rect x="70" y="23" width="38" height="16" rx="4" fill="rgba(251, 191, 36, 0.15)" stroke="#fbbf24" stroke-width="1" />
          <text x="89" y="34.5" class="clef-hand-label hand-right" fill="#fbbf24" font-size="8.5" font-weight="800" text-anchor="middle">MD 🤚</text>

          <rect x="70" y="89" width="38" height="16" rx="4" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="1" />
          <text x="89" y="100.5" class="clef-hand-label hand-left" fill="#38bdf8" font-size="8.5" font-weight="800" text-anchor="middle">MI ✋</text>
        </g>

        <!-- Compás dinámico en Clave de Sol -->
        <g class="time-signature treble-time-sig" transform="translate(126, 28)">
          <text x="0" y="20" class="time-sig-num" font-size="20" font-weight="800" fill="#f8fafc" text-anchor="middle">${this.timeSignature.num}</text>
          <text x="0" y="42" class="time-sig-denom" font-size="20" font-weight="800" fill="#f8fafc" text-anchor="middle">${this.timeSignature.denom}</text>
        </g>

        <!-- Compás dinámico en Clave de Fa -->
        <g class="time-signature bass-time-sig" transform="translate(126, 94)">
          <text x="0" y="20" class="time-sig-num" font-size="20" font-weight="800" fill="#f8fafc" text-anchor="middle">${this.timeSignature.num}</text>
          <text x="0" y="42" class="time-sig-denom" font-size="20" font-weight="800" fill="#f8fafc" text-anchor="middle">${this.timeSignature.denom}</text>
        </g>

        <!-- Línea divisoria de compás inicial tras la métrica -->
        <line x1="148" y1="${this.trebleTopLineY}" x2="148" y2="${this.trebleTopLineY + 4 * this.lineSpacing}" stroke="#64748b" stroke-width="1.5" opacity="0.6" />
        <line x1="148" y1="${this.bassTopLineY}" x2="148" y2="${this.bassTopLineY + 4 * this.lineSpacing}" stroke="#64748b" stroke-width="1.5" opacity="0.6" />

        <!-- Capa dinámica de notas de canciones en curso -->
        <g id="songNotesLayer"></g>

        <!-- Capa de notas interactivas pulsadas por el usuario -->
        <g id="activeNotesLayer"></g>

        <!-- Capa de efectos de partículas y destellos -->
        <g id="fxLayer"></g>
      </svg>
    `;

    this.activeLayer = this.container.querySelector('#activeNotesLayer');
    this.songLayer = this.container.querySelector('#songNotesLayer');
    this.fxLayer = this.container.querySelector('#fxLayer');
  }

  noteOn(noteName) {
    this.activeNotes.add(noteName);
    this.renderActiveNotes();
    this.createHitParticle(noteName);
  }

  noteOff(noteName) {
    this.activeNotes.delete(noteName);
    this.renderActiveNotes();
  }

  setTargetNote(currentStep, upcomingNotes = [], hand = null, pastNotes = []) {
    this.targetNote = currentStep;
    this.targetHand = hand;
    this.upcomingSteps = upcomingNotes;
    this.pastSteps = pastNotes;
    this.renderSongGuide(currentStep, upcomingNotes, hand, pastNotes);
  }

  clearTargetNote() {
    this.targetNote = null;
    this.targetHand = null;
    this.upcomingSteps = [];
    this.pastSteps = [];
    if (this.songLayer) this.songLayer.innerHTML = '';
  }

  _isLeftHandNote(noteName) {
    if (!noteName) return false;
    const m = noteName.match(/^([A-G]#?)([0-8])$/);
    return m ? parseInt(m[2]) < 4 : false;
  }

  _filterNotesByHand(notesList, hand) {
    if (!Array.isArray(notesList)) return [];
    if (!hand || hand === 'both') return notesList;
    if (hand === 'right') {
      return notesList.filter(n => {
        const h = n.hand || (n.note && !this._isLeftHandNote(n.note) ? 'right' : 'left');
        return h === 'right';
      });
    }
    if (hand === 'left') {
      return notesList.filter(n => {
        const h = n.hand || (n.note && this._isLeftHandNote(n.note) ? 'left' : 'right');
        return h === 'left';
      });
    }
    return notesList;
  }

  renderActiveNotes() {
    if (!this.activeLayer) return;

    // En modo canción (guiado o demo), no dibujar notas activas sueltas por el pentagrama
    // para evitar la duplicación caótica de notas sobre la partitura deslizante
    if (this.targetNote) {
      this.activeLayer.innerHTML = '';
      return;
    }

    let svgHtml = '';
    const centerX = 320;
    const spacing = 40;
    const notesArray = Array.from(this.activeNotes);

    notesArray.forEach((noteName, idx) => {
      const data = this.notePositions[noteName];
      if (!data) return;

      const x = centerX + (idx - (notesArray.length - 1) / 2) * spacing;
      const y = data.y;
      const label = this.notationType === 'solfege' ? data.solfege : data.anglo;
      const isLeftHand = data.hand === 'left';
      const glowFilter = isLeftHand ? 'url(#glowCyan)' : 'url(#glowGold)';
      const handColor = isLeftHand ? 'var(--accent-cyan)' : 'var(--accent-gold)';
      const handLabel = isLeftHand ? '✋' : '🤚';

      const ledgerHtml = (data.ledgerLines || []).map(ly => `
        <line x1="${x - 16}" y1="${ly}" x2="${x + 16}" y2="${ly}" class="ledger-line active" style="stroke: ${handColor};" />
      `).join('');

      const sharpHtml = data.isSharp ? `
        <text x="${x - 18}" y="${y + 5}" class="accidental-sharp" style="fill: ${handColor};" filter="${glowFilter}">♯</text>
      ` : '';

      const stemUp = isLeftHand ? y >= 118 : y >= 52;
      const stemX = stemUp ? x + 7.5 : x - 7.5;
      const stemY2 = stemUp ? y - 28 : y + 28;

      svgHtml += `
        <g class="active-note-group ${isLeftHand ? 'is-left-hand' : 'is-right-hand'}" data-note="${noteName}">
          ${ledgerHtml}
          ${sharpHtml}
          <circle cx="${x}" cy="${y}" r="14" class="note-halo" style="fill: ${handColor}; opacity: 0.25;" />
          <ellipse cx="${x}" cy="${y}" rx="8.5" ry="6.2" transform="rotate(-20, ${x}, ${y})" class="note-head active" style="fill: ${handColor};" filter="${glowFilter}" />
          <line x1="${stemX}" y1="${y}" x2="${stemX}" y2="${stemY2}" class="note-stem active" style="stroke: ${handColor}; stroke-width: 2.2;" />
          <rect x="${x - 22}" y="${Math.min(156, Math.max(y + 14, 150))}" width="44" height="18" rx="5" class="note-badge-bg" style="border-color: ${handColor};" />
          <text x="${x}" y="${Math.min(168, Math.max(y + 26, 162))}" class="note-badge-text" style="fill: ${handColor}; font-size: 10px;">${handLabel} ${label}</text>
        </g>
      `;
    });

    this.activeLayer.innerHTML = svgHtml;
  }

  renderSongGuide(currentStepOrNotes, upcomingSteps = [], targetHand = null, pastSteps = []) {
    if (!this.songLayer) return;

    let svgHtml = '';
    const startX = 320; // Línea de pulsación fija
    const stepX = 55;
    const minVisibleX = 145; // Límite de las claves y compás a la izquierda

    // 1. Extraer y filtrar notas pasadas (que ya se tocaron y fluyen a la izquierda)
    if (Array.isArray(pastSteps) && pastSteps.length > 0) {
      const numPast = pastSteps.length;
      pastSteps.forEach((pStep, pIndex) => {
        // Distancia hacia atrás respecto al actual: el último elemento de pastSteps es el más reciente (1 paso atrás)
        const distFromCurrent = numPast - pIndex;
        const x = startX - (distFromCurrent * stepX);
        if (x < minVisibleX) return; // No solapar con la clave/compás

        let pRawNotes = [];
        if (Array.isArray(pStep)) {
          pRawNotes = pStep;
        } else if (pStep && Array.isArray(pStep.notes)) {
          pRawNotes = pStep.notes;
        } else if (pStep) {
          pRawNotes = [pStep];
        }

        const filteredPast = this._filterNotesByHand(pRawNotes, targetHand);
        // Opacidad decreciente hacia la izquierda
        const opacity = Math.max(0.15, 0.75 - (distFromCurrent - 1) * 0.25);

        filteredPast.forEach(noteItem => {
          const noteName = typeof noteItem === 'string' ? noteItem : (noteItem.note || noteItem);
          const data = this.notePositions[noteName];
          if (!data) return;

          const isLeft = (noteItem.hand || data.hand) === 'left';
          const handColor = isLeft ? 'var(--accent-cyan)' : 'var(--accent-gold)';
          const y = data.y;

          const ledgerHtml = (data.ledgerLines || []).map(ly => `
            <line x1="${x - 12}" y1="${ly}" x2="${x + 12}" y2="${ly}" class="ledger-line past" style="stroke: ${handColor};" opacity="${opacity}" />
          `).join('');

          const sharpHtml = data.isSharp ? `
            <text x="${x - 16}" y="${y + 4}" class="accidental-sharp past" style="fill: ${handColor};" opacity="${opacity}">♯</text>
          ` : '';

          const stemUp = isLeft ? y >= 118 : y >= 52;
          const stemX = stemUp ? x + 6 : x - 6;
          const stemY2 = stemUp ? y - 24 : y + 24;

          svgHtml += `
            <g class="past-note-group" opacity="${opacity}">
              ${ledgerHtml}
              ${sharpHtml}
              <ellipse cx="${x}" cy="${y}" rx="7.5" ry="5.5" transform="rotate(-20, ${x}, ${y})" class="note-head past" style="fill: ${handColor};" />
              <line x1="${stemX}" y1="${y}" x2="${stemX}" y2="${stemY2}" class="note-stem past" style="stroke: ${handColor}; stroke-width: 1.8;" />
            </g>
          `;
        });
      });
    }

    // 2. Normalizar y filtrar notas objetivo actuales (en la línea de pulsación X = startX)
    let currentTargets = [];
    if (Array.isArray(currentStepOrNotes)) {
      currentTargets = currentStepOrNotes;
    } else if (currentStepOrNotes && Array.isArray(currentStepOrNotes.notes)) {
      currentTargets = currentStepOrNotes.notes;
    } else if (currentStepOrNotes) {
      const nName = typeof currentStepOrNotes === 'string' ? currentStepOrNotes : (currentStepOrNotes.note || currentStepOrNotes);
      const nHand = (typeof currentStepOrNotes === 'object' && currentStepOrNotes.hand) ? currentStepOrNotes.hand : targetHand;
      if (nName) currentTargets = [{ note: nName, hand: nHand }];
    }

    // Filtro estricto por mano
    currentTargets = this._filterNotesByHand(currentTargets, targetHand);

    if (currentTargets.length > 0) {
      const hasLeft = currentTargets.some(t => ((t.hand || (this.notePositions[t.note || t]?.hand)) === 'left'));
      const hasRight = currentTargets.some(t => ((t.hand || (this.notePositions[t.note || t]?.hand)) !== 'left'));
      const isBoth = hasLeft && hasRight;

      const guideColor = isBoth ? '#e2e8f0' : (hasLeft ? 'var(--accent-cyan)' : 'var(--accent-gold)');

      // Marcador guía vertical que atraviesa el Gran Pentagrama
      svgHtml += `
        <line x1="${startX}" y1="14" x2="${startX}" y2="166" class="guide-target-line" style="stroke: ${guideColor}; stroke-width: 2; opacity: 0.55;" />
      `;

      // Insignia superior del acorde / notas simultáneas
      let badgeText = '';
      if (isBoth) {
        badgeText = '🤚✋ Ambas';
      } else if (hasLeft) {
        const labels = currentTargets.map(t => {
          const d = this.notePositions[t.note || t];
          return d ? (this.notationType === 'solfege' ? d.solfege : d.anglo) : (t.note || t);
        }).join('+');
        badgeText = `✋ Izq: ${labels}`;
      } else {
        const labels = currentTargets.map(t => {
          const d = this.notePositions[t.note || t];
          return d ? (this.notationType === 'solfege' ? d.solfege : d.anglo) : (t.note || t);
        }).join('+');
        badgeText = `🤚 Der: ${labels}`;
      }

      const badgeWidth = Math.max(70, badgeText.length * 7.5);
      svgHtml += `
        <rect x="${startX - badgeWidth / 2}" y="4" width="${badgeWidth}" height="22" rx="6" class="target-badge-bg" style="stroke: ${guideColor}; fill: rgba(15, 23, 42, 0.85);" />
        <text x="${startX}" y="19" class="target-badge-text" style="fill: ${guideColor}; font-size: 11px; font-weight: 800; text-anchor: middle;">${badgeText}</text>
      `;

      // Dibujar cada una de las notas del objetivo actual
      currentTargets.forEach(t => {
        const noteName = typeof t === 'string' ? t : (t.note || t);
        const data = this.notePositions[noteName];
        if (!data) return;

        const isLeft = (t.hand || data.hand) === 'left';
        const handColor = isLeft ? 'var(--accent-cyan)' : 'var(--accent-gold)';
        const glowFilter = isLeft ? 'url(#glowCyan)' : 'url(#glowGold)';
        const x = startX;
        const y = data.y;

        const ledgerHtml = (data.ledgerLines || []).map(ly => `
          <line x1="${x - 16}" y1="${ly}" x2="${x + 16}" y2="${ly}" class="ledger-line target" style="stroke: ${handColor};" />
        `).join('');

        const sharpHtml = data.isSharp ? `
          <text x="${x - 18}" y="${y + 5}" class="accidental-sharp target" style="fill: ${handColor};">♯</text>
        ` : '';

        const stemUp = isLeft ? y >= 118 : y >= 52;
        const stemX = stemUp ? x + 7.5 : x - 7.5;
        const stemY2 = stemUp ? y - 28 : y + 28;

        svgHtml += `
          <g class="target-note-item ${isLeft ? 'target-left-hand' : 'target-right-hand'}">
            ${ledgerHtml}
            ${sharpHtml}
            <ellipse cx="${x}" cy="${y}" rx="9" ry="6.5" transform="rotate(-20, ${x}, ${y})" class="note-head target animate-pulse" style="fill: ${handColor};" filter="${glowFilter}" />
            <line x1="${stemX}" y1="${y}" x2="${stemX}" y2="${stemY2}" class="note-stem target" style="stroke: ${handColor}; stroke-width: 2.2;" />
          </g>
        `;
      });
    }

    // 3. Próximos pasos musicales en el pentagrama (X > startX)
    upcomingSteps.slice(0, 7).forEach((stepItem, i) => {
      let stepRaw = [];
      if (Array.isArray(stepItem)) {
        stepRaw = stepItem;
      } else if (stepItem && Array.isArray(stepItem.notes)) {
        stepRaw = stepItem.notes;
      } else if (stepItem) {
        stepRaw = [stepItem];
      }

      const filteredUpcoming = this._filterNotesByHand(stepRaw, targetHand);
      if (filteredUpcoming.length === 0) return;

      const x = startX + (i + 1) * stepX;
      const opacity = Math.max(0.18, 0.85 - i * 0.11);

      filteredUpcoming.forEach(noteItem => {
        const noteName = typeof noteItem === 'string' ? noteItem : (noteItem.note || noteItem);
        const data = this.notePositions[noteName];
        if (!data) return;

        const noteHand = (typeof noteItem === 'object' && noteItem.hand) ? noteItem.hand : data.hand;
        const isLeft = noteHand === 'left';
        const handColor = isLeft ? 'var(--accent-cyan)' : 'var(--accent-gold)';
        const y = data.y;

        const ledgerHtml = (data.ledgerLines || []).map(ly => `
          <line x1="${x - 12}" y1="${ly}" x2="${x + 12}" y2="${ly}" class="ledger-line upcoming" opacity="${opacity}" />
        `).join('');

        const sharpHtml = data.isSharp ? `
          <text x="${x - 16}" y="${y + 4}" class="accidental-sharp upcoming" style="fill: ${handColor};" opacity="${opacity}">♯</text>
        ` : '';

        const stemUp = isLeft ? y >= 118 : y >= 52;
        const stemX = stemUp ? x + 6 : x - 6;
        const stemY2 = stemUp ? y - 24 : y + 24;

        svgHtml += `
          <g class="upcoming-note-group" opacity="${opacity}">
            ${ledgerHtml}
            ${sharpHtml}
            <ellipse cx="${x}" cy="${y}" rx="7.5" ry="5.5" transform="rotate(-20, ${x}, ${y})" class="note-head upcoming" style="fill: ${handColor}; opacity: ${opacity};" />
            <line x1="${stemX}" y1="${y}" x2="${stemX}" y2="${stemY2}" class="note-stem upcoming" style="stroke: ${handColor}; opacity: ${opacity};" />
          </g>
        `;
      });
    });

    this.songLayer.innerHTML = svgHtml;
  }

  createHitParticle(noteName) {
    if (!this.fxLayer) return;
    const data = this.notePositions[noteName];
    if (!data) return;

    const x = 320;
    const y = data.y;
    const isLeft = data.hand === 'left';

    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', x);
    ring.setAttribute('cy', y);
    ring.setAttribute('r', '10');
    ring.setAttribute('class', 'hit-ripple');
    ring.style.stroke = isLeft ? 'var(--accent-cyan)' : 'var(--accent-gold)';
    this.fxLayer.appendChild(ring);

    setTimeout(() => {
      ring.remove();
    }, 600);
  }

  render() {
    this.renderActiveNotes();
    if (this.targetNote) {
      this.renderSongGuide(this.targetNote, this.upcomingSteps || [], this.targetHand, this.pastSteps || []);
    }
  }
}
