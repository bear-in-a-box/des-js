const fs = require('fs');

/**
  @param {String} f
  @return {String[]}
*/
const readFileClean = f => fs.readFileSync(f)
  .toString()
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

/**
 * @param  {String} f
 * @return {Number[]}
 */
const readFileAsBuffer = f => [...fs.readFileSync(f, null)];

const writeFileFromBufferData = (f, data) => fs.writeFileSync(f, Buffer.from(data), null);

/**
 * @param  {Number|String} b
 * @param  {Number} length
 * @return {Boolean[]}
 */
const byteToBinary = (b, length) =>
  (typeof b == 'string' ? b.charCodeAt(0) :
   typeof b == 'number' ? b : 0)
  .toString(2)
  .padStart(length, '0')
  .split('')
  .map(c => !!+c);

const bufferToNumberArray = b => Array.from(b.values());

const boolArrayAsNumericString = v => v.map(a => +a).join('');

module.exports = {
  readFileClean,
  readFileAsBuffer,
  writeFileFromBufferData,
  byteToBinary,
  bufferToNumberArray,
  boolArrayAsNumericString
};
