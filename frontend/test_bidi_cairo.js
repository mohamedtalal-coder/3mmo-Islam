const bidi = require('bidi-js')();
const arabicReshaper = require('arabic-reshaper');

const text = "شهادة إتمام";
const reshaped = arabicReshaper.convertArabic(text);
const levels = bidi.getEmbeddingLevels(reshaped, 'rtl');
const bidiResult = bidi.getReorderedString(reshaped, levels);

console.log(bidiResult);
