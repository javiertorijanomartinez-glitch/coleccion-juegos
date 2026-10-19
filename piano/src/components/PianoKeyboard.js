/**
 * PianoKeyboard.js
 * Componente avanzado del teclado de piano para web y móvil.
 * Soporta número dinámico de octavas según la canción (ej. 2, 3, 4 o más octavas),
 * modo de 88 teclas completas de concierto (A0 a C8) para versión libre o piano conectado,
 * desplazamiento táctil horizontal suave con auto-centrado en la tecla a tocar,
 * y diferenciación visual por color de Mano Izquierda (Azul) vs Mano Derecha (Dorado).
 */

export class PianoKeyboard {
  constructor(containerElement, onNoteDown, onNoteUp) {
    this.container = containerElement;
    this.onNoteDown = onNoteDown; // Callback: (noteName) => {}
    this.onNoteUp = onNoteUp;     // Callback: (noteName) => {}

    this.is88KeysMode = false;
    this.startOctave = 4;
    this.endOctave = 5;
    this.baseOctave = 4;          // Para atajos de teclado PC
    this.notationType = 'solfege'; // 'solfege', 'anglo', o 'none'
    this.activeTouches = new Map(); // touchId -> noteName
    this.pressedKeys = new Set();
    this.targetKey = null;

    // Mapeo de teclas de teclado físico de PC
    this.pcKeyMap = {
      'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E', 'f': 'F',
      't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A', 'u': 'A#', 'j': 'B',
      'k': 'C+1', 'o': 'C#+1', 'l': 'D+1', 'p': 'D#+1', 'ñ': 'E+1', ';': 'E+1',
      '\'': 'F+1'
    };

    this.initKeyboard();
    this.bindEvents();
  }

  setNotation(type) {
    this.notationType = type;
    this.initKeyboard();
  }

  getRangeDescription() {
    if (this.is88KeysMode) return 'A0-C8 (88)';
    return `C${this.startOctave}-C${this.endOctave + 1}`;
  }

  /**
   * Configura un rango específico de octavas (ej. de octava 2 a 5 = 4 octavas completas)
   */
  setOctaveRange(startOct, endOct) {
    this.is88KeysMode = false;
    let sOct = Math.max(1, Math.min(7, startOct));
    let eOct = Math.max(sOct, Math.min(7, endOct));
    // Garantizar un ancho ergonómico mínimo de al menos 2 octavas
    if (eOct - sOct < 1) {
      if (eOct < 7) eOct++;
      else if (sOct > 1) sOct--;
    }
    this.startOctave = sOct;
    this.endOctave = eOct;
    this.baseOctave = this.startOctave;
    this.initKeyboard();
    if (this.onRangeChange) {
      this.onRangeChange(this.getRangeDescription());
    }
  }

  /**
   * Activa o desactiva el modo de 88 teclas completas (A0 a C8: 52 blancas y 36 negras)
   */
  set88KeysMode(enabled) {
    this.is88KeysMode = !!enabled;
    this.initKeyboard();
    if (this.onRangeChange) {
      this.onRangeChange(this.getRangeDescription());
    }
    // Centrar inicialmente en el Do central (C4)
    setTimeout(() => this.scrollToNote('C4'), 80);
  }

  setBaseOctave(octave) {
    if (this.is88KeysMode) return;
    const span = this.endOctave - this.startOctave;
    this.startOctave = Math.max(1, Math.min(7 - span, octave));
    this.endOctave = this.startOctave + span;
    this.baseOctave = this.startOctave;
    this.initKeyboard();
    if (this.onRangeChange) {
      this.onRangeChange(this.getRangeDescription());
    }
  }

  shiftOctave(delta) {
    if (this.is88KeysMode) return;
    this.setBaseOctave(this.startOctave + delta);
  }

  /**
   * Resalta una o varias teclas objetivo simultáneas (acordes o ambas manos)
   */
  setTargetKeys(targets) {
    this.clearTargetKeys();
    if (!targets) return;

    const targetList = Array.isArray(targets) ? targets : [targets];
    if (targetList.length === 0) return;

    let minLeft = Infinity;
    let maxLeft = -Infinity;

    targetList.forEach(t => {
      const noteName = typeof t === 'string' ? t : (t.note || t);
      const hand = (typeof t === 'object' && t.hand) ? t.hand : null;
      if (!noteName) return;

      const keyEl = this.container.querySelector(`[data-note="${noteName}"]`);
      if (keyEl) {
        keyEl.classList.add('is-target');
        const isLeft = (hand === 'left') || (!hand && this._isLeftHandNote(noteName));
        keyEl.classList.add(isLeft ? 'target-left' : 'target-right');

        // Renderizar insignia de número de dedo (1-5) si está presente (modo tutorial)
        if (t.finger) {
          const badge = document.createElement('span');
          badge.className = `key-finger-badge finger-${t.finger} ${isLeft ? 'left-hand' : 'right-hand'}`;
          badge.textContent = t.finger;
          badge.title = `Dedo ${t.finger} (${isLeft ? 'Mano Izquierda' : 'Mano Derecha'})`;
          keyEl.appendChild(badge);
        }

        const kLeft = keyEl.offsetLeft;
        if (kLeft < minLeft) minLeft = kLeft;
        if (kLeft > maxLeft) maxLeft = kLeft;
      }
    });

    // Centrar la vista del teclado en el promedio de las teclas del acorde
    if (minLeft !== Infinity && maxLeft !== -Infinity) {
      const pianoBed = this.container.querySelector('.piano-bed');
      if (pianoBed) {
        const centerPos = (minLeft + maxLeft) / 2;
        const bedWidth = pianoBed.clientWidth;
        const targetScroll = centerPos - (bedWidth / 2);
        pianoBed.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
      }
    }
  }

  setTargetKey(noteName, hand = null, finger = null) {
    if (!noteName) {
      this.clearTargetKeys();
      return;
    }
    this.setTargetKeys([{ note: noteName, hand, finger }]);
  }

  clearTargetKeys() {
    const prevBadges = this.container.querySelectorAll('.key-finger-badge');
    prevBadges.forEach(b => b.remove());

    const prevEls = this.container.querySelectorAll('.piano-key.is-target');
    prevEls.forEach(el => {
      el.classList.remove('is-target', 'target-left', 'target-right');
    });
  }

  clearTargetKey() {
    this.clearTargetKeys();
  }

  /**
   * Centra suavemente la vista del teclado en la nota indicada
   */
  scrollToNote(noteName) {
    const keyEl = this.container.querySelector(`[data-note="${noteName}"]`);
    const pianoBed = this.container.querySelector('.piano-bed');
    if (keyEl && pianoBed) {
      const keyLeft = keyEl.offsetLeft;
      const keyWidth = keyEl.offsetWidth;
      const bedWidth = pianoBed.clientWidth;
      const targetScroll = keyLeft - (bedWidth / 2) + (keyWidth / 2);
      pianoBed.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    }
  }

  _isLeftHandNote(noteName) {
    // Si la octava es menor que 4, o es C4 hacia abajo
    const match = noteName.match(/^([A-G]#?)([0-8])$/);
    if (!match) return false;
    const base = match[1];
    const oct = parseInt(match[2]);
    if (oct < 4) return true;
    return false;
  }

  initKeyboard() {
    const solfegeMap = {
      'C': 'Do', 'D': 'Re', 'E': 'Mi', 'F': 'Fa', 'G': 'Sol', 'A': 'La', 'B': 'Si'
    };

    let whiteNotes = [];
    let blackNotes = [];

    if (this.is88KeysMode) {
      // --- PIANO COMPLETO DE 88 TECLAS (A0 a C8) ---
      // Octava 0: A0, B0 blancas; A#0 negra
      whiteNotes.push({ note: 'A0', base: 'A', oct: 0 });
      whiteNotes.push({ note: 'B0', base: 'B', oct: 0 });
      blackNotes.push({ note: 'A#0', afterWhiteIndex: 0 });

      // Octavas 1 a 7 completas
      for (let oct = 1; oct <= 7; oct++) {
        const startWhiteIdx = whiteNotes.length;
        const bases = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        bases.forEach(b => {
          whiteNotes.push({ note: `${b}${oct}`, base: b, oct });
        });

        blackNotes.push({ note: `C#${oct}`, afterWhiteIndex: startWhiteIdx + 0 });
        blackNotes.push({ note: `D#${oct}`, afterWhiteIndex: startWhiteIdx + 1 });
        blackNotes.push({ note: `F#${oct}`, afterWhiteIndex: startWhiteIdx + 3 });
        blackNotes.push({ note: `G#${oct}`, afterWhiteIndex: startWhiteIdx + 4 });
        blackNotes.push({ note: `A#${oct}`, afterWhiteIndex: startWhiteIdx + 5 });
      }

      // Octava 8: tecla C8 final
      whiteNotes.push({ note: 'C8', base: 'C', oct: 8 });

    } else {
      // --- RANGO DE OCTAVAS DINÁMICO (ej. startOctave a endOctave) ---
      const octavesCount = this.endOctave - this.startOctave + 1;

      for (let i = 0; i < octavesCount; i++) {
        const oct = this.startOctave + i;
        const startWhiteIdx = whiteNotes.length;
        const bases = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

        bases.forEach(b => {
          whiteNotes.push({ note: `${b}${oct}`, base: b, oct });
        });

        blackNotes.push({ note: `C#${oct}`, afterWhiteIndex: startWhiteIdx + 0 });
        blackNotes.push({ note: `D#${oct}`, afterWhiteIndex: startWhiteIdx + 1 });
        blackNotes.push({ note: `F#${oct}`, afterWhiteIndex: startWhiteIdx + 3 });
        blackNotes.push({ note: `G#${oct}`, afterWhiteIndex: startWhiteIdx + 4 });
        blackNotes.push({ note: `A#${oct}`, afterWhiteIndex: startWhiteIdx + 5 });
      }

      // Cierre: tecla Do de la siguiente octava
      const closingOct = this.endOctave + 1;
      whiteNotes.push({ note: `C${closingOct}`, base: 'C', oct: closingOct });
    }

    // Dimensionado de teclas
    const totalWhite = whiteNotes.length;
    // Si son muchas teclas (más de 22 teclas o modo 88), habilitar scroll horizontal con ancho mínimo
    const isWideKeyboard = totalWhite > 22 || this.is88KeysMode;
    const whiteKeyWidthPx = isWideKeyboard ? (this.is88KeysMode ? 32 : 36) : null;
    const whiteWidthPct = isWideKeyboard ? null : (100 / totalWhite);

    const totalWidthPx = isWideKeyboard ? totalWhite * whiteKeyWidthPx : null;
    const keyboardInnerStyle = isWideKeyboard ? `style="width: ${totalWidthPx}px; min-width: 100%;"` : '';

    let html = `<div class="piano-bed ${isWideKeyboard ? 'has-scroll' : ''}">`;
    html += `<div class="piano-track" ${keyboardInnerStyle}>`;

    // 1. Teclas Blancas
    html += `<div class="white-keys-container">`;
    whiteNotes.forEach((w, index) => {
      let label = '';
      if (this.notationType === 'solfege') {
        label = `<span class="key-name">${solfegeMap[w.base]}</span><span class="key-oct">${w.oct}</span>`;
      } else if (this.notationType === 'anglo') {
        label = `<span class="key-name">${w.base}</span><span class="key-oct">${w.oct}</span>`;
      }

      const isTarget = this.targetKey === w.note ? ' is-target' : '';
      const isLeft = this._isLeftHandNote(w.note);
      const handClass = isLeft ? 'left-hand' : 'right-hand';
      const keyWidthStyle = isWideKeyboard ? `style="width: ${whiteKeyWidthPx}px;"` : `style="width: ${whiteWidthPct}%;"`;

      html += `
        <div class="piano-key white-key ${handClass}${isTarget}" data-note="${w.note}" ${keyWidthStyle}>
          <div class="key-cap"></div>
          <div class="key-label">${label}</div>
        </div>
      `;
    });
    html += `</div>`;

    // 2. Teclas Negras
    html += `<div class="black-keys-container">`;
    const blackKeyWidthPct = !isWideKeyboard ? (whiteWidthPct * 0.48) : null;
    const blackKeyWidthPx = isWideKeyboard ? (whiteKeyWidthPx * 0.58) : null;

    blackNotes.forEach(b => {
      let leftStyle = '';
      if (isWideKeyboard) {
        const leftPx = (b.afterWhiteIndex + 1) * whiteKeyWidthPx - (blackKeyWidthPx / 2);
        leftStyle = `style="left: ${leftPx}px; width: ${blackKeyWidthPx}px;"`;
      } else {
        const leftPct = (b.afterWhiteIndex + 1) * whiteWidthPct - (blackKeyWidthPct / 2);
        leftStyle = `style="left: ${leftPct}%; width: ${blackKeyWidthPct}%;"`;
      }

      const isTarget = this.targetKey === b.note ? ' is-target' : '';
      const isLeft = this._isLeftHandNote(b.note);
      const handClass = isLeft ? 'left-hand' : 'right-hand';

      const baseNote = b.note.charAt(0);
      const oct = b.note.replace(/[^0-9]/g, '');
      let label = '';
      if (this.notationType === 'solfege') {
        label = `<span class="key-name-black">${solfegeMap[baseNote]}♯</span>`;
      } else if (this.notationType === 'anglo') {
        label = `<span class="key-name-black">${baseNote}♯</span>`;
      }

      html += `
        <div class="piano-key black-key ${handClass}${isTarget}" data-note="${b.note}" ${leftStyle}>
          <div class="black-key-top"></div>
          <div class="black-key-label">${label}</div>
        </div>
      `;
    });
    html += `</div>`; // .black-keys-container

    html += `</div>`; // .piano-track
    html += `</div>`; // .piano-bed

    this.container.innerHTML = html;
  }

  bindEvents() {
    // 1. Soporte Multi-táctil móvil de baja latencia
    const handleTouchStart = (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const keyEl = this._getKeyFromPoint(touch.clientX, touch.clientY);
        if (keyEl) {
          const note = keyEl.dataset.note;
          this.activeTouches.set(touch.identifier, note);
          this.triggerNoteDown(note, keyEl);
        }
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const prevNote = this.activeTouches.get(touch.identifier);
        const currentKeyEl = this._getKeyFromPoint(touch.clientX, touch.clientY);
        const currentNote = currentKeyEl ? currentKeyEl.dataset.note : null;

        if (prevNote !== currentNote) {
          if (prevNote) {
            this.triggerNoteUp(prevNote);
          }
          if (currentNote) {
            this.activeTouches.set(touch.identifier, currentNote);
            this.triggerNoteDown(currentNote, currentKeyEl);
          } else {
            this.activeTouches.delete(touch.identifier);
          }
        }
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const note = this.activeTouches.get(touch.identifier);
        if (note) {
          this.triggerNoteUp(note);
          this.activeTouches.delete(touch.identifier);
        }
      }
    };

    this.container.addEventListener('touchstart', handleTouchStart, { passive: false });
    this.container.addEventListener('touchmove', handleTouchMove, { passive: false });
    this.container.addEventListener('touchend', handleTouchEnd, { passive: false });
    this.container.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    // 2. Soporte para Ratón (Click y Arrastre en PC)
    let isMouseDown = false;
    let mouseActiveNote = null;

    this.container.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isMouseDown = true;
      const keyEl = e.target.closest('.piano-key');
      if (keyEl) {
        mouseActiveNote = keyEl.dataset.note;
        this.triggerNoteDown(mouseActiveNote, keyEl);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      const keyEl = document.elementFromPoint(e.clientX, e.clientY)?.closest('.piano-key');
      const currentNote = keyEl ? keyEl.dataset.note : null;

      if (mouseActiveNote !== currentNote) {
        if (mouseActiveNote) this.triggerNoteUp(mouseActiveNote);
        if (currentNote) {
          mouseActiveNote = currentNote;
          this.triggerNoteDown(mouseActiveNote, keyEl);
        } else {
          mouseActiveNote = null;
        }
      }
    });

    window.addEventListener('mouseup', () => {
      if (isMouseDown) {
        isMouseDown = false;
        if (mouseActiveNote) {
          this.triggerNoteUp(mouseActiveNote);
          mouseActiveNote = null;
        }
      }
    });

    // 3. Teclado de ordenador (Atajos de letras)
    window.addEventListener('keydown', (e) => {
      if (e.repeat || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();
      if (this.pcKeyMap[key]) {
        const mapped = this.pcKeyMap[key];
        const noteName = this._getNoteFromPcMap(mapped);
        if (noteName && !this.pressedKeys.has(noteName)) {
          this.triggerNoteDown(noteName);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      if (this.pcKeyMap[key]) {
        const mapped = this.pcKeyMap[key];
        const noteName = this._getNoteFromPcMap(mapped);
        if (noteName) {
          this.triggerNoteUp(noteName);
        }
      }
    });
  }

  _getNoteFromPcMap(mappedStr) {
    const isOct2 = mappedStr.includes('+1');
    const noteBase = mappedStr.replace('+1', '');
    const oct = isOct2 ? this.baseOctave + 1 : this.baseOctave;
    return `${noteBase}${oct}`;
  }

  _getKeyFromPoint(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    return el.closest('.piano-key');
  }

  triggerNoteDown(noteName, keyEl = null) {
    if (!keyEl) {
      keyEl = this.container.querySelector(`[data-note="${noteName}"]`);
    }

    if (keyEl) {
      keyEl.classList.add('pressed');
    }
    this.pressedKeys.add(noteName);

    if (this.onNoteDown) {
      this.onNoteDown(noteName);
    }
  }

  triggerNoteUp(noteName) {
    const keyEl = this.container.querySelector(`[data-note="${noteName}"]`);
    if (keyEl) {
      keyEl.classList.remove('pressed');
    }
    this.pressedKeys.delete(noteName);

    if (this.onNoteUp) {
      this.onNoteUp(noteName);
    }
  }

  pressVisualKey(noteName) {
    const keyEl = this.container.querySelector(`[data-note="${noteName}"]`);
    if (keyEl) {
      keyEl.classList.add('pressed');
      // En modo 88 teclas o teclado con scroll, asegurar que la tecla tocada se vea
      if (this.is88KeysMode) {
        this.scrollToNote(noteName);
      }
    }
  }

  releaseVisualKey(noteName) {
    const keyEl = this.container.querySelector(`[data-note="${noteName}"]`);
    if (keyEl) {
      keyEl.classList.remove('pressed');
    }
  }
}
