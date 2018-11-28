const moment = require('moment');
moment().format();

module.exports = (amount, unit, locale) => {
  const timeUnit = locale === 'fr' ? {'jour' : 'd', 'mois': 'M', 'semaine': 'w', 'an': 'y'}: {'day': 'd', 'mo': 'M', 'week': 'w', 'year': 'y'};
  return moment.duration(amount, timeUnit[unit]).asSeconds();
};