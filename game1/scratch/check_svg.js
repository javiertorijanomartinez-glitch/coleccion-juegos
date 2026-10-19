import https from 'https';
https.get('https://upload.wikimedia.org/wikipedia/commons/c/cd/Parch%C3%ADs.svg', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const vb = data.match(/viewBox="([^"]+)"/);
    console.log('viewBox:', vb ? vb[1] : 'none');
    // find rects with fill or large dimensions
    const rects = data.match(/<rect[^>]+>/g) || [];
    console.log('Rects count:', rects.length);
    rects.slice(0, 10).forEach(r => console.log(r));
    // find colors (amarillo, rojo, verde, azul)
    const paths = data.match(/<path[^>]+fill="([^"]+)"[^>]*>/g) || [];
    console.log('Paths with fill count:', paths.length);
    const colors = new Set();
    paths.forEach(p => {
      const m = p.match(/fill="([^"]+)"/);
      if (m) colors.add(m[1]);
    });
    console.log('Colors:', Array.from(colors));
  });
});
