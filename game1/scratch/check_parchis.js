import https from 'https';
https.get('https://upload.wikimedia.org/wikipedia/commons/c/cd/Parch%C3%ADs.svg', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const texts = [];
    const re = /<text[^>]*transform="([^"]+)"[^>]*>(\d+)<\/text>/g;
    let m;
    while ((m = re.exec(data)) !== null) {
      texts.push({ num: parseInt(m[2]), transform: m[1] });
    }
    texts.sort((a, b) => a.num - b.num);
    texts.forEach(t => console.log(t.num + ': ' + t.transform));
  });
});
