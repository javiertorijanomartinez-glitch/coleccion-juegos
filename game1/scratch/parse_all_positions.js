import https from 'https';
https.get('https://upload.wikimedia.org/wikipedia/commons/c/cd/Parch%C3%ADs.svg', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // In Parchis.svg, let's find the numbers around Red (top-left house)
    // Red house is cx=225, cy=226
    // Arm next to it is West arm (cy around 640) and North arm (cx around 640)
    // Let's print all numbers with their (x, y) coordinates
    const texts = [];
    const re = /<text[^>]*transform="matrix\(([^)]+)\)"[^>]*>(\d+)<\/text>/g;
    let m;
    while ((m = re.exec(data)) !== null) {
      const parts = m[1].trim().split(/\s+/).map(Number);
      // matrix is: a c e
      //            b d f
      // coordinates (tx, ty) are parts[4], parts[5]
      const tx = parts[4];
      const ty = parts[5];
      texts.push({ num: parseInt(m[2]), tx, ty });
    }
    texts.sort((a, b) => a.num - b.num);
    console.log('All 68 text positions:');
    texts.forEach(t => console.log(`${t.num.toString().padStart(2, ' ')}: x=${t.tx.toFixed(1)}, y=${t.ty.toFixed(1)}`));
  });
});
