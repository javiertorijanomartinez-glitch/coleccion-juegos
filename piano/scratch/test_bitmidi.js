import { MidiParser } from '../src/songs/MidiParser.js';

async function testBitMidi() {
  console.log('Testing download from BitMidi: Queen - Killer Queen (87218.mid)...');
  const res = await fetch('https://bitmidi.com/uploads/87218.mid');
  const buffer = await res.arrayBuffer();
  console.log('Downloaded size:', buffer.byteLength, 'bytes');

  const song = MidiParser.parse(buffer, 'Queen - Killer Queen');
  console.log('Parsed successfully!');
  console.log('Title:', song.title);
  console.log('Total notes parsed:', song.notes.length);
  console.log('First 5 notes:', song.notes.slice(0, 5));
}

testBitMidi().catch(console.error);
