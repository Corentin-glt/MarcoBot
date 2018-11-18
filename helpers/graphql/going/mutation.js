/**
 * Created by corentin on 16/05/2018.
 */
module.exports = {
  createGoing: () => {
    return `mutation createGoing($activities_id: ID, $bars_id: ID, $clubs_id: ID, $events_id: ID, $exhibitions_id: ID, $museums_id: ID, $parcs_id: ID, $restaurants_id: ID, $shops_id: ID, $shows_id: ID, $sites_id: ID, $users_id:ID!, $eventName: String){
        createGoing(activities_id: $activities_id, bars_id: $bars_id, clubs_id: $clubs_id, events_id: $events_id, exhibitions_id: $exhibitions_id, museums_id: $museums_id, parcs_id: $parcs_id, restaurants_id: $restaurants_id, shops_id: $shops_id, shows_id: $shows_id, sites_id: $sites_id, users_id: $users_id, eventName: $eventName) {
          id
          activities_id
          bars_id
          clubs_id
          events_id
          exhibitions_id
          museums_id
          parcs_id
          restaurants_id
          shops_id
          shows_id
          sites_id
          users_id
          lastClick
          dateClick
        }
      }
    `
  }
};
