import { AsyncStorage } from 'react-native';
import { updateSettings } from '../Redux/actions';

export default class Settings {
  constructor() {
    this.init();
    this.settings = {};
    // console.log('init settings', this.settings);
  }

  init = async () => {
    const settingsFromStore = await AsyncStorage.getItem('settings');
    if (settingsFromStore !== null) {
      const parsedFromStore = JSON.parse(settingsFromStore);
      // Merge default and stored settings.
      this.settings = Object.assign(getInitSettings(), parsedFromStore);
    } else {
      this.settings = getInitSettings();
    }
    this.saveSettings(); // Save and by that also dispatch
  };

  async saveSettings() {
    console.log('Lagrer settings', this.settings);
    AsyncStorage.setItem('settings', JSON.stringify(this.settings));
    store.dispatch(updateSettings(this.settings));
  }

  getSettings() {
    return this.settings;
  }

  setFrontPageFavorites(value) {
    this.settings.frontPageFavorites = value;
    this.saveSettings();
  }

  setFrontPageCalendar(value) {
    this.settings.frontPageCalendar = value;
    this.saveSettings();
  }

  setFrontPageCalendarCity(value) {
    this.settings.frontPageCalendarCity = value;
    this.saveSettings();
  }

  setFrontPageNewPosts(value) {
    this.settings.frontPageNewPosts = value;
    this.saveSettings();
  }

  setFrontPageMessages(value) {
    this.settings.frontPageMessages = value;
    this.saveSettings();
  }

  setFrontPageKudos(value) {
    this.settings.frontPageKudos = value;
    this.saveSettings();
  }

  setNotifyMessages(value) {
    this.settings.notifyMessages = value;
    this.saveSettings();
  }

  setNotifyMessagesIgnoreRabbit(value) {
    this.settings.notifyMessagesIgnoreRabbit = value;
    this.saveSettings();
  }
}

function getInitSettings() {
  return ({
    frontPageFavorites: 5,
    frontPageCalendar: true,
    frontPageCalendarCity: undefined,
    frontPageNewPosts: 5,
    frontPageKudos: true,
    frontPageMessages: true,
    notifyMessages: false,
    notifyMessagesIgnoreRabbit: true,
    notifyUnread: false,
  });
}
