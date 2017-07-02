
export default class MessageUpdater {

    setMessageAsRead(messageId)
    {

        return new Promise((resolve,reject) => {

            uri = "/messages/"+messageId+"/dismiss";

            api.makeApiPostCall(uri).then((data) =>
            {
                resolve();
            }).catch((err) => {
                reject(err);
            })

        })

    }

}