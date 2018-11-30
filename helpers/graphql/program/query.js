/**
 * Created by corentin on 20/08/2018.
 */
module.exports = {
  program: `
    id
    city
    type
    url_articles
    admins_id
  `,
  getOneProgram: (city, type) => {
    return `{
      getOneProgram(city: "${city}", type: ${type}){
        id
        city
        type
        url_articles
        admins_id
      }    
    }`
  },
  getProgramById: (id) => {
    return `{
      getProgramById(id: "${id}"){
        id
        city
        type
        url_articles
        admins_id
      }    
    }`
  }
};