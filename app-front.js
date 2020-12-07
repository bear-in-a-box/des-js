const { remote } = require('electron');
const { dialog } = require('electron').remote;

const status = document.getElementById('status');

const worker = new Worker('DES.js');
worker.addEventListener('message', function (msg) {
  msg = msg.data;
  // msg.progress: number
  // msg.done: boolean
  if ('progress' in msg) {
    status.textContent = 'Status: working (' + msg.progress + ')';
  } else if ('done' in msg && msg.done) {
    operationFinished();
  }
});

remote.getCurrentWindow().toggleDevTools();

function setFieldsEnabled(value) {
  [].forEach.call(
    document.querySelectorAll('input, button'),
    f => f.disabled = !value
  );
}

let fileToEncode, fileToDecode;
let fileToEncodeOutput, fileToDecodeOutput;

function getKey() {
  const text = document.getElementById('key').value;
  return text.split(/\, ?/).map(v => +v);
}

function encode() {
  console.log('send encode request');
  setFieldsEnabled(false);

  worker.postMessage({
    encode: true,
    inputFile: fileToEncode,
    targetFile: fileToEncodeOutput,
    key: getKey()
  });
}

function decode() {
  setFieldsEnabled(false);

  worker.postMessage({
    encode: true,
    inputFile: fileToDecode,
    targetFile: fileToDecodeOutput,
    key: getKey()
  });
}

function operationFinished() {
  setFieldsEnabled(true);
  status.textContent = 'Status: ready';
}

function showOpenFileDialog(operation) {
  dialog.showOpenDialog(fileNames => {
    if (!fileNames)
      return;
    const fileName = fileNames[0];
    showSaveFileDialog(operation, fileName);
  });
}

function showSaveFileDialog(operation, fileToDoThing) {
  dialog.showSaveDialog(fileName => {
    if (!fileName)
      return;
    switch (operation) {
      case 'encode':
        fileToEncode = fileToDoThing;
        fileToEncodeOutput = fileName;
        updateFileNames(operation, fileToEncode, fileToEncodeOutput);
        break;
      case 'decode':
        fileToDecode = fileToDoThing;
        fileToDecodeOutput = fileName;
        updateFileNames(operation, fileToDecode, fileToDecodeOutput);
        break;
    }
  });
}

function updateFileNames(selector, fileIn, fileOut) {
  const labels = document.querySelectorAll('.info-' + selector);
  labels[0].textContent = 'In: ' + fileIn;
  labels[1].textContent = 'Out: ' + fileOut;
}

function clearFileNames() {
  [].forEach.call(
    document.querySelectorAll('.info'),
    el => el.textContent = ''
  )
}