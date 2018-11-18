/**
 * Created by corentin on 13/05/2018.
 */
module.exports = {
  exhibition: `
      id
      name
      types
      tips
      tags
      description
      priceRange
      photos
      dateStart
      dateEnd
      museums_id
  `,
  queryExhibitions: (page) => {
    return `{
      exhibitions(page: ${page}) {
          id
          name
          types
          tags
          description
          tips
          priceRange
          photos
          dateStart
          dateEnd
          museums_id
        }
    }`
  },
  queryExhibition: (id) => {
    return `{
      exhibition(id: "${id}") {
          id
          name
          types
          tags
          description
          tips
          priceRange
          photos
          dateStart
          dateEnd
          museums_id
        }
    }`
  }
};
