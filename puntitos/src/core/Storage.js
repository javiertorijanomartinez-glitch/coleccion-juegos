// Gestión de almacenamiento local para progreso, estrellas y dibujos coloreados
const STORAGE_KEY = 'puntitos_magicos_v1';

export class Storage {
  static getData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error al leer Storage:', e);
    }
    return {
      completedLevels: {}, // { [levelId]: { stars: 3, completedAt: date, coloredImage: dataUrl } }
      customLevels: [],
      soundEnabled: true,
      hapticsEnabled: true,
      selectedCategory: 'all'
    };
  }

  static saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error al guardar Storage:', e);
    }
  }

  static markCompleted(levelId, stars = 3) {
    const data = this.getData();
    if (!data.completedLevels[levelId]) {
      data.completedLevels[levelId] = { stars, completedAt: Date.now() };
    } else {
      data.completedLevels[levelId].stars = Math.max(data.completedLevels[levelId].stars || 0, stars);
    }
    this.saveData(data);
  }

  static isCompleted(levelId) {
    const data = this.getData();
    return !!data.completedLevels[levelId];
  }

  static getStars(levelId) {
    const data = this.getData();
    return data.completedLevels[levelId]?.stars || 0;
  }

  static saveColoredArt(levelId, dataUrl) {
    const data = this.getData();
    if (!data.completedLevels[levelId]) {
      data.completedLevels[levelId] = { stars: 3, completedAt: Date.now() };
    }
    data.completedLevels[levelId].coloredImage = dataUrl;
    this.saveData(data);
  }

  static getColoredArt(levelId) {
    const data = this.getData();
    return data.completedLevels[levelId]?.coloredImage || null;
  }

  static saveCustomLevel(levelObj) {
    const data = this.getData();
    data.customLevels = data.customLevels || [];
    const index = data.customLevels.findIndex(l => l.id === levelObj.id);
    if (index >= 0) {
      data.customLevels[index] = levelObj;
    } else {
      data.customLevels.push(levelObj);
    }
    this.saveData(data);
  }

  static getCustomLevels() {
    const data = this.getData();
    return data.customLevels || [];
  }
}
