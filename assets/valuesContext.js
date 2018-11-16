const valuesEat = require('./values/eat')
const valuesDrink = require('./values/drink')
const valuesAroundMe = require('./values/aroundMe')
const valuesBack = require('./values/back')
const valuesChangeCity = require('./values/changeCity')
const valuesFavorite = require('./values/favorite')
const valuesFeedback = require('./values/feedback')
const valuesGo = require('./values/go')
const valuesHelp = require('./values/help')
const valuesItinerary = require('./values/itinerary')
const valuesMenu = require('./values/menu')
const valuesShare = require('./values/share')
const valuesStart = require('./values/start')
const valuesSubscribe = require('./values/subscribe')
const valuesTalkingToHuman = require('./values/talkingToHuman')
const valuesTicket = require('./values/ticket')
const valuesTrip = require('./values/trip')
const valuesVisit = require('./values/visit')
const valuesNext = require('./values/next')
const valuesMap = require('./values/map')

const values = {
  'eat': valuesEat,
  'drink': valuesDrink,
  'aroundMe': valuesAroundMe,
  'back': valuesBack,
  'changeCity': valuesChangeCity,
  'favorite': valuesFavorite,
  'feedback': valuesFeedback,
  'go': valuesGo,
  'help': valuesHelp,
  'itinerary': valuesItinerary,
  'menu': valuesMenu,
  'share': valuesShare,
  'start': valuesStart,
  'subscribe': valuesSubscribe,
  'talkingToHuman': valuesTalkingToHuman,
  'ticket': valuesTicket,
  'trip': valuesTrip,
  'visit': valuesVisit,
  'next': valuesNext,
  'map': valuesMap,
};

module.exports = (context) => {
  return values[context];
}
