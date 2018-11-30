/**
 * Created by corentin on 17/05/2018.
 */
module.exports = {
  queryGoing: (id) => {
    return `{
      going(id: "${id}") {
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
    }`
  },
  queryGoings: (userID, limit) => {
    return `{
      goings(users_id: "${userID}", limit: ${limit}) {
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
    }`
  },
};