/* ==========================================================================
   IMPOSTOR - Game Over View (Winner Celebration & Full Role Breakdown)
   ========================================================================== */

import { sound } from '../audio/soundEngine.js';

export class GameOverView {
  constructor(engine) {
    this.engine = engine;
    this.confettiInterval = null;
  }

  render(container) {
    const isCivilianWin = this.engine.winner === 'CIVIL';
    const pair = this.engine.currentPair;

    container.innerHTML = `
      <div class="view-container anim-fade-in-up">
        <canvas id="confetti-canvas" class="confetti-canvas"></canvas>

        <!-- Winner Banner -->
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 72px; height: 72px; border-radius: var(--radius-full); background: ${isCivilianWin ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 45, 85, 0.2)'}; border: 2px solid ${isCivilianWin ? 'var(--cyan)' : 'var(--crimson)'}; display: flex; align-items: center; justify-content: center; font-size: 2.4rem; margin: 0 auto 12px; box-shadow: 0 0 25px ${isCivilianWin ? 'var(--cyan-glow)' : 'var(--crimson-glow)'};">
            ${isCivilianWin ? '🏆' : '🎭'}
          </div>

          <h2 class="font-heading" style="font-size: 2rem; color: #fff; line-height: 1.2;">
            ${isCivilianWin ? '¡Victoria de los Civiles!' : '¡Victoria del Impostor!'}
          </h2>

          <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 320px; margin: 6px auto 0; line-height: 1.4;">
            ${this.engine.winReason}
          </p>
        </div>

        <!-- Words Summary Box -->
        <div class="glass-card" style="padding: 16px; margin-bottom: 16px; border-color: var(--border-glass-strong);">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 10px;">
            Palabras Jugadas:
          </span>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
              <span style="font-size: 0.85rem; color: var(--cyan); font-weight: 700;">🛡️ Palabra Civil:</span>
              <strong style="color: #fff; font-size: 1.1rem; font-family: var(--font-heading);">${pair?.civil || '---'}</strong>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
              <span style="font-size: 0.85rem; color: var(--crimson); font-weight: 700;">🎭 Palabra Impostor:</span>
              <strong style="color: #fff; font-size: 1.1rem; font-family: var(--font-heading);">
                ${this.engine.mode === 'trap' ? pair?.impostor : '(Ninguna / Modo Clásico)'}
              </strong>
            </div>
          </div>
        </div>

        <!-- Players Breakdown List -->
        <div class="glass-card" style="padding: 16px; margin-bottom: 20px; flex: 1; display: flex; flex-direction: column;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 10px;">
            Identidad de todos los jugadores:
          </span>

          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto; padding-right: 4px;">
            ${this.engine.players.map(p => `
              <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); border: 1px solid ${p.isImpostor ? 'rgba(255, 45, 85, 0.4)' : 'rgba(0, 242, 254, 0.2)'}; padding: 8px 12px; border-radius: var(--radius-sm);">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="width: 28px; height: 28px; border-radius: 50%; background: ${p.color}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; color: #fff;">
                    ${p.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div style="font-weight: 700; color: #fff; font-size: 0.92rem;">
                      ${p.name}
                      ${p.isEliminated ? '<span style="font-size: 0.72rem; color: var(--crimson); margin-left: 4px;">(Expulsado)</span>' : ''}
                    </div>
                  </div>
                </div>

                <div style="text-align: right;">
                  ${p.isImpostor ? `
                    <span class="role-badge impostor" style="padding: 2px 8px; font-size: 0.72rem; margin: 0;">Impostor</span>
                  ` : `
                    <span class="role-badge civilian" style="padding: 2px 8px; font-size: 0.72rem; margin: 0;">Civil</span>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: auto;">
          <button id="restart-game-btn" class="btn btn-primary anim-pulse-glow" style="font-size: 1.1rem;">
            🔄 Jugar otra partida (Mismos ajustes)
          </button>
          <button id="back-lobby-btn" class="btn btn-secondary">
            ⚙️ Cambiar ajustes / Menú Principal
          </button>
        </div>
      </div>
    `;

    this.startConfetti(container);
    this.bindEvents(container);
  }

  startConfetti(container) {
    const canvas = container.querySelector('#confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ff2d55', '#00f2fe', '#8a2be2', '#ffb703', '#00e676'];
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 4 - 2
    }));

    let animationFrame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });
      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    // Stop after 8 seconds
    setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 8000);
  }

  bindEvents(container) {
    container.querySelector('#restart-game-btn')?.addEventListener('click', () => {
      sound.playTap();
      this.engine.restartGame();
    });

    container.querySelector('#back-lobby-btn')?.addEventListener('click', () => {
      sound.playTap();
      this.engine.resetToLobby();
    });
  }
}
