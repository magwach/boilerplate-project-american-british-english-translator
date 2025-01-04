import americanToBritishTitles from './american-to-british-titles.js';
import americanToBritishSpelling from './american-to-british-spelling.js';
import americanOnly from './american-only.js';
import britishOnly from './british-only.js';

export default class Translator {
  translate(text, locale) {
    const originalText = text;

    if (locale !== 'american-to-british' && locale !== 'british-to-american') {
      return { error: 'Invalid value for locale field' };
    }

    const translationMap = locale === 'american-to-british' 
      ? americanToBritishSpelling 
      : Object.fromEntries(Object.entries(americanToBritishSpelling).map(([key, value]) => [value, key]));

    const titleMap = locale === 'american-to-british' 
      ? americanToBritishTitles 
      : Object.fromEntries(Object.entries(americanToBritishTitles).map(([key, value]) => [value.toLowerCase(), key]));

    const onlyMap = locale === 'american-to-british' ? americanOnly : britishOnly;

    // Convert time formatting
    text = this.convertTime(text, locale);

    // Convert titles/honorifics
    text = this.convertTitles(text, titleMap, locale);

    // Convert spelling
    text = this.convertSpelling(text, translationMap);

    // Convert unique terms
    text = this.convertUniqueTerms(text, onlyMap);

    // Return the result
    return { text: text, translation: text === originalText ? 'Everything looks good to me!' : text };
  }

  // Convert time format
  convertTime(text, locale) {
    const americanTimeRegex = /(\d{1,2}):(\d{2})/g;
    const britishTimeRegex = /(\d{1,2})\.(\d{2})/g;

    if (locale === 'american-to-british') {
      return text.replace(americanTimeRegex, `<span class="highlight">$1.$2</span>`);
    } else {
      return text.replace(britishTimeRegex, `<span class="highlight">$1:$2</span>`);
    }
  }

  // Convert titles/honorifics
  convertTitles(text, titleMap) {
    const regex = new RegExp(`\\b(${Object.keys(titleMap).join('|')})(\\s|\\b)`, 'gi');
  
    return text.replace(regex, (match, title, space) => {
      const normalizedTitle = title.toLowerCase(); 
      const replacement = titleMap[normalizedTitle];
  
      if (replacement) {
        return `<span class="highlight">${replacement}</span>${space}`;
      }
  
      return match; 
    });
  }
    
  

  // Convert spelling
  convertSpelling(text, translationMap) {
    const regex = new RegExp(Object.keys(translationMap).join('|'), 'gi');
    return text.replace(regex, (match) => {
      const replacement = translationMap[match.toLowerCase()];
      return replacement 
        ? `<span class="highlight">${replacement}</span>` 
        : match;
    });
  }

  // Convert terms specific to British or American English
  convertUniqueTerms(text, onlyMap) {
    const regex = new RegExp(Object.keys(onlyMap).join('|'), 'gi');
    return text.replace(regex, (match) => {
      const replacement = onlyMap[match.toLowerCase()];
      return replacement 
        ? `<span class="highlight">${replacement}</span>` 
        : match;
    });
  }
}
