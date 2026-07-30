const { PDFDocument } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');

async function test() {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const fontBytes = fs.readFileSync('/usr/share/fonts/google-noto-vf/NotoNaskhArabic[wght].ttf');
  try {
    await pdfDoc.embedFont(fontBytes);
    console.log("Success!");
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
