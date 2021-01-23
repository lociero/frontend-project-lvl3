export default class TypeError extends Error {
  constructor(type, message) {
    super();
    this.type = type;
    this.message = message;
  }
}
