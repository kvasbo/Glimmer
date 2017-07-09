export default class ForumPostComment {

    constructor(id, postId, body, created_at, kudos, updated_at, creator_name, creator_id, creator_image) {

        this.postId = postId;
        this.id = id;
        this.body = body;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.kudos = kudos;
        this.creator_name = creator_name;
        this.creator_id = creator_id;
        this.creator_image = creator_image;

    }

}