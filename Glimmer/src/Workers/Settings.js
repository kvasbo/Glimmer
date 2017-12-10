import { AsyncStorage } from 'react-native';

export default class Settings {
  constructor() {
    this.init();
    this.settings = {};
    console.log('init settings', this.settings);
  }

  init = async () => {
    const settingsFromStore = await AsyncStorage.getItem('settings');
    if (settingsFromStore !== null) {
      this.settings = JSON.parse(settingsFromStore);
      console.log('settings hentet', this.settings);
    } else {
      this.settings = getInitSettings();
      this.saveSettings();
    }
  };

  saveSettings() {
    console.log('Lagrer settings', this.settings);
    AsyncStorage.setItem('settings', JSON.stringify(this.settings));
  }

  getSettings() {
    return this.settings;
  }

  setActivityKudos(value) {
    this.settings.activityShowKudos = value;
    this.saveSettings();
  }
}

function getInitSettings() {
  return ({
    activityShowKudos: false,
  });
}