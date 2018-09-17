/**
 * Created by corentin on 28/05/2018.
 */
const Activity = require("../activity/query").activity;
const Bar = require("../bar/query").bar;
const Club = require("../club/query").club;
const Event = require("../event/query").event;
const Exhibition = require("../exhibition/query").exhibition;
const Museum = require("../museum/query").museum;
const Parc = require("../parc/query").parc;
const Restaurant = require("../restaurant/query").restaurant;
const Shop = require("../shop/query").shop;
const Show = require("../show/query").show;
const Site = require("../site/query").site;

module.exports = {
  findByNearMe: (location, page, city) => {
    return ` {
      findByNearMe(lat: ${location.lat}, lng: ${location.lng}, page: ${page}, city: ${city}) {
        id
        activities_id{ ${Activity} }
        bars_id{ ${Bar} }
        clubs_id{ ${Club} }
        events_id{ ${Event} }
        museums_id{ ${Museum} }
        parcs_id{ ${Parc} }
        restaurants_id{ ${Restaurant} }
        shops_id{ ${Shop} }
        shows_id{ ${Show} }
        sites_id{ ${Site} }
      }
    }`
  },
  findByDistrict: (district, page) => {
    return ` {
      findByDistrict(district: "${district}", page: ${page}) {
        id
        activities_id{ ${Activity} }
        bars_id{ ${Bar} }
        clubs_id{ ${Club} }
        events_id{ ${Event} }
        museums_id{ ${Museum} }
        parcs_id{ ${Parc} }
        restaurants_id{ ${Restaurant} }
        shops_id{ ${Shop} }
        shows_id{ ${Show} }
        sites_id{ ${Site} }
      }
    }`
  }
};