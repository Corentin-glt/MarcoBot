module.exports = {
  //PSID, locale, timezone
  createContext: () => {
    return `mutation createContext($PSID: ID!, $name: String, $page: Int, $values: [ValueInput]) {
        createContext(PSID: $PSID, name: $name, page: $page, values: $values) {
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
      }
    `
  },
  updateContext: () => {
    return `mutation updateContext($contextId: ID!, $values: [ValueInput], $modifiedAt: String){
        updateContext(contextId: $contextId, values: $values, modifiedAt: $modifiedAt) {
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
      }
    `
  }
};