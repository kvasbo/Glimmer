export default class User {

    constructor(id, name, realName, image, friend = false) {

        this.id = id;
        this.updated = new Date();
        this.name = name;
        this.realName = realName;
        this.image = image;
        this.friend = friend;

    }

}