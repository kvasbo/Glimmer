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
      store.dispatch(updateSettings(this.settings));
    } else {
      this.settings = getInitSettings();
      this.saveSettings();
    }
  };

  saveSettings() {
    console.log('Lagrer settings', this.settings);
    AsyncStorage.setItem('settings', JSON.stringify(this.settings));
    store.dispatch(updateSettings(this.settings));
  }

  getSettings() {
    return this.settings;
  }

  setActivityKudos(value) {
    this.settings.activityShowKudos = value;
    this.saveSettings();
  }

  setFrontPageFavorites(value) {
    this.settings.frontPageFavorites = value;
    this.saveSettings();
  }

  setFrontPageNewPosts(value) {
    this.settings.frontPageNewPosts = value;
    this.saveSettings();
  }
}

function getInitSettings() {
  return ({
    activityShowKudos: false,
    frontPageFavorites: 5,
    frontPageNewPosts: 5,
  });
}
