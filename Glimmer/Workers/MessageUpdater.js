
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

    getMessageThreads(page = 1) {

        return new Promise((resolve, reject) => {

            var uri = "/messages/conversations?page="+page;

            api.makeApiGetCall(uri).then((data) => {

                resolve(data.data);

            }).catch((err) => reject(err));

        })



    }

}