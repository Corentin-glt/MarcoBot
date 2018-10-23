/**
 * Created by corentin on 22/10/2018.
 */
const Bar = require("../bar/query").bar;
const Museum = require("../museum/query").museum;
const Parc = require("../parc/query").parc;
const Restaurant = require("../restaurant/query").restaurant;
const Site = require("../site/query").site;

module.exports = {
  affiliations: (page, city) => {
    return ` {
      affiliations(page: ${page}, city: "${city}") {
        id
        name
        price
        url
        bars_id{ ${Bar} }
        museums_id{ ${Museum} }
        parcs_id{ ${Parc} }
        restaurants_id{ ${Restaurant} }
        sites_id{ ${Site} }
      }
    }`
  },
  affiliation: (idAffiliation) => {
    return ` {
      affiliation(id: "${idAffiliation}") {
        id
        name
        price
        url
        bars_id{ ${Bar} }
        museums_id{ ${Museum} }
        parcs_id{ ${Parc} }
        restaurants_id{ ${Restaurant} }
        sites_id{ ${Site} }
      }
    }`
  }
};