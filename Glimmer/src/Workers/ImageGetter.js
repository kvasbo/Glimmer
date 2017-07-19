export default class ImageGetter {

    /**
     * Get info on a user, either username or id
     * @param user
     * @returns {Promise}
     */
    getImage(id, size = "large") {

        return new Promise((resolve, reject) => {
            let uri = "/images/redirect/" + id + "?size=large";

            api.makeApiGetCall(uri).then((data) => {
                resolve(data);
            })

        });
    }

}