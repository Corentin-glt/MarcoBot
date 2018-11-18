module.exports = {
  delayPromise(duration) {
    return (...args) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(...args);
        }, duration)
      });
    };
  },
  isNumber(number) {
    return !isNaN(parseFloat(number)) && isFinite(number);
  },
  isUrl(url) {
    const pattern = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,63}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    return pattern.test(url);
  }
};