module.exports = (name, value) => {
   return {
     'isOk': {
       name: name,
       value: JSON.parse(value)
     }
   }
};