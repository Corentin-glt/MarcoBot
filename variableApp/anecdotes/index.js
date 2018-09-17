const anecdoteParis = require('./anecdoteParis');
const anecdoteLondon = require('./anecdoteLondon');
const anecdoteBarcelona = require('./anedocteBarcelona');

const index = (city, locale) => {
  switch (city) {
    case 'paris':
      return anecdoteParis(locale);
    case 'london':
      return anecdoteLondon(locale);
    case 'barcelona':
      return anecdoteBarcelona(locale);
    default:
      break;
  }
};

module.exports = index;