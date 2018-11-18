/**
 * Created by corentin on 20/08/2018.
 */
module.exports = {
  itinerary: `
    id
    programs_id
    photo
    day
    order
    description
    descriptionFr
    locations
    admins_id
  `,
  getItineraries: (idProgram, day) => {
    return `{
      getItineraries(programs_id: "${idProgram}", day: ${day}){
        id
        programs_id
        photo
        day
        order
        description
        descriptionFr
        admins_id
        locations {
          name
          lat
          lng
          city
        }
      }    
    }`
  }
};