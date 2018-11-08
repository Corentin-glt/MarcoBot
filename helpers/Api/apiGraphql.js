/**
 * Created by corentin on 02/05/2018.
 */
const { GraphQLClient } = require('graphql-request');

class GraphQlClient {
  constructor(url, token) {
    this.client = new GraphQLClient(url, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  }

  sendQuery(query) {
    return this.client.request(query)
  }

  sendMutation(query, variables) {
    return this.client.request(query,
      variables)
  }
};

module.exports = GraphQlClient;