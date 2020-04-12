const express = require('express');
const fs = require('fs');
// const jsmediatags = require('jsmediatags');
const { promisify } = require('util');

const app = express();
app.listen(4000, () => console.log('listening on port 4000'));

const readDir = promisify(fs.readdir);

const getAvaliableRecordings = async () => {
  // get files in audio directory
  const itemsUnfiltered = await readDir('./audio');
  // filter for mp3 items
  const items = itemsUnfiltered.filter((i) => i.slice(-3) === 'mp3');
  // make object with startTimes
  const recordingsObj = {};
  items.map((i) => {
    const startTime = new Date(parseInt(i.slice(0, 13)));
    recordingsObj[i] = { filename: i, startTime };
  });
  const avaliableRecordings = {
    files: items,
    data: recordingsObj,
  }
  return (avaliableRecordings);
}

app.get('/avaliable-recordings', async (req, res) => {
  const items = await getAvaliableRecordings();
  res.send(items);
});

app.get('/recording/:filename', async (req, res) => {
  const items = await getAvaliableRecordings();
  const filename = req.params.filename;
  // if file does not exist, send 404
  if (!items.files.includes(filename)) res.sendStatus(404);
  // if file exists, send file
  const stream = fs.createReadStream(`audio/${filename}`) 
  stream.pipe(res);
});
