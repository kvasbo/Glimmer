export default class Message {

    constructor(id, body, sent_at, dismissed_at, from_id, from_name, from_image, to_id, to_name, to_image) {

        this.id = id;
        this.body = body;
        this.sent_at = sent_at;
        this.dismissed_at = dismissed_at;
        this.from_id = from_id;
        this.from_name = from_name;
        this.from_image = from_image;
        this.to_id = to_id;
        this.to_name = to_name;
        this.to_image = to_image;

    }

}