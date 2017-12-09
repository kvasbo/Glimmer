export default class Conversation {
  constructor(user, user_id, count, unread, user_image, last_message_from, last_message_time, last_message_body) {
    this.count = count;
    this.unread = unread;
    this.user = user;
    this.user_id = user_id,
    this.user_image = user_image;
    this.last_message_time = last_message_time;
    this.last_message_from = last_message_from;
    this.last_message_body = last_message_body;
  }
}
