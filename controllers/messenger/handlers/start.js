module.exports = (payload) => {
  switch (payload) {
    case 'TRUE':
      return {
        name: 'start',
        value: true
      };
    case 'FALSE':
      return {
        name: 'start',
        value: false
      };
    default:
      return null;
  }
};