export default class Debounced {
  time;
  timeout = null;

  constructor(time = 500) {
    this.time = time;
  }

  run(fn) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(fn, this.time);
  }
}
