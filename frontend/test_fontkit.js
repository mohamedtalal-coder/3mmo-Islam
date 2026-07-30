const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');

async function test() {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const fontBytes = fs.readFileSync('/usr/share/fonts/google-noto-vf/NotoNaskhArabic[wght].ttf');
  const customFont = await pdfDoc.embedFont(fontBytes);
  
  const page = pdfDoc.addPage([500, 500]);
  
  const text = "شهادة إتمام";
  
  // Just pass the raw text, let fontkit do the shaping?
  page.drawText(text, {
    x: 50,
    y: 250,
    size: 40,
    font: customFont,
    color: rgb(0,0,0)
  });
  
  fs.writeFileSync('test_raw.pdf', await pdfDoc.save());
  console.log("PDF saved!");
}
test();
