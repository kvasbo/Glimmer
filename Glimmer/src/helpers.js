import { Platform } from 'react-native';

const DomParser = require('xmldom').DOMParser;

export default class Helpers {
  arrayUnique(array) {
    const a = array.concat();
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) { a.splice(j--, 1); }
      }
    }
    return a;
  }

  getCalendarTime(time) {
    const m = new moment(time);
    if (new moment().diff(m, 'hours') < 7) {
      return m.fromNow();
    }
    return m.calendar();
  }

  log() {

  }

  getPersonById(id) {
    const tmp = global.store.getState().Krets;
    return tmp.filter(item => id == item.person.id);
  }

  getPlatformDependentVars() {
    const platform = Platform.OS;
    const out = {};
    out.platform = platform;
    out.keyboardAvoidingOffset = (platform === 'ios') ? 80 : -150;
    return out;
  }
}

export function getImagesFromForumPost(body) {
  const imgOut = [];
  try {
    const doc = new DomParser().parseFromString(body, 'text/html');
    const images = doc.getElementsByTagName('img');

    for (let i = 0; i <= 1; i++) {
      if (typeof (images[i]) !== 'undefined') {
        for (const attr in images[i].attributes) {
          if (images[i].attributes[attr].name === 'src') {
            const uri = `https:${images[i].attributes[attr].value}`;
            const image = {
              src: uri, id: null, width: null, height: null,
            };
            imgOut.push(image);
          }
        }
      } else {
        break;
      }
    }
  } catch (err) {
    console.log(err);
  }
  return imgOut;
}
