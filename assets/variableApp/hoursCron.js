/**
 * Created by corentin on 23/08/2018.
 */

const hoursCron = {
  "morning": "00 15 08 * * *", //Une fois par jour à 08h30:00
  "endAfterNoon": "32 12 18 * * *",//Une fois par jour à 18h30:00
  "everyHour": "03 23 * * * *",// Toutes les heures
  "noon": "03 23 12 * * *" // 12:33 tous les jours
};

module.exports = hoursCron;
