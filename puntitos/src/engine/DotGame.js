import { audio } from '../core/Audio.js';
import { Haptics } from '../core/Haptics.js';
import { ConfettiEngine } from '../core/Confetti.js';
import { Storage } from '../core/Storage.js';

export class DotGame {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.level = null;
    this.currentDotIndex = 0; // Índice del último punto conectado (0 = aún no iniciado, espera al punto 1)
    this.nextTargetIndex = 1; // Punto que toca conectar (1-indexed)
    this.isDragging = false;
    this.dragPos = { x: 0, y: 0 };
    this.connectedDots = [];
    this.isCompleted = false;
    this.showHintActive = false;
    this.hintTimer = null;

    this.initDOM();
    this.confetti = new ConfettiEngine(this.fxCanvas);
    this.bindEvents();
    this.startLoop();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="dotgame-wrapper">
        <!-- SVG para ilustración coloreada y revelado -->
        <svg class="dotgame-svg-reveal" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet"></svg>
        
        <!-- Canvas principal de puntos y trazos -->
        <canvas class="dotgame-canvas"></canvas>

        <!-- Canvas secundario para efectos y confeti -->
        <canvas class="dotgame-fx-canvas"></canvas>
      </div>
    `;

    this.wrapper = this.container.querySelector('.dotgame-wrapper');
    this.revealSvg = this.container.querySelector('.dotgame-svg-reveal');
    this.canvas = this.container.querySelector('.dotgame-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.fxCanvas = this.container.querySelector('.dotgame-fx-canvas');
  }

  resize() {
    if (!this.wrapper || !this.canvas) return;
    const rect = this.wrapper.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.canvas.style.width = `${rect.width}px`;
      this.canvas.style.height = `${rect.height}px`;

      this.fxCanvas.width = w;
      this.fxCanvas.height = h;
      this.fxCanvas.style.width = `${rect.width}px`;
      this.fxCanvas.style.height = `${rect.height}px`;

      this.confetti.setCanvas(this.fxCanvas);
    }
  }

  loadLevel(level) {
    this.level = level;
    this.currentDotIndex = 0;
    this.nextTargetIndex = 1;
    this.connectedDots = [];
    this.isCompleted = false;
    this.isDragging = false;
    this.showHintActive = false;
    if (this.hintTimer) clearTimeout(this.hintTimer);
    if (this.confetti) this.confetti.clear();

    // Preparar SVG de revelado (invisible inicialmente)
    this.revealSvg.innerHTML = level.colorArt || '';
    this.revealSvg.classList.remove('revealed');

    this.resize();
    this.render();

    if (this.options.onProgress) {
      this.options.onProgress({
        current: 0,
        total: level.dots.length,
        level: this.level
      });
    }
  }

  // Conversión de coordenadas de pantalla/ratón a coordenadas lógicas 500x500
  getLogicalCoords(e) {
    const rect = this.wrapper.getBoundingClientRect();
    const clientX = e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;

    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    // Relación de aspecto manteniendo 500x500
    const w = rect.width || 480;
    const h = rect.height || 480;
    const scale = Math.min(w / 500, h / 500) || 1;
    const offsetX = (w - 500 * scale) / 2;
    const offsetY = (h - 500 * scale) / 2;

    return {
      x: (relX - offsetX) / scale,
      y: (relY - offsetY) / scale,
      scale,
      screenX: clientX,
      screenY: clientY
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    const onPointerDown = (e) => {
      if (this.isCompleted || !this.level) return;
      audio.init();

      const coords = this.getLogicalCoords(e);
      const targetDot = this.level.dots.find(d => d.id === this.nextTargetIndex);
      const lastDot = this.level.dots.find(d => d.id === this.currentDotIndex);

      // Tolerancia amplia para ratón y pantalla táctil
      const hitRadius = Math.max(48, 44 / (coords.scale || 1));

      // 1. Si toca el siguiente punto objetivo directamente
      if (targetDot && this.getDistance(coords, targetDot) <= hitRadius) {
        this.connectNextDot(targetDot);
        this.isDragging = true;
        this.dragPos = { x: targetDot.x, y: targetDot.y };
        return;
      }

      // 2. Si toca el último punto conectado, comienza a arrastrar hacia el siguiente
      if (lastDot && this.getDistance(coords, lastDot) <= hitRadius) {
        this.isDragging = true;
        this.dragPos = { x: coords.x, y: coords.y };
        return;
      }

      // 3. Si pulsa cualquier otro punto incorrecto
      const wrongDot = this.level.dots.find(d => this.getDistance(coords, d) <= hitRadius);
      if (wrongDot && wrongDot.id !== this.nextTargetIndex && wrongDot.id > this.currentDotIndex) {
        audio.playWrongDot();
        Haptics.error();
      }
    };

    const onPointerMove = (e) => {
      if (this.isCompleted || !this.level) return;
      const coords = this.getLogicalCoords(e);
      const targetDot = this.level.dots.find(d => d.id === this.nextTargetIndex);
      const hitRadius = Math.max(48, 44 / (coords.scale || 1));

      if (this.isDragging) {
        this.dragPos = { x: coords.x, y: coords.y };

        // Comprobar si al arrastrar alcanza el siguiente punto
        if (targetDot && this.getDistance(coords, targetDot) <= hitRadius) {
          this.connectNextDot(targetDot);
          this.dragPos = { x: targetDot.x, y: targetDot.y };
        }
      } else {
        // En PC: mostrar mano (pointer) al pasar sobre cualquier punto
        const nearDot = this.level.dots.find(d => this.getDistance(coords, d) <= hitRadius);
        if (nearDot) {
          this.canvas.style.cursor = 'pointer';
        } else {
          this.canvas.style.cursor = 'default';
        }
      }
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    // Registrar eventos Pointer (para táctil y ratón con fluidez)
    this.wrapper.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  getDistance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  connectNextDot(dot) {
    this.connectedDots.push(dot);
    this.currentDotIndex = dot.id;
    this.nextTargetIndex = dot.id + 1;

    // Audio y háptica con escala musical
    audio.playDotConnect(dot.id - 1);
    Haptics.tap();

    // Pequeño estallido de confeti en el punto
    const rect = this.wrapper.getBoundingClientRect();
    const scale = Math.min(rect.width / 500, rect.height / 500);
    const offsetX = (rect.width - 500 * scale) / 2;
    const offsetY = (rect.height - 500 * scale) / 2;
    const screenDotX = dot.x * scale + offsetX;
    const screenDotY = dot.y * scale + offsetY;
    this.confetti.burst(screenDotX, screenDotY, 15);

    if (this.options.onProgress) {
      this.options.onProgress({
        current: this.connectedDots.length,
        total: this.level.dots.length,
        level: this.level
      });
    }

    // ¿Se han conectado todos los puntos?
    if (this.connectedDots.length === this.level.dots.length) {
      this.finishLevel();
    }
  }

  triggerHint() {
    if (this.isCompleted || !this.level) return;
    this.showHintActive = true;
    audio.playUiClick();
    Haptics.tap();

    const hintBtn = document.getElementById('btn-hint');
    if (hintBtn) {
      hintBtn.classList.add('active');
      setTimeout(() => hintBtn.classList.remove('active'), 2500);
    }

    if (this.hintTimer) clearTimeout(this.hintTimer);
    this.hintTimer = setTimeout(() => {
      this.showHintActive = false;
    }, 4000);
  }

  finishLevel() {
    this.isCompleted = true;
    this.isDragging = false;

    // Guardar progreso en Storage
    Storage.markCompleted(this.level.id, 3);

    // Revelar ilustración SVG a todo color
    setTimeout(() => {
      this.revealSvg.classList.add('revealed');
      audio.playVictory();
      Haptics.win();

      // Gran lluvia de confeti
      const rect = this.wrapper.getBoundingClientRect();
      this.confetti.burst(rect.width * 0.5, rect.height * 0.4, 90);
      setTimeout(() => {
        this.confetti.burst(rect.width * 0.25, rect.height * 0.5, 60);
        this.confetti.burst(rect.width * 0.75, rect.height * 0.5, 60);
      }, 400);

      if (this.options.onComplete) {
        setTimeout(() => {
          this.options.onComplete(this.level);
        }, 1200);
      }
    }, 300);
  }

  startLoop() {
    const loop = () => {
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  render() {
    if (!this.ctx || !this.level || !this.wrapper) return;
    const ctx = this.ctx;
    const rect = this.wrapper.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.resize();
    }

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);

    // Centrar y escalar al espacio de 500x500
    const scale = Math.min(rect.width / 500, rect.height / 500);
    const offsetX = (rect.width - 500 * scale) / 2;
    const offsetY = (rect.height - 500 * scale) / 2;

    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    const now = performance.now();

    // 1. Líneas ya conectadas entre puntos
    if (this.connectedDots.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.connectedDots[0].x, this.connectedDots[0].y);
      for (let i = 1; i < this.connectedDots.length; i++) {
        ctx.lineTo(this.connectedDots[i].x, this.connectedDots[i].y);
      }

      // Si el dibujo está completado y es cerrado, unir el último con el primero
      if (this.isCompleted && this.level.isClosed) {
        ctx.lineTo(this.connectedDots[0].x, this.connectedDots[0].y);
      }

      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#4361EE';
      ctx.shadowColor = 'rgba(67, 97, 238, 0.4)';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 2. Línea elástica dinámica que sigue al dedo/cursor mientras arrastras
    if (this.isDragging && this.currentDotIndex > 0 && !this.isCompleted) {
      const lastDot = this.level.dots.find(d => d.id === this.currentDotIndex);
      if (lastDot) {
        ctx.beginPath();
        ctx.moveTo(lastDot.x, lastDot.y);
        ctx.lineTo(this.dragPos.x, this.dragPos.y);
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);
        ctx.strokeStyle = '#4CC9F0';
        ctx.stroke();
        ctx.setLineDash([]);

        // Bolita guía en la punta del dedo
        ctx.beginPath();
        ctx.arc(this.dragPos.x, this.dragPos.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#4CC9F0';
        ctx.fill();
      }
    }

    // 3. Guía de pista visual (Hint)
    if (this.showHintActive && !this.isCompleted) {
      const targetDot = this.level.dots.find(d => d.id === this.nextTargetIndex);
      const lastDot = this.currentDotIndex > 0 ? this.level.dots.find(d => d.id === this.currentDotIndex) : null;
      
      if (targetDot) {
        // Gran halo parpadeante sobre el punto que toca conectar
        const pulse = (Math.sin(now / 100) + 1) / 2;
        ctx.beginPath();
        ctx.arc(targetDot.x, targetDot.y, 22 + pulse * 18, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 190, 11, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#FFBE0B';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Si ya hay un punto anterior, dibujar la línea discontinua de guía
        if (lastDot) {
          ctx.beginPath();
          ctx.moveTo(lastDot.x, lastDot.y);
          ctx.lineTo(targetDot.x, targetDot.y);
          ctx.lineWidth = 4;
          ctx.setLineDash([10, 6]);
          ctx.strokeStyle = '#FFBE0B';
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    // 4. Renderizar todos los puntos
    // Si ya se completó el dibujo, desvanecemos los puntos para que se aprecie la ilustración
    if (!this.isCompleted) {
      this.level.dots.forEach(dot => {
        const isConnected = dot.id <= this.currentDotIndex;
        const isTarget = dot.id === this.nextTargetIndex;
        const isHinted = this.showHintActive && isTarget;

        // Círculo del punto
        ctx.beginPath();
        const baseRadius = isConnected ? 11 : (isHinted ? 15 : 13);
        ctx.arc(dot.x, dot.y, baseRadius, 0, Math.PI * 2);

        if (isConnected) {
          // Puntos ya unidos: verde suave con borde blanco
          ctx.fillStyle = '#38B000';
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        } else if (isHinted) {
          // Solo se resalta en dorado brillante si se solicita una pista 💡
          ctx.fillStyle = '#FFBE0B';
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 3.5;
          ctx.stroke();
        } else {
          // Todos los puntos pendientes tienen el mismo aspecto neutral para leer los números
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.strokeStyle = '#3A0CA3';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Número del punto
        ctx.fillStyle = isConnected ? '#FFFFFF' : (isHinted ? '#FFFFFF' : '#1E2238');
        ctx.font = `bold ${isHinted ? 13 : 12}px "Outfit", system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dot.id, dot.x, dot.y + 0.5);
      });
    }

    ctx.restore();
  }
}
