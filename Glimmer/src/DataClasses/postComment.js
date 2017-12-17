export default class ForumPostComment {
  constructor(id, postId, body, created_at, kudos, updated_at, creator_name, creator_id, creator_image, body_textile, page) {
    this.postId = postId;
    this.page = page;
    this.id = id;
    this.body = body;
    this.body_textile = body_textile;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.kudos = kudos;
    this.creator_name = creator_name;
    this.creator_id = creator_id;
    this.creator_image = creator_image;
  }
}
