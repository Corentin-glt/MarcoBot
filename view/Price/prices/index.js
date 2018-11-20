const eatPrices = require("./eat");
const drinkPrices = require("./drink");

module.exports = venueOfPrice => {
  switch (venueOfPrice) {
    case "eat":
      return eatPrices;
    case "drink":
      return drinkPrices;
    default:
      break;
  }
};
