export default class ForumEvent {
  constructor(id, title, body, privateEvent, time, canceled, city, venue, comment_count, created_at, follower_count, following, tags, updated_at, creator_name, creator_id, creator_image, body_textile = null, unread_comment_count = null) {
    this.type = 'event';
    this.id = id;
    this.title = title;
    this.body = body;
    this.body_textile = body_textile;
    this.comment_count = comment_count;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.following = following;
    this.tags = tags;
    this.follower_count = follower_count;
    this.creator_name = creator_name;
    this.creator_id = creator_id;
    this.creator_image = creator_image;
    this.unread_comment_count = unread_comment_count;
    this.privateEvent = privateEvent;
    this.venue = venue;
    this.time = time;
    this.canceled = canceled;
    this.city = city;
  }
}
