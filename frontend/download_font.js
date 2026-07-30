const fs = require('fs');
const https = require('https');

const cssUrl = "https://fonts.googleapis.com/css2?family=Cairo:wght@400&display=swap";

https.get(cssUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0'
  }
}, (res) => {
  let css = '';
  res.on('data', d => css += d);
  res.on('end', () => {
    const ttfMatch = css.match(/url\(([^)]+\.ttf)\)/);
    if (ttfMatch) {
      console.log("Downloading from: ", ttfMatch[1]);
      const file = fs.createWriteStream("public/fonts/Cairo-Regular.ttf");
      https.get(ttfMatch[1], function(response) {
        response.pipe(file);
        file.on('finish', function() {
          file.close();
          console.log("Downloaded successfully.");
        });
      });
    } else {
      console.log("Could not find TTF url in CSS: ", css);
    }
  });
});
