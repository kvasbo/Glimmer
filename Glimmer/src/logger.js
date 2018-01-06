export default class Logger {
  constructor(force) {
    this.active = (__DEV__ || force);
  }

  log(text, type = null) {
    if (this.active) {
      if (type) {
        console.log(type, text);
      } else {
        console.log(text);
      }
    }
  }
}
