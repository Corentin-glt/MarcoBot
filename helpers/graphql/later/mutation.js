/**
 * Created by corentin on 16/05/2018.
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
  createLater: () => {
    return `mutation createLater($activities_id: ID, $bars_id: ID, $clubs_id: ID, $events_id: ID, $exhibitions_id: ID, $museums_id: ID, $parcs_id: ID, $restaurants_id: ID, $shops_id: ID, $shows_id: ID, $sites_id: ID, $users_id:ID!, $eventName: String){
        createLater(activities_id: $activities_id, bars_id: $bars_id, clubs_id: $clubs_id, events_id: $events_id, exhibitions_id: $exhibitions_id, museums_id: $museums_id, parcs_id: $parcs_id, restaurants_id: $restaurants_id, shops_id: $shops_id, shows_id: $shows_id, sites_id: $sites_id, users_id: $users_id, eventName: $eventName) {
          id
            id
        activities_id{ ${Activity} }
        bars_id{ ${Bar} }
        clubs_id{ ${Club} }
        events_id{ ${Event} }
        exhibitions_id{ ${Exhibition} }
        museums_id{ ${Museum} }
        parcs_id{ ${Parc} }
        restaurants_id{ ${Restaurant} }
        shops_id{ ${Shop} }
        shows_id{ ${Show} }
        sites_id{ ${Site} }
          users_id
          lastClick         
          users_id
        }
      }
    `
  }
};