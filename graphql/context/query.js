module.exports = {
  getUserContext(id) {
    return `{
      contextsByUser(usersId: "${id}"){
        id
        name
        users_id
        values {
          name
          value
        }
        createAt
      }
    }`
  }
};