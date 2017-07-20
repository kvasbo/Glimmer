import {Image} from "react-native";

export default class ImageGetter {

    imageData = {};

    constructor() {

        this.database = firebaseApp.database;

        this.ref = firebaseApp.database().ref('imagemeta');
        this.ref.on('value', this.handlePostUpdate);

    }

    handlePostUpdate = (snapshot) => {
        this.imageData = snapshot.val();
    }

    getImage(id, size = "large") {

        return new Promise((resolve, reject) => {

            if (typeof this.imageData[id] !== "undefined" && typeof this.imageData[id][size] !== "undefined") {
                resolve({type: "cache", data: this.imageData[id][size]});
            }
            else {
                
                let uri = "/images/redirect/" + id + "?size=" + size;

                api.makeApiGetCall(uri).then((data) => {

                    this.getAndStoreImageData(data, id, size).then((data) => {
                        resolve({type: "api", data: data});
                    }).catch((err) => {
                        reject(err);
                    });

                })
            }

        });
    }

    getAndStoreImageData(uri, id, size) {

        return new Promise((resolve, reject) => {

            Image.getSize(uri, (width, height) => {

                let data = {id: id, uri: uri, size: size, width: width, height: height, time: new Date().getTime()};

                this.database()
                .ref('imagemeta/' + id + "/" + size)
                .set(data);

                //console.log("Getsize", width, height, id, size);

                resolve(data);

            }, (err) => {
                reject(err);
            });

        })

    }

}