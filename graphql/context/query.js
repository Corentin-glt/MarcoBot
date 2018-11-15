module.exports = {
  getUserContext(id) {
    return `{
      contextsByUser(PSID: "${id}"){
        id
        name
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