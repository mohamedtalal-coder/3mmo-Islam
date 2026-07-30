function processMixedText(text) {
  // Regex to match Arabic text (including presentation forms)
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g;
  
  // Find all Arabic segments, reverse them character by character
  let processed = text;
  
  // Actually, standard way without bidi-js:
  // Split the string into tokens of (Arabic) and (Non-Arabic)
  const tokens = [];
  let currentToken = '';
  let isCurrentArabic = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(char);
    
    if (isArabic === isCurrentArabic) {
      currentToken += char;
    } else {
      if (currentToken) tokens.push({ text: currentToken, isArabic: isCurrentArabic });
      currentToken = char;
      isCurrentArabic = isArabic;
    }
  }
  if (currentToken) tokens.push({ text: currentToken, isArabic: isCurrentArabic });
  
  // Now reverse the Arabic tokens character by character
  // And reverse the overall array of tokens
  const reversedTokens = tokens.reverse().map(token => {
    if (token.isArabic) {
      return token.text.split('').reverse().join('');
    }
    // For non-Arabic, keep the characters in order, but the token itself moved.
    // Wait, spaces should probably not trigger a new token unless necessary, but space is not Arabic.
    return token.text;
  });
  
  return reversedTokens.join('');
}

const reshaped = require('arabic-reshaper').convertArabic('شهادة إتمام 123 دورة React');
console.log(processMixedText(reshaped));
