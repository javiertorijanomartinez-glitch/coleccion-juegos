/* ==========================================================================
   IMPOSTOR - Custom Words Manager Modal
   ========================================================================== */

import { CustomWordsStore } from '../data/customWordsStore.js';
import { sound } from '../audio/soundEngine.js';

export class CustomWordsModal {
  static render(onUpdate = null) {
    const existing = document.getElementById('custom-words-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'custom-words-modal';
    modal.className = 'modal-backdrop';

    modal.innerHTML = `
      <div class="modal-card anim-card-flip">
        <div class="modal-header">
          <h2 class="modal-title font-heading">Palabras Personalizadas</h2>
          <button id="close-custom-modal-btn" class="icon-btn" aria-label="Cerrar">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <p style="font-size: 0.88rem; color: var(--text-muted);">
          Añade tus propias parejas de palabras para jugar con tus amigos. La palabra civil es la secreta de la mayoría y la palabra trampa es la que recibirá el impostor en modo trampa.
        </p>

        <!-- New word form -->
        <form id="add-word-form" style="display: flex; flex-direction: column; gap: 10px; background: var(--bg-surface); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
          <div class="input-group">
            <label class="input-label">Palabra Civil (Secreta):</label>
            <input type="text" id="custom-civil-input" class="text-input" placeholder="Ej. Hamburguesa" required />
          </div>

          <div class="input-group">
            <label class="input-label">Palabra Trampa (Impostor):</label>
            <input type="text" id="custom-impostor-input" class="text-input" placeholder="Ej. Perrito caliente" required />
          </div>

          <button type="submit" class="btn btn-cyan btn-sm" style="margin-top: 4px;">
            + Añadir Pareja
          </button>
        </form>

        <!-- List of existing custom words -->
        <div style="margin-top: 6px;">
          <h4 style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px;">Tus Palabras Guardadas:</h4>
          <div id="custom-words-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto;">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <button id="close-custom-done-btn" class="btn btn-secondary">
          Listo
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    const listContainer = modal.querySelector('#custom-words-list');
    const form = modal.querySelector('#add-word-form');
    const civilInput = modal.querySelector('#custom-civil-input');
    const impostorInput = modal.querySelector('#custom-impostor-input');

    const renderList = () => {
      const words = CustomWordsStore.getAll();
      if (words.length === 0) {
        listContainer.innerHTML = `
          <div style="text-align: center; color: var(--text-subtle); padding: 12px; font-size: 0.85rem;">
            No has añadido palabras personalizadas todavía.
          </div>
        `;
        return;
      }

      listContainer.innerHTML = words.map(w => `
        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); padding: 8px 12px;">
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 700; color: #fff; font-size: 0.92rem;">${w.civil}</span>
            <span style="font-size: 0.76rem; color: var(--text-muted);">Trampa: ${w.impostor}</span>
          </div>
          <button data-delete-id="${w.id}" class="icon-btn" style="width: 28px; height: 28px; color: var(--crimson); border-color: rgba(255, 45, 85, 0.3);" title="Eliminar">
            <svg viewBox="0 0 24 24" style="width: 14px; height: 14px;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      `).join('');

      listContainer.querySelectorAll('[data-delete-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          sound.playTap();
          const id = btn.getAttribute('data-delete-id');
          CustomWordsStore.removeWord(id);
          renderList();
          if (onUpdate) onUpdate();
        });
      });
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const civil = civilInput.value;
      const impostor = impostorInput.value;
      if (civil && impostor) {
        sound.playTap();
        CustomWordsStore.addWord(civil, impostor);
        civilInput.value = '';
        impostorInput.value = '';
        civilInput.focus();
        renderList();
        if (onUpdate) onUpdate();
      }
    });

    const closeModal = () => {
      sound.playTap();
      modal.remove();
    };

    modal.querySelector('#close-custom-modal-btn').addEventListener('click', closeModal);
    modal.querySelector('#close-custom-done-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    renderList();
  }
}
