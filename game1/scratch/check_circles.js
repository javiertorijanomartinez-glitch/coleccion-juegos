import https from 'https';
https.get('https://upload.wikimedia.org/wikipedia/commons/c/cd/Parch%C3%ADs.svg', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find all circles, texts and colors
    const circles = data.match(/<circle[^>]+>/g) || [];
    console.log('Circles:');
    circles.forEach(c => console.log(c));
  });
});
