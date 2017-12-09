import { Platform } from 'react-native';

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

    out.keyboardAvoidingOffset = (platform === 'ios') ? 64 : -150;

    return out;
  }
}
