import https from 'https';
https.get('https://upload.wikimedia.org/wikipedia/commons/c/cd/Parch%C3%ADs.svg', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const texts = [];
    const re = /<text[^>]*transform="matrix\(([^)]+)\)"[^>]*>(\d+)<\/text>/g;
    let m;
    while ((m = re.exec(data)) !== null) {
      const parts = m[1].trim().split(/\s+/).map(Number);
      texts.push({ num: parseInt(m[2]), tx: parts[4], ty: parts[5] });
    }
    texts.sort((a, b) => a.num - b.num);

    // Group by quadrant: 1-17, 18-34, 35-51, 52-68
    console.log('Quadrant 1 (1 to 17):');
    texts.filter(t => t.num >= 1 && t.num <= 17).forEach(t => console.log(`${t.num}: x=${t.tx.toFixed(1)}, y=${t.ty.toFixed(1)}`));

    console.log('\nQuadrant 2 (18 to 34):');
    texts.filter(t => t.num >= 18 && t.num <= 34).forEach(t => console.log(`${t.num}: x=${t.tx.toFixed(1)}, y=${t.ty.toFixed(1)}`));

    console.log('\nQuadrant 3 (35 to 51):');
    texts.filter(t => t.num >= 35 && t.num <= 51).forEach(t => console.log(`${t.num}: x=${t.tx.toFixed(1)}, y=${t.ty.toFixed(1)}`));

    console.log('\nQuadrant 4 (52 to 68):');
    texts.filter(t => t.num >= 52 && t.num <= 68).forEach(t => console.log(`${t.num}: x=${t.tx.toFixed(1)}, y=${t.ty.toFixed(1)}`));
  });
});
