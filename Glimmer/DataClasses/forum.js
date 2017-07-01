export default class Forum {

    constructor(id, title, body) {
        this.title = title;
        this.id = id;
        this.changed = new Date().toISOString();
        this.body = body;
    }

}