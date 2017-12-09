export default class Forum {
  constructor(id, title, body, updateId = null) {
    this.title = title;
    this.id = id;
    this.updated = new Date().toISOString();
    this.body = body;
    this.updateId = updateId;
  }
}
