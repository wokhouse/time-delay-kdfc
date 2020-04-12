const fs = require('fs');
const icy = require('icy');
const lame = require('@suldashi/lame')

const streamURL = 'http://18443.live.streamtheworld.com/KDFCFM_SC';
const audioFile = 'audio/recording.mp3';
const stream = fs.createWriteStream(audioFile);

const encoder = lame.Encoder({
  channels: 2,
  bitDepth: 16,
  sampleRate: 44100
});
const decoder = lame.Decoder();

encoder.pipe(stream);
setTimeout(() => stream.end(), 1000);

icy.get(streamURL, function(res) {
  res.pipe(decoder).pipe(encoder);
});
