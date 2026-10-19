import { LEVELS } from './templates/levels.js';
import { DotGame } from './engine/DotGame.js';
import { ColoringStudio } from './engine/ColoringStudio.js';
import { SVGConverter } from './tools/SVGConverter.js';
import { Storage } from './core/Storage.js';
import { audio } from './core/Audio.js';
import { Haptics } from './core/Haptics.js';

class AppController {
  constructor() {
    this.currentLevelIndex = 0;
    this.currentLevel = null;
    this.selectedCategory = 'all';
    this.customGeneratedLevel = null;

    this.initEngines();
    this.bindDOM();
    this.renderLevelsGrid();
  }

  initEngines() {
    // 1. Inicializar motor de unir puntos
    const dotMount = document.getElementById('dotgame-mount');
    this.game = new DotGame(dotMount, {
      onProgress: ({ current, total, level }) => {
        const progressEl = document.getElementById('game-progress');
        if (progressEl) {
          progressEl.textContent = `Punto ${current + 1} de ${total}`;
        }
      },
      onComplete: (level) => {
        const victoryModal = document.getElementById('victory-modal');
        if (victoryModal) {
          victoryModal.classList.add('active');
        }
        this.renderLevelsGrid(); // Actualizar estrellas en la lista
      }
    });

    // 2. Inicializar estudio de coloreado
    const colorMount = document.getElementById('coloring-mount');
    this.studio = new ColoringStudio(colorMount, {
      onBack: () => {
        this.navigateTo('screen-levels');
      }
    });
  }

  navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
    }

    // Ocultar modal de victoria al cambiar de pantalla
    const victoryModal = document.getElementById('victory-modal');
    if (victoryModal) victoryModal.classList.remove('active');

    // Redimensionar canvas del juego si entramos en la pantalla de juego o coloreado
    if (screenId === 'screen-game') {
      setTimeout(() => this.game.resize(), 50);
    } else if (screenId === 'screen-coloring') {
      setTimeout(() => this.studio.resize(), 50);
    }
  }

  getAllLevels() {
    const custom = Storage.getCustomLevels();
    return [...LEVELS, ...custom];
  }

  startLevel(level) {
    this.currentLevel = level;
    const all = this.getAllLevels();
    this.currentLevelIndex = all.findIndex(l => l.id === level.id);

    document.getElementById('game-title').textContent = level.title;
    document.getElementById('game-progress').textContent = `Punto 1 de ${level.dots.length}`;

    this.navigateTo('screen-game');
    this.game.loadLevel(level);
  }

  nextLevel() {
    const all = this.getAllLevels();
    const nextIdx = (this.currentLevelIndex + 1) % all.length;
    this.startLevel(all[nextIdx]);
  }

  renderLevelsGrid() {
    const grid = document.getElementById('levels-grid');
    if (!grid) return;

    const all = this.getAllLevels();
    const filtered = this.selectedCategory === 'all'
      ? all
      : all.filter(l => l.category === this.selectedCategory);

    grid.innerHTML = filtered.map(lvl => {
      const isDone = Storage.isCompleted(lvl.id);
      const stars = Storage.getStars(lvl.id);
      return `
        <div class="level-card ${isDone ? 'completed' : ''}" data-level-id="${lvl.id}">
          <div class="level-icon">${lvl.icon || '🎨'}</div>
          <h3 class="level-name">${lvl.title}</h3>
          <span class="level-dots-badge">${lvl.dotsCount || lvl.dots.length} Puntos</span>
          <div class="level-stars">
            <span class="${stars >= 1 ? 'star-filled' : ''}">★</span>
            <span class="${stars >= 2 ? 'star-filled' : ''}">★</span>
            <span class="${stars >= 3 ? 'star-filled' : ''}">★</span>
          </div>
        </div>
      `;
    }).join('');

    // Eventos al pulsar una tarjeta de nivel
    grid.querySelectorAll('.level-card').forEach(card => {
      card.onclick = () => {
        const id = card.dataset.levelId;
        const selected = all.find(l => l.id === id);
        if (selected) {
          audio.playUiClick();
          Haptics.tap();
          this.startLevel(selected);
        }
      };
    });
  }

  bindDOM() {
    // --- NAVEGACIÓN PRINCIPAL ---
    document.getElementById('btn-quick-play').onclick = () => {
      audio.playUiClick();
      Haptics.tap();
      const all = this.getAllLevels();
      this.startLevel(all[0]);
    };

    document.getElementById('btn-all-levels').onclick = () => {
      audio.playUiClick();
      Haptics.tap();
      this.navigateTo('screen-levels');
    };

    document.getElementById('btn-go-lab').onclick = () => {
      audio.playUiClick();
      Haptics.tap();
      this.navigateTo('screen-lab');
    };

    document.getElementById('btn-back-levels').onclick = () => {
      audio.playUiClick();
      this.navigateTo('screen-home');
    };

    document.getElementById('btn-back-game').onclick = () => {
      audio.playUiClick();
      this.navigateTo('screen-levels');
    };

    document.getElementById('btn-back-lab').onclick = () => {
      audio.playUiClick();
      this.navigateTo('screen-home');
    };

    // --- SONIDO Y HÁPTICA ---
    const soundBtn = document.getElementById('btn-toggle-sound');
    soundBtn.onclick = () => {
      const enabled = audio.toggleSound();
      soundBtn.textContent = enabled ? '🔊' : '🔇';
      Haptics.tap();
    };

    // --- FILTROS DE CATEGORÍAS ---
    const categoryChips = document.querySelectorAll('#categories-bar .chip');
    categoryChips.forEach(chip => {
      chip.onclick = () => {
        categoryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedCategory = chip.dataset.category;
        audio.playUiClick();
        Haptics.tap();
        this.renderLevelsGrid();
      };
    });

    // --- BOTÓN DE PISTA (HINT) ---
    document.getElementById('btn-hint').onclick = () => {
      this.game.triggerHint();
    };

    // --- MODAL DE VICTORIA ---
    document.getElementById('btn-victory-paint').onclick = () => {
      audio.playUiClick();
      Haptics.tap();
      this.navigateTo('screen-coloring');
      this.studio.loadLevel(this.currentLevel);
    };

    document.getElementById('btn-victory-next').onclick = () => {
      audio.playUiClick();
      Haptics.tap();
      this.nextLevel();
    };

    document.getElementById('btn-victory-retry').onclick = () => {
      audio.playUiClick();
      Haptics.tap();
      const victoryModal = document.getElementById('victory-modal');
      if (victoryModal) victoryModal.classList.remove('active');
      this.game.loadLevel(this.currentLevel);
    };

    // --- TALLER / LABORATORIO SVG ---
    const slider = document.getElementById('dots-count-slider');
    const label = document.getElementById('dots-count-label');
    slider.oninput = () => {
      label.textContent = slider.value;
    };

    const dropzone = document.getElementById('svg-dropzone');
    const fileInput = document.getElementById('svg-file-input');
    dropzone.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          document.getElementById('svg-code-input').value = event.target.result;
          dropzone.querySelector('span').textContent = `📄 ${file.name}`;
          audio.playUiClick();
        };
        reader.readAsText(file);
      }
    };

    // Ejemplos rápidos SVG precargados
    const SAMPLE_SVGS = {
      corazon: `<svg viewBox="0 0 100 100"><path d="M 50 30 C 50 10 20 10 20 35 C 20 60 50 80 50 85 C 50 80 80 60 80 35 C 80 10 50 10 50 30 Z" /></svg>`,
      pez: `<svg viewBox="0 0 100 100"><path d="M 15 50 C 35 25 70 25 85 50 C 70 75 35 75 15 50 Z M 15 50 L 5 35 L 5 65 Z" /></svg>`,
      diamante: `<svg viewBox="0 0 100 100"><polygon points="50,15 85,40 50,85 15,40" /></svg>`,
      sol: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" /></svg>`
    };

    document.querySelectorAll('.sample-btn').forEach(btn => {
      btn.onclick = () => {
        const sampleKey = btn.dataset.sample;
        if (SAMPLE_SVGS[sampleKey]) {
          document.getElementById('svg-code-input').value = SAMPLE_SVGS[sampleKey];
          dropzone.querySelector('span').textContent = `✨ Ejemplo: ${btn.textContent.trim()}`;
          audio.playUiClick();
          document.getElementById('btn-convert-svg').click();
        }
      };
    });

    document.getElementById('btn-convert-svg').onclick = () => {
      const code = document.getElementById('svg-code-input').value.trim();
      if (!code) {
        alert('Por favor pega código SVG o sube un archivo .svg');
        return;
      }

      try {
        const dotsCount = parseInt(slider.value, 10);
        const newLevel = SVGConverter.convertSVG(code, dotsCount, 'Mi Creación SVG', 'personalizado');
        this.customGeneratedLevel = newLevel;

        // Mostrar vista previa
        const preview = document.getElementById('lab-preview');
        preview.innerHTML = `
          <svg viewBox="0 0 500 500" style="width: 100%; height: 100%;">
            <path d="${newLevel.outlinePath}" fill="none" stroke="#4361EE" stroke-width="4" stroke-dasharray="6,4" />
            ${newLevel.dots.map(d => `
              <circle cx="${d.x}" cy="${d.y}" r="8" fill="#FF5964" />
              <text x="${d.x}" y="${d.y + 4}" font-size="10" font-weight="bold" fill="#FFF" text-anchor="middle">${d.id}</text>
            `).join('')}
          </svg>
        `;

        document.getElementById('btn-play-custom').style.display = 'flex';
        audio.playUiClick();
        Haptics.success();
      } catch (err) {
        alert('Error al convertir el SVG: ' + err.message);
      }
    };

    document.getElementById('btn-play-custom').onclick = () => {
      if (this.customGeneratedLevel) {
        Storage.saveCustomLevel(this.customGeneratedLevel);
        this.renderLevelsGrid();
        this.startLevel(this.customGeneratedLevel);
      }
    };
  }
}

// Inicializar la aplicación cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('pointerdown', () => audio.init(), { once: true });
  new AppController();
});
