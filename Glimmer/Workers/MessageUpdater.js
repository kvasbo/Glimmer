export default class MessageUpdater {

    setMessageAsRead(messageId) {

        return new Promise((resolve, reject) => {

            const uri = "/messages/" + messageId + "/dismiss";

            api.makeApiPostCall(uri).then((data) => {
                resolve();
            }).catch((err) => {
                reject(err);
            })

        })

    }

    getMessagesWithUser(userId) {

        const uri = "/messages/with/" + userId;

        return new Promise((resolve, reject) => {
            api.makeApiGetCall(uri).then((result) => {
                resolve(result.data);
            }).catch((err) => reject(err));
        })

    }

    getMessageThreads(page = 1) {

        return new Promise((resolve, reject) => {

            const uri = "/messages/conversations?page=" + page;

            api.makeApiGetCall(uri).then((data) => {

                resolve(data.data);

            }).catch((err) => reject(err));

        })

    }

    sendMessageToUser(userId, message) {
        return new Promise((resolve, reject) => {

            const uri = "/messages";

            api.makeApiPostCall(uri, {user_id: userId, body: message}).then((data) => {
                resolve(data.data);
            }).catch((err) => reject(err));

        })
    }

}