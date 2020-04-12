const fs = require('fs');
const path = require('path');
const { Recorder } = require('./recorder.js');

// clear files from ./audio dir
// const directory = './audio';
// fs.readdir(directory, (err, files) => {
//   if (err) throw err;
// 
//   for (const file of files) {
//     fs.unlink(path.join(directory, file), err => {
//       if (err) throw err;
//     });
//   }
// });

const recorder = new Recorder();
recorder.start();
