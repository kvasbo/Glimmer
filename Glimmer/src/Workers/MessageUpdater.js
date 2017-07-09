const Conversation = require("../DataClasses/conversation").default;
const Message = require("../DataClasses/message").default;
import {addConversationBatch,addMessageBatch} from "../Redux/actions";

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

    getMessagesWithUser(userId, page = 1) {

        return new Promise((resolve, reject) => {

            const uri = "/messages/with/" + userId + "?page="+page;

            api.makeApiGetCall(uri).then((result) => {

                var messages = [];

                for(let i = 0; i<result.data.length; i++)
                {
                    //id, body, sent_at, dismissed_at, from_id, from_name, from_image, to_id, to_name, to_image
                    let m = result.data[i];
                    let n = new Message(m.id, m.body, m.sent_at, m.dismissed_at, m.from.id, m.from.name, m.from.image_url, m.to.id, m.to.name, m.to.image_url);
                    messages.push(n);
                }

                store.dispatch(addMessageBatch(userId, messages));

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

        return new Promise((resolve,reject) => {

            this.getMessageThreads(page).then((data) => {

                    var tmp = [];

                    for(key in data)
                    {
                        //console.log(data[key]);
                        var c = data[key];
                        let convo = new Conversation(c.user.name, c.user.id, c.message_count, c.unread_count, c.user.image_url, c.last_message.from.id, c.last_message.sent_at, c.last_message.body);

                        tmp.push(convo);

                        //store.dispatch(addConversation((convo)));

                    }

                    store.dispatch(addConversationBatch(tmp));

                    resolve();

                }
            ).catch((err)=>reject(err));

        });

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