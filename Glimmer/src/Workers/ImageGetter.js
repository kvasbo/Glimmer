import { Image } from 'react-native';
import axios from 'axios';
import { REGEX_VALID_URL } from '../constants';

export default class ImageGetter {
    imageData = {};

    constructor() {
      this.database = firebase.database;

      this.ref = firebase.database().ref('imagemeta');
      this.ref.on('value', this.handlePostUpdate);
    }

    handlePostUpdate = (snapshot) => {
      this.imageData = snapshot.val();
    }

    getImage(id, size = 'large') {
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'glimmer',
        Authorization: `Bearer ${store.getState().AppStatus.token}`,
      };

      return new Promise((resolve, reject) => {
        if (typeof this.imageData[id] !== 'undefined' && typeof this.imageData[id][size] !== 'undefined') {
          resolve({ type: 'cache', data: this.imageData[id][size] });
        } else {
          const uri = `${config.base_url}/images/redirect/${id}?size=${size}`;

          axios.get(uri, { headers })
            .then((response) => {
              const uri = response.request.responseURL;

              this.getAndStoreImageData(uri, id, size).then((data) => {
                resolve({ type: 'api', data });
              }).catch((err) => {
                reject(err);
              });
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    }

    getAndStoreImageData(uri, id, size) {
      return new Promise((resolve, reject) => {
        if (!REGEX_VALID_URL.test(uri)) {
          reject('Invalid url');
        } else {
          try {
            Image.getSize(uri, (width, height) => {
              const data = {
                id, uri, size, width, height, time: new Date().getTime(),
              };

              this.database()
                .ref(`imagemeta/${id}/${size}`)
                .set(data);

              // console.log("Getsize", width, height, id, size);

              resolve(data);
            }, (err) => {
              reject(err);
            });
          } catch (err) {
            console.log(err);
            reject(err);
          }
        }
      });
    }
}
