const start = require('./start');


module.exports = (name, value) => {
  return {
    'start': start(name, value)
  }
};