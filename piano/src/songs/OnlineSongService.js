/**
 * OnlineSongService.js
 * Servicio cliente para buscar y descargar melodías MIDI desde el catálogo de BitMidi (más de 113.000 archivos).
 * Utiliza peticiones fetch directas aprovechando el CORS abierto del servidor.
 */

export class OnlineSongService {
  constructor() {
    this.baseUrl = 'https://bitmidi.com';
    this.apiSearchEndpoint = 'https://bitmidi.com/api/midi/search';
    this.cache = new Map();
  }

  /**
   * Busca canciones por término, artista o título.
   * @param {string} query Término de búsqueda (ej. "Queen", "Super Mario", "Beethoven")
   * @param {number} page Página de resultados (0-indexada)
   * @param {number} pageSize Cantidad de resultados por página
   * @returns {Promise<{ results: Array, total: number, page: number, pageTotal: number }>}
   */
  async search(query, page = 0, pageSize = 20) {
    const q = (query || '').trim();
    if (!q) {
      return { results: [], total: 0, page: 0, pageTotal: 0 };
    }

    const cacheKey = `${q.toLowerCase()}_${page}_${pageSize}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const url = `${this.apiSearchEndpoint}?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error en el servidor de BitMidi: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const res = data.result || {};

      const formattedResults = (res.results || []).map(item => {
        // Limpiar nombre quitando la extensión .mid
        const cleanTitle = (item.name || 'Melodía sin título')
          .replace(/\.midi?$/i, '')
          .replace(/[-_]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        const fullDownloadUrl = item.downloadUrl.startsWith('http')
          ? item.downloadUrl
          : `${this.baseUrl}${item.downloadUrl}`;

        return {
          id: item.id,
          rawTitle: item.name,
          title: cleanTitle,
          slug: item.slug,
          downloadUrl: fullDownloadUrl,
          plays: item.plays || 0,
          views: item.views || 0
        };
      });

      const resultPayload = {
        results: formattedResults,
        total: res.total || 0,
        page: res.query ? res.query.page : page,
        pageTotal: res.pageTotal || 0
      };

      this.cache.set(cacheKey, resultPayload);
      return resultPayload;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('La búsqueda tardó demasiado tiempo. Comprueba tu conexión a internet.');
      }
      throw new Error(`No se pudo conectar con el catálogo online: ${err.message}`);
    }
  }

  /**
   * Descarga un archivo MIDI en formato binario ArrayBuffer.
   * @param {string} downloadUrl URL del archivo .mid
   * @returns {Promise<ArrayBuffer>}
   */
  async downloadMidi(downloadUrl) {
    const targetUrl = downloadUrl.startsWith('http')
      ? downloadUrl
      : `${this.baseUrl}${downloadUrl}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(targetUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error al descargar archivo MIDI (${response.status})`);
      }

      return await response.arrayBuffer();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Tiempo de espera agotado al descargar la canción.');
      }
      throw err;
    }
  }
}
