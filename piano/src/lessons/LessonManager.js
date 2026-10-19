/**
 * LessonManager.js
 * Gestión del currículo de 15 lecciones, estado de progreso, desbloqueo y persistencia.
 */

import lessonsData from './lessonsData.js';

const STORAGE_KEY = 'piano_movil_lessons_progress';

export class LessonManager {
  constructor() {
    this.data = lessonsData;
    this.progress = this._loadProgress();
    this.currentLessonId = 'lesson-01';
  }

  _loadProgress() {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (err) {
        console.warn('Error leyendo progreso de lecciones:', err);
      }
    }
    // Estado inicial: solo la primera lección desbloqueada
    return {
      'lesson-01': { completed: false, stars: 0, bestScore: 0 }
    };
  }

  _saveProgress() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
      } catch (err) {
        console.warn('Error guardando progreso de lecciones:', err);
      }
    }
  }

  _getRawLessonList() {
    const list = [];
    this.data.modules.forEach(mod => {
      mod.lessons.forEach(l => {
        list.push({ ...l, moduleTitle: mod.title });
      });
    });
    return list;
  }

  getModules() {
    return this.data.modules.map(mod => ({
      ...mod,
      lessons: mod.lessons.map(lesson => ({
        ...lesson,
        progress: this.progress[lesson.id] || { completed: false, stars: 0, bestScore: 0 },
        isUnlocked: this.isLessonUnlocked(lesson.id)
      }))
    }));
  }

  getAllLessons() {
    const raw = this._getRawLessonList();
    return raw.map(l => ({
      ...l,
      progress: this.progress[l.id] || { completed: false, stars: 0, bestScore: 0 },
      isUnlocked: this.isLessonUnlocked(l.id)
    }));
  }

  getLesson(lessonId) {
    const raw = this._getRawLessonList();
    const found = raw.find(l => l.id === lessonId);
    if (found) {
      return {
        ...found,
        progress: this.progress[found.id] || { completed: false, stars: 0, bestScore: 0 },
        isUnlocked: this.isLessonUnlocked(found.id)
      };
    }
    return null;
  }

  getCurrentLesson() {
    return this.getLesson(this.currentLessonId) || this.getLesson('lesson-01');
  }

  selectLesson(lessonId) {
    const lesson = this.getLesson(lessonId);
    if (lesson) {
      this.currentLessonId = lessonId;
      return lesson;
    }
    return null;
  }

  isLessonUnlocked(lessonId) {
    // La lección 1 siempre está desbloqueada
    if (lessonId === 'lesson-01') return true;

    // Buscar la lección inmediatamente anterior en la lista cruda
    const raw = this._getRawLessonList();
    const idx = raw.findIndex(l => l.id === lessonId);
    if (idx > 0) {
      const prevLesson = raw[idx - 1];
      const prevProg = this.progress[prevLesson.id];
      return !!(prevProg && prevProg.completed);
    }
    return false;
  }

  getNextLessonId(currentLessonId) {
    const raw = this._getRawLessonList();
    const idx = raw.findIndex(l => l.id === currentLessonId);
    if (idx >= 0 && idx < raw.length - 1) {
      return raw[idx + 1].id;
    }
    return null;
  }

  saveLessonCompletion(lessonId, stars = 3, score = 1000) {
    const prev = this.progress[lessonId] || { completed: false, stars: 0, bestScore: 0 };
    this.progress[lessonId] = {
      completed: true,
      stars: Math.max(prev.stars, stars),
      bestScore: Math.max(prev.bestScore, score),
      completedAt: new Date().toISOString()
    };

    // Desbloquear la siguiente lección si existe
    const nextId = this.getNextLessonId(lessonId);
    if (nextId && !this.progress[nextId]) {
      this.progress[nextId] = { completed: false, stars: 0, bestScore: 0 };
    }

    this._saveProgress();
  }

  resetProgress() {
    this.progress = {
      'lesson-01': { completed: false, stars: 0, bestScore: 0 }
    };
    this._saveProgress();
  }
}
