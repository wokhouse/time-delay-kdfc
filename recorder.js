const fs = require('fs');
const icy = require('icy');
const lame = require('@suldashi/lame')

// mp3 stream URL from KDFC
const streamURL = 'http://18443.live.streamtheworld.com/KDFCFM_SC';

// stream decoder
const decoder = lame.Decoder();
// mp3 encoder
const encoder = lame.Encoder({
  channels: 2,
  bitDepth: 16,
  sampleRate: 44100
});

// get stream from encoder, write to files
// starts writing to new file every $interval minutes
class Recorder {
  constructor() {
    // interval in minutes
    this.interval = 60;
    this.audioFile = '';
    this.stream = null;
    this.terminated = false;
    
    // ingest stream, send to encoder
    icy.get(streamURL, function(res) {
      res.pipe(decoder).pipe(encoder);
    });
  }

  start() {
    console.log('starting recorder');
    // start recorder loop, restarts ever $interval minutes
    this.loop();
  }

  end() {
    console.log('terminating recorder');
    // end file writeStream and clear loop timeout, preventing recursion
    this.stream.end();
    clearTimeout(this.timeout);
  }

  loop () {
    // set up file, writeStream
    const now = Date.now();
    this.audioFile = `audio/${now}.mp3`;
    this.stream = fs.createWriteStream(this.audioFile);

    // log file name
    console.log(`writing to ${this.audioFile}`);

    // pipe encoder output into file
    encoder.pipe(this.stream);

    // in $interval minutes, stop writing to the file and recursively call the function
    this.timeout = setTimeout(() => {
      this.stream.end();
      this.loop();
    }, this.interval * 60 * 1000);
  }
}

module.exports = {
  Recorder
};
