import { audio } from '../core/Audio.js';
import { Haptics } from '../core/Haptics.js';
import { Storage } from '../core/Storage.js';

export class ColoringStudio {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.level = null;
    this.currentColor = '#FF5964';
    this.brushSize = 20;
    this.isErasing = false;
    this.isDrawing = false;
    this.lastPos = null;
    this.history = []; // Historial de estados para deshacer (undo)
    this.maxHistory = 15;

    this.palette = [
      '#EF476F', '#F78C6B', '#FFD166', '#06D6A0', 
      '#118AB2', '#073B4C', '#7209B7', '#F72585',
      '#4CC9F0', '#52B788', '#E76F51', '#2B2D42'
    ];

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="coloring-studio">
        <!-- Barra de herramientas superior -->
        <header class="coloring-header">
          <button class="btn-icon btn-back-coloring" title="Volver al Menú">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div class="coloring-title-box">
            <span class="coloring-title">Colorear</span>
            <span class="coloring-level-name"></span>
          </div>
          <div class="coloring-actions">
            <button class="btn-icon btn-undo" title="Deshacer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 7v6h6M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
            </button>
            <button class="btn-icon btn-clear" title="Reiniciar pintura">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
            <button class="btn-icon btn-save" title="Descargar dibujo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            </button>
          </div>
        </header>

        <!-- Área del lienzo -->
        <div class="coloring-canvas-container">
          <!-- Guía tenue del modelo coloreado de fondo -->
          <svg class="coloring-guide-svg" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet"></svg>
          <!-- Canvas de fondo donde pinta el usuario -->
          <canvas class="coloring-paint-canvas"></canvas>
          <!-- SVG superpuesto con las líneas de contorno (¡para no salirse ni borrar las líneas!) -->
          <svg class="coloring-outline-svg" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet"></svg>
        </div>

        <!-- Barra de herramientas inferior (Paleta y Tamaños) -->
        <footer class="coloring-toolbar">
          <!-- Selector de tamaño de pincel, goma, arcoíris y modelo -->
          <div class="brush-controls">
            <button class="brush-size-btn ${this.brushSize === 10 ? 'active' : ''}" data-size="10" title="Fino">
              <span class="dot-indicator" style="width: 8px; height: 8px;"></span>
            </button>
            <button class="brush-size-btn ${this.brushSize === 22 ? 'active' : ''}" data-size="22" title="Medio">
              <span class="dot-indicator" style="width: 14px; height: 14px;"></span>
            </button>
            <button class="brush-size-btn ${this.brushSize === 38 ? 'active' : ''}" data-size="38" title="Grueso">
              <span class="dot-indicator" style="width: 22px; height: 22px;"></span>
            </button>
            <div class="divider-vertical"></div>
            <button class="btn-tool-rainbow ${this.isRainbow ? 'active' : ''}" title="Pincel Arcoíris Mágico">
              🌈
            </button>
            <button class="btn-eraser ${this.isErasing ? 'active' : ''}" title="Goma de borrar">
              🧹
            </button>
            <div class="divider-vertical"></div>
            <button class="btn-toggle-guide" title="Ver modelo de ayuda">
              👁️ Guía
            </button>
          </div>

          <!-- Paleta de colores deslizante para móviles -->
          <div class="palette-slider">
            ${this.palette.map((c, i) => `
              <button class="color-swatch ${i === 0 ? 'selected' : ''}" data-color="${c}" style="background-color: ${c};"></button>
            `).join('')}
          </div>
        </footer>
      </div>
    `;

    this.wrapper = this.container.querySelector('.coloring-canvas-container');
    this.guideSvg = this.container.querySelector('.coloring-guide-svg');
    this.paintCanvas = this.container.querySelector('.coloring-paint-canvas');
    this.ctx = this.paintCanvas.getContext('2d');
    this.outlineSvg = this.container.querySelector('.coloring-outline-svg');
    this.levelNameEl = this.container.querySelector('.coloring-level-name');
  }

  loadLevel(level) {
    this.level = level;
    this.levelNameEl.textContent = level.title;
    this.history = [];
    this.isErasing = false;
    this.isRainbow = false;
    this.rainbowHue = 0;
    this.showGuide = false;
    this.currentColor = this.palette[0];

    // Cargar contorno en la capa SVG superior (líneas oscuras y definidas)
    this.outlineSvg.innerHTML = `
      <g stroke="#1F2937" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="${level.outlinePath}" />
      </g>
    `;

    // Cargar modelo tenue de ayuda de fondo
    this.guideSvg.innerHTML = level.colorArt || '';
    this.guideSvg.style.opacity = '0';
    const guideBtn = this.container.querySelector('.btn-toggle-guide');
    if (guideBtn) guideBtn.classList.remove('active');

    const rainbowBtn = this.container.querySelector('.btn-tool-rainbow');
    if (rainbowBtn) rainbowBtn.classList.remove('active');

    this.resize();
    this.clearCanvas(false);
    this.saveState();
  }

  resize() {
    if (!this.wrapper) return;
    const rect = this.wrapper.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;

    this.paintCanvas.width = Math.round(rect.width * dpr);
    this.paintCanvas.height = Math.round(rect.height * dpr);
    this.paintCanvas.style.width = `${rect.width}px`;
    this.paintCanvas.style.height = `${rect.height}px`;

    this.ctx.scale(dpr, dpr);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, rect.width, rect.height);
  }

  clearCanvas(save = true) {
    const rect = this.wrapper.getBoundingClientRect();
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, rect.width, rect.height);
    if (save) this.saveState();
  }

  saveState() {
    if (this.history.length >= this.maxHistory) {
      this.history.shift();
    }
    const rect = this.wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const imgData = this.ctx.getImageData(0, 0, rect.width * dpr, rect.height * dpr);
    this.history.push(imgData);
  }

  undo() {
    if (this.history.length > 1) {
      this.history.pop(); // Quita el actual
      const prev = this.history[this.history.length - 1];
      this.ctx.putImageData(prev, 0, 0);
      audio.playUiClick();
      Haptics.tap();
    }
  }

  getPointerPos(e) {
    const rect = this.paintCanvas.getBoundingClientRect();
    const clientX = e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  bindEvents() {
    // 1. Herramientas superiores
    this.container.querySelector('.btn-back-coloring').onclick = () => {
      audio.playUiClick();
      if (this.options.onBack) this.options.onBack();
    };

    this.container.querySelector('.btn-undo').onclick = () => this.undo();

    this.container.querySelector('.btn-clear').onclick = () => {
      if (confirm('¿Quieres borrar todo el dibujo y empezar de nuevo?')) {
        this.clearCanvas(true);
        audio.playUiClick();
      }
    };

    this.container.querySelector('.btn-save').onclick = () => this.downloadArtwork();

    // 2. Control de pinceles, arcoíris y goma
    const sizeBtns = this.container.querySelectorAll('.brush-size-btn');
    sizeBtns.forEach(btn => {
      btn.onclick = () => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.brushSize = parseInt(btn.dataset.size);
        this.isErasing = false;
        this.container.querySelector('.btn-eraser').classList.remove('active');
        audio.playUiClick();
      };
    });

    const rainbowBtn = this.container.querySelector('.btn-tool-rainbow');
    rainbowBtn.onclick = () => {
      this.isRainbow = !this.isRainbow;
      this.isErasing = false;
      rainbowBtn.classList.toggle('active', this.isRainbow);
      this.container.querySelector('.btn-eraser').classList.remove('active');
      audio.playUiClick();
      Haptics.tap();
    };

    const eraserBtn = this.container.querySelector('.btn-eraser');
    eraserBtn.onclick = () => {
      this.isErasing = !this.isErasing;
      this.isRainbow = false;
      eraserBtn.classList.toggle('active', this.isErasing);
      rainbowBtn.classList.remove('active');
      audio.playUiClick();
    };

    const guideBtn = this.container.querySelector('.btn-toggle-guide');
    guideBtn.onclick = () => {
      this.showGuide = !this.showGuide;
      this.guideSvg.style.opacity = this.showGuide ? '0.35' : '0';
      guideBtn.classList.toggle('active', this.showGuide);
      audio.playUiClick();
      Haptics.tap();
    };

    // 3. Paleta de colores
    const swatches = this.container.querySelectorAll('.color-swatch');
    swatches.forEach(sw => {
      sw.onclick = () => {
        swatches.forEach(s => s.classList.remove('selected'));
        sw.classList.add('selected');
        this.currentColor = sw.dataset.color;
        this.isErasing = false;
        this.isRainbow = false;
        eraserBtn.classList.remove('active');
        rainbowBtn.classList.remove('active');
        audio.playUiClick();
        Haptics.tap();
      };
    });

    // 4. Dibujar en el lienzo (touch / mouse)
    const onStart = (e) => {
      e.preventDefault();
      this.isDrawing = true;
      this.lastPos = this.getPointerPos(e);
      this.drawStroke(this.lastPos, this.lastPos);
      audio.playBrushStroke();
    };

    const onMove = (e) => {
      if (!this.isDrawing) return;
      e.preventDefault();
      const currentPos = this.getPointerPos(e);
      this.drawStroke(this.lastPos, currentPos);
      this.lastPos = currentPos;
    };

    const onEnd = () => {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.lastPos = null;
        this.saveState();
      }
    };

    this.wrapper.addEventListener('pointerdown', onStart);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);
  }

  drawStroke(p1, p2) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (this.isRainbow) {
      this.rainbowHue = ((this.rainbowHue || 0) + 6) % 360;
      this.ctx.strokeStyle = `hsl(${this.rainbowHue}, 95%, 55%)`;
      this.ctx.lineWidth = this.brushSize;
    } else if (this.isErasing) {
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = this.brushSize * 1.5;
    } else {
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.brushSize;
    }

    this.ctx.stroke();
    this.ctx.restore();
  }

  downloadArtwork() {
    audio.playUiClick();
    Haptics.tap();

    // Combinar capa de pintura con las líneas de contorno en un canvas temporal para exportar
    const rect = this.wrapper.getBoundingClientRect();
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 600;
    exportCanvas.height = 600;
    const expCtx = exportCanvas.getContext('2d');

    // Fondo blanco
    expCtx.fillStyle = '#FFFFFF';
    expCtx.fillRect(0, 0, 600, 600);

    // Pintura del usuario
    expCtx.drawImage(this.paintCanvas, 0, 0, 600, 600);

    // Convertir SVG a imagen para estampar encima
    const svgData = new XMLSerializer().serializeToString(this.outlineSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      expCtx.drawImage(img, 0, 0, 600, 600);
      URL.revokeObjectURL(blobURL);

      // Descargar archivo PNG
      const link = document.createElement('a');
      link.download = `dibujo_${this.level.id || 'coloreado'}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    };
    img.src = blobURL;
  }
}
