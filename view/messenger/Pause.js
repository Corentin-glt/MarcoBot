class Pause {
  constructor(milliseconds) {
    this.template = {
      messagePause: milliseconds || 500
    };
  }

  get() {
    return this.template;
  }
}

module.exports = Pause;