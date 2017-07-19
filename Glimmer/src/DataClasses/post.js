export default class ForumPost {

    constructor(id, title, body, comment_count, created_at, follower_count, following, kudos, tags, updated_at, view_count, creator_name, creator_id, creator_image, forum_id, forum_name, body_textile = null, unread_comment_count = null) {

        this.id = id;
        this.title = title;
        this.body = body;
        this.body_textile = body_textile;
        this.comment_count = comment_count;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.following = following;
        this.kudos = kudos;
        this.tags = tags;
        this.follower_count = follower_count;
        this.view_count = view_count;
        this.creator_name = creator_name;
        this.creator_id = creator_id;
        this.creator_image = creator_image;
        this.forum_id = forum_id;
        this.forum_title = forum_name;
        this.unread_comment_count = unread_comment_count;

    }

}