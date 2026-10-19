/* ==========================================================================
   IMPOSTOR - Reveal View (Pass & Play Secret Word Display)
   Features "Hold to Reveal" mechanism
   ========================================================================== */

import { sound } from '../audio/soundEngine.js';
import { CATEGORIES } from '../data/defaultWords.js';

export class RevealView {
  constructor(engine) {
    this.engine = engine;
    this.isPressing = false;
    this.hasRevealedCurrent = false;
  }

  render(container) {
    const player = this.engine.getCurrentRevealPlayer();
    const isLastPlayer = this.engine.revealIndex >= this.engine.players.length - 1;
    const catObj = CATEGORIES.find(c => c.id === this.engine.currentPair?.category) || { name: 'General', icon: '✨' };

    // Determine what to show when holding
    let roleBadgeHtml = '';
    let wordTitle = 'Tu Palabra Secreta:';
    let wordText = '';
    let adviceText = '';
    let isCivilianStyle = false;

    if (player.isImpostor) {
      if (this.engine.mode === 'classic') {
        roleBadgeHtml = `<span class="role-badge impostor">🎭 Eres el Impostor</span>`;
        wordTitle = 'Tu Misión:';
        wordText = '¡NO TIENES PALABRA!';
        adviceText = 'Escucha con atención las pistas de los demás e intenta deducir de qué están hablando sin ser descubierto.';
      } else {
        // Trap mode: Impostor receives decoy word without explicit role label
        roleBadgeHtml = `<span class="role-badge" style="background: rgba(138, 43, 226, 0.2); border: 1px solid var(--violet); color: #c084fc;">Palabra Asignada</span>`;
        wordTitle = 'Tu Palabra Secreta:';
        wordText = player.word;
        adviceText = 'Di una pista sobre tu palabra sin ser demasiado evidente. ¡Cuidado con el impostor!';
      }
    } else {
      // Civilian
      isCivilianStyle = true;
      roleBadgeHtml = `<span class="role-badge civilian">🛡️ Eres Civil</span>`;
      wordTitle = 'Tu Palabra Secreta:';
      wordText = player.word;
      adviceText = 'Los demás civiles tienen tu misma palabra. Da pistas sutiles para identificar al impostor.';
    }

    container.innerHTML = `
      <div class="view-container anim-fade-in-up">
        <!-- Turn Header -->
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="display: inline-flex; align-items: center; gap: 8px; background: var(--bg-surface-glass); padding: 6px 16px; border-radius: var(--radius-full); border: 1px solid var(--border-glass); margin-bottom: 10px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
              Pase de Turno • ${this.engine.revealIndex + 1} de ${this.engine.players.length}
            </span>
          </div>
          <h2 class="font-heading" style="font-size: 1.6rem; color: #fff;">
            Pasa el dispositivo a <span style="color: ${player.color};">${player.name}</span>
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
            Asegúrate de que nadie más esté mirando la pantalla
          </p>
        </div>

        <!-- Reveal Card -->
        <div class="reveal-wrapper">
          <div id="reveal-card" class="reveal-card ${isCivilianStyle ? 'civilian' : ''}">
            
            <!-- Cover / Concealed State -->
            <div class="cover-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;">
              <div style="width: 70px; height: 70px; border-radius: var(--radius-full); background: var(--bg-surface-elevated); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-glass-strong);">
                <svg viewBox="0 0 24 24" style="width: 36px; height: 36px; fill: var(--text-muted);"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              </div>
              <h3 style="color: #fff; font-size: 1.25rem;">Palabra Oculta</h3>
              <p style="color: var(--text-muted); font-size: 0.86rem; max-width: 240px; line-height: 1.4;">
                Mantén presionado el botón inferior para revelar tu secreto.
              </p>
            </div>

            <!-- Secret Revealed State -->
            <div class="secret-content">
              ${roleBadgeHtml}
              <span class="category-tag" style="margin-bottom: 12px;">
                ${catObj.icon} Categoría: <strong>${catObj.name}</strong>
              </span>
              <span class="secret-word-title">${wordTitle}</span>
              <div class="secret-word" style="color: ${player.isImpostor && this.engine.mode === 'classic' ? 'var(--crimson)' : 'var(--cyan)'};">
                ${wordText}
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 280px; margin-top: 6px; line-height: 1.4;">
                ${adviceText}
              </p>
              <div style="margin-top: 14px; font-size: 0.75rem; color: var(--crimson); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
                ⚠️ Suelta para ocultar inmediatamente
              </div>
            </div>

          </div>

          <!-- Hold to Reveal Button -->
          <div class="hold-zone">
            <div id="hold-trigger-btn" class="hold-button" role="button" aria-label="Mantener pulsado para ver">
              <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </div>
            <span class="hold-text" id="hold-instruction-text">
              Mantén pulsado para ver tu palabra
            </span>
          </div>
        </div>

        <!-- Next Player Navigation -->
        <button id="next-player-btn" class="btn btn-secondary" style="margin-top: 20px;" ${!this.hasRevealedCurrent ? 'disabled' : ''}>
          <span>${isLastPlayer ? '¡Todos listos! Comenzar Pistas' : 'Siguiente Jugador →'}</span>
        </button>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    const card = container.querySelector('#reveal-card');
    const holdBtn = container.querySelector('#hold-trigger-btn');
    const nextBtn = container.querySelector('#next-player-btn');
    const instruction = container.querySelector('#hold-instruction-text');
    const player = this.engine.getCurrentRevealPlayer();

    const startReveal = (e) => {
      e.preventDefault();
      if (this.isPressing) return;
      this.isPressing = true;
      holdBtn.classList.add('pressing');
      card.classList.add('is-revealed');
      instruction.textContent = '¡Soltando se ocultará de inmediato!';
      instruction.style.color = 'var(--crimson)';
      
      sound.startHoldTension();
      sound.playReveal();

      this.hasRevealedCurrent = true;
      this.engine.markPlayerRevealed(player.id);
      nextBtn.removeAttribute('disabled');
      nextBtn.classList.remove('btn-secondary');
      nextBtn.classList.add('btn-primary');
    };

    const stopReveal = (e) => {
      if (!this.isPressing) return;
      this.isPressing = false;
      holdBtn.classList.remove('pressing');
      card.classList.remove('is-revealed');
      instruction.textContent = 'Mantén pulsado para volver a mirar';
      instruction.style.color = 'var(--text-muted)';
      sound.stopHoldTension();
    };

    // Pointer Events for Universal Touch & Mouse Support
    holdBtn.addEventListener('pointerdown', startReveal);
    window.addEventListener('pointerup', stopReveal);
    window.addEventListener('pointercancel', stopReveal);

    // Next Player button
    nextBtn.addEventListener('click', () => {
      sound.playTap();
      sound.stopHoldTension();
      this.hasRevealedCurrent = false;
      this.engine.nextRevealPlayer();
    });
  }
}
