/**
 * Created by corentin on 23/08/2018.
 */

const hoursCron = {
  "morning": "00 30 08 * * *", //Une fois par jour à 08h30:00
  "endAfterNoon": "00 30 15 * * *",//Une fois par jour à 18h30:00
  "everyHour": "03 01 * * * *",// Toutes les heures
  "noon": "14 33 12 * * *" // 12:33 tous les jours
};

module.exports = hoursCron;
