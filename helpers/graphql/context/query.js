module.exports = {
  getUserContext(id) {
    return `{
      contextsByUser(PSID: "${id}"){
        id
        name
        page
        users_id
        values {
          name
          value
        }
        modifiedAt
        createAt
      }
    }`
  },
  getUserContextByPage(id, page) {
    return `{
      contextsByUserAndPage(PSID: "${id}", page: ${page}){
        id
        name
        page
        users_id
        values {
          name
          value
        }
        modifiedAt
        createAt
      }
    }`
  }
};