// Conversor y generador de plantillas a partir de archivos o cadenas SVG
export class SVGConverter {
  /**
   * Extrae puntos de un SVG dado y los normaliza a un canvas de targetSize (por defecto 500x500)
   * @param {string} svgContent - Código XML/SVG en texto
   * @param {number} desiredDots - Cantidad deseada de puntos (ej. 15, 25, 40)
   * @param {string} title - Título del dibujo
   * @param {string} category - Categoría
   */
  static convertSVG(svgContent, desiredDots = 20, title = 'Mi Plantilla', category = 'personalizado') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    
    // Buscar todos los elementos de trazado en el SVG
    const pathElements = doc.querySelectorAll('path, polygon, polyline, rect, circle, ellipse');
    if (!pathElements.length) {
      throw new Error('No se encontraron trazados válidos en el SVG proporcionado.');
    }

    // Convertir todo a paths virtuales para poder medir longitud
    const svgNS = 'http://www.w3.org/2000/svg';
    const tempSvg = document.createElementNS(svgNS, 'svg');
    tempSvg.style.position = 'absolute';
    tempSvg.style.visibility = 'hidden';
    document.body.appendChild(tempSvg);

    const paths = [];

    pathElements.forEach(el => {
      let pathD = '';
      if (el.tagName.toLowerCase() === 'path') {
        pathD = el.getAttribute('d') || '';
      } else if (el.tagName.toLowerCase() === 'polygon' || el.tagName.toLowerCase() === 'polyline') {
        const points = el.getAttribute('points');
        if (points) {
          const coords = points.trim().split(/[\s,]+/);
          if (coords.length >= 4) {
            pathD = `M ${coords[0]} ${coords[1]} ` + coords.slice(2).reduce((acc, val, i, arr) => {
              if (i % 2 === 0) return acc + `L ${val} ${arr[i+1]} `;
              return acc;
            }, '') + (el.tagName.toLowerCase() === 'polygon' ? 'Z' : '');
          }
        }
      } else if (el.tagName.toLowerCase() === 'rect') {
        const x = parseFloat(el.getAttribute('x') || 0);
        const y = parseFloat(el.getAttribute('y') || 0);
        const w = parseFloat(el.getAttribute('width') || 100);
        const h = parseFloat(el.getAttribute('height') || 100);
        pathD = `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;
      } else if (el.tagName.toLowerCase() === 'circle') {
        const cx = parseFloat(el.getAttribute('cx') || 50);
        const cy = parseFloat(el.getAttribute('cy') || 50);
        const r = parseFloat(el.getAttribute('r') || 40);
        pathD = `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
      }

      if (pathD.trim()) {
        const p = document.createElementNS(svgNS, 'path');
        p.setAttribute('d', pathD);
        tempSvg.appendChild(p);
        paths.push(p);
      }
    });

    if (paths.length === 0) {
      document.body.removeChild(tempSvg);
      throw new Error('No se pudieron extraer trazados procesables.');
    }

    // Seleccionar el trazado más largo (el contorno principal) o concatenar
    let mainPath = paths[0];
    let maxLen = mainPath.getTotalLength();
    for (let i = 1; i < paths.length; i++) {
      const len = paths[i].getTotalLength();
      if (len > maxLen) {
        maxLen = len;
        mainPath = paths[i];
      }
    }

    // Muestrear puntos uniformemente a lo largo de la longitud del trazado
    const sampledPoints = [];
    const count = Math.max(8, desiredDots);
    for (let i = 0; i < count; i++) {
      const distance = (i / count) * maxLen;
      const pt = mainPath.getPointAtLength(distance);
      sampledPoints.push({ x: pt.x, y: pt.y });
    }

    // Limpiar DOM temporal
    document.body.removeChild(tempSvg);

    // Normalizar puntos a una caja centrada de 500x500 con margen
    const minX = Math.min(...sampledPoints.map(p => p.x));
    const maxX = Math.max(...sampledPoints.map(p => p.x));
    const minY = Math.min(...sampledPoints.map(p => p.y));
    const maxY = Math.max(...sampledPoints.map(p => p.y));

    const origW = maxX - minX || 1;
    const origH = maxY - minY || 1;
    const targetSize = 500;
    const padding = 60;
    const availSize = targetSize - padding * 2;

    const scale = Math.min(availSize / origW, availSize / origH);
    const offsetX = (targetSize - origW * scale) / 2 - minX * scale;
    const offsetY = (targetSize - origH * scale) / 2 - minY * scale;

    const dots = sampledPoints.map((pt, index) => ({
      id: index + 1,
      x: Math.round(pt.x * scale + offsetX),
      y: Math.round(pt.y * scale + offsetY)
    }));

    // Construir trazado simplificado
    const outlinePath = dots.reduce((acc, pt, i) => {
      return acc + (i === 0 ? `M ${pt.x} ${pt.y} ` : `L ${pt.x} ${pt.y} `);
    }, '') + 'Z';

    const levelObj = {
      id: 'custom_' + Date.now(),
      title: title || 'Dibujo Creado',
      category: category || 'personalizado',
      categoryName: 'Personalizados',
      difficulty: count <= 16 ? 'facil' : (count <= 30 ? 'medio' : 'dificil'),
      dotsCount: count,
      icon: '🎨',
      description: '¡Plantilla generada desde tu propio archivo SVG!',
      isClosed: true,
      viewWidth: targetSize,
      viewHeight: targetSize,
      dots,
      outlinePath,
      colorArt: `<path d="${outlinePath}" fill="#70D6FF" stroke="#35A7FF" stroke-width="7" stroke-linejoin="round" opacity="0.9" />`
    };

    return levelObj;
  }
}
