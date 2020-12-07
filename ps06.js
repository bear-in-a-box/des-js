const { exec } = require('child_process');
const utils = require('../utils');
const DES = require('./DES');

let KEY;

self.onmessage = function (msg) {
  if ('encode' in msg) {
    const sourceFile = utils.readFileAsBuffer(msg.inputFile);
    utils.writeFileFromBufferData(msg.targetFile,
      DES.encode(msg.sourceFile, KEY.slice()));
  }
}

if (process.argv.length < 3) {
  console.log('No input file specified.');
  return;
}

const inputFile = process.argv[2];
const targetExtension = /\.([a-z]+)$/.exec(inputFile)[1];
const decodedFileName = 'decoded.' + targetExtension;

// console.time('Encode');
// const sourceFile = utils.readFileAsBuffer(inputFile);
// utils.writeFileFromBufferData('encoded.bin',
//   DES.encode(sourceFile, KEY.slice()));
// console.timeEnd('Encode');
//
// console.time('Decode');
// const encodedFile = utils.readFileAsBuffer('encoded.bin');
// utils.writeFileFromBufferData(decodedFileName,
//   DES.decode(encodedFile, KEY.slice()));
// console.timeEnd('Decode');
//
// exec(`xdg-open "${decodedFileName}"`);

const encoded = DES.encode([24, 13, 69, 104, 183, 98, 102, 201], KEY.slice())
console.log(`Encoded:`, encoded);
const decoded = DES.decode(encoded, KEY.slice());
console.log(`Decoded:`, decoded);
