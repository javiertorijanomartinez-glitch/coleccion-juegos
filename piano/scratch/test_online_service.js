import { OnlineSongService } from '../src/songs/OnlineSongService.js';
import { SongManager } from '../src/songs/SongManager.js';

// Mock localStorage
globalThis.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = v; }
};

async function testFullOnlineFlow() {
  console.log('=== TEST: OnlineSongService Search & Download Flow ===');
  const service = new OnlineSongService();
  const manager = new SongManager();

  console.log('1. Searching for "Mario"...');
  const searchData = await service.search('Mario', 0, 5);
  console.log(`Found ${searchData.total} songs (page 0):`);
  searchData.results.forEach((r, i) => {
    console.log(` [${i+1}] ${r.title} (ID: ${r.id}) -> ${r.downloadUrl}`);
  });

  if (!searchData.results || searchData.results.length === 0) {
    throw new Error('Search returned no results');
  }

  const first = searchData.results[0];
  console.log(`\n2. Downloading first result: "${first.title}"...`);
  const buffer = await service.downloadMidi(first.downloadUrl);
  console.log('Downloaded bytes:', buffer.byteLength);

  if (buffer.byteLength < 100) {
    throw new Error('Downloaded buffer is unexpectedly small');
  }

  console.log('\n3. Parsing and adding to SongManager...');
  const song = manager.loadFromOnlineBuffer(buffer, first.title);
  console.log('Loaded song into SongManager successfully!');
  console.log('- Title:', song.title);
  console.log('- Category:', song.category);
  console.log('- Total notes parsed:', song.notes.length);
  console.log('- Difficulty:', song.difficulty);
  console.log('- First 3 notes:', song.notes.slice(0, 3));

  console.log('\n🎉 ALL ONLINE SONG SERVICE TESTS PASSED!');
}

testFullOnlineFlow().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
