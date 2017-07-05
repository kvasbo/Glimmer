const Conversation = require("../DataClasses/conversation").default;
import {addConversation} from "../Redux/actions";

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

    //user, userId, count, unread, user_image, last_message_time, last_message_from
    updateMessageThreads(page) {
        this.getMessageThreads(page).then((data) => {

                for(key in data)
                {
                    //console.log(data[key]);
                    var c = data[key];
                    let convo = new Conversation(c.user.name, c.user.id, c.message_count, c.unread_count, c.user.image_url, c.last_message.from.id, c.last_message.sent_at, c.last_message.body);

                    store.dispatch(addConversation((convo)));

                }


            }
        )
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