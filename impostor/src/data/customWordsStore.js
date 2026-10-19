/* ==========================================================================
   IMPOSTOR - Custom Words Store (localStorage persistence)
   ========================================================================== */

import { DEFAULT_WORD_PAIRS } from './defaultWords.js';

const STORAGE_KEY = 'impostor_custom_words';

export class CustomWordsStore {
  static getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Could not read custom words from localStorage:', e);
      return [];
    }
  }

  static save(words) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    } catch (e) {
      console.warn('Could not save custom words to localStorage:', e);
    }
  }

  static addWord(civil, impostor) {
    if (!civil || !impostor) return false;
    const words = this.getAll();
    const newWord = {
      id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      civil: civil.trim(),
      impostor: impostor.trim(),
      category: 'custom'
    };
    words.unshift(newWord);
    this.save(words);
    return newWord;
  }

  static removeWord(id) {
    let words = this.getAll();
    words = words.filter(w => w.id !== id);
    this.save(words);
    return words;
  }

  static getPlayableWords(categoryId = 'all') {
    const customWords = this.getAll();

    if (categoryId === 'custom') {
      return customWords;
    }

    if (categoryId === 'all') {
      return [...DEFAULT_WORD_PAIRS, ...customWords];
    }

    // Specific category
    return DEFAULT_WORD_PAIRS.filter(w => w.category === categoryId);
  }
}
