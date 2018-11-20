

class Eat {
  constructor(event, context, user){
    this.event = event;
    this.context = context;
    this.user = user;
  }

  start(){
    console.log('HELLO WORLD EAT');
  }
}

module.exports = Eat;
