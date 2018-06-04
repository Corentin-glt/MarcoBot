/**
 * Created by corentin on 27/04/2018.
 */
module.exports = {
  tokenAppFacebook : 'EAAe0IGvwaycBAOYCyd5HsweEA4RLgNuQQcYHIuEAXlxan0ZCGHbolVFmfk1QpbkYRO3VLEHrkqHbzrxPydb9ZBLrSo6o1RTxjjthcHdffmXNET4KlQOL7MAgiNzUKeC1nPVWz4p2YQ5ER1jIvVuJaHj4iJRxkeUxjR0ZAaPTQZDZD',
  clientTokenDialogflow: "c8ad203d756f4c828380f8e61d261cde",
  projectIDDialogflow: "first-agent-af296",
  verificationMessenger: "xFdu09GhnS8f4n-ghEzsx",
  keyApiGoogle: "AIzaSyCeV-rbeGfSA913Pzk8lRjo5I7pZ6Gu39s",
  // The variable to change: if you want development it's 0,
  // if you want production it's 1
  // if you localhost it's 2
  indexCategory: 2,
  category: [
    // ======= DEVELOPMENT =======
    {
      apiUrl: 'https://apidev.marco-app.com/api',
      apiGraphQlUrl: 'https://apidev.marco-app.com/graphql',
      port: 4002
    },
    // ======= PRODUCTION =======
    {
      apiUrl: 'https://api.marco-app.com/api',
      apiGraphQlUrl: 'https://api.marco-app.com/graphql',
      port: 4004
    },
    // ======= LOCALHOST =======
    {
      apiUrl: 'http://api:3003/api',
      apiGraphQlUrl: 'http://api:3003/graphql',
      apiNgrok: 'http://api:3003/graphql',
      recommendationApilUrl: 'http://recommandation_api:3005/graphql',
      port: 4000
    }
  ]
};