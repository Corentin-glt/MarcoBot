const valuesEat = require('./values/eat')
const valuesDrink = require('./values/drink')
const valuesAroundMe = require('./values/aroundMe')
const valuesBack = require('./values/back')
const valuesChangeCity = require('./values/changeCity')
const valuesFavorite = require('./values/favorite')
const valuesGo = require('./values/go')
const valuesHelp = require('./values/help')
const valuesItinerary = require('./values/itinerary')
const valuesMenu = require('./values/menu')
const valuesShare = require('./values/share')
const valuesStart = require('./values/start')
const valuesSubscribe = require('./values/subscribe')
const valuesTalkingToHuman = require('./values/talkingToHuman')
const valuesTicket = require('./values/ticket')
const valuesVisit = require('./values/visit')

const values = [
  'eat': valuesEat,
  'drink': valuesDrink,
  'aroundMe': valuesAroundMe,
  'back': valuesBack,
  'changeCity': valuesChangeCity,
  'favorite': valuesFavorite,
  'go': valuesGo,
  'help': valuesHelp,
  'itinerary': valuesItinerary,
  'menu': valuesMenu,
  'share': valuesShare,
  'start': valuesStart,
  'subscribe': valuesSubscribe,
  'talkingToHuman': valuesTalkingToHuman,
  'ticket': valuesTicket,
  'visit': valuesVisit,
]

module.exports = (context) => {
  return values[context];
}
