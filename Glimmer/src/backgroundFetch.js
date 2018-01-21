import BackgroundFetch from 'react-native-background-fetch';
import { PushNotificationIOS, AsyncStorage } from 'react-native';
import { sumBy } from 'lodash';

export default class GlimmerBackgroundFetch {
  constructor(api, auth, arbeidsMaur) {
    this.api = api;
    this.auth = auth;
    this.arbeidsMaur = arbeidsMaur;
    this.init();
  }

  init = () => {

    // Optional: Query the authorization status.
    BackgroundFetch.status((status) => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log("BackgroundFetch is enabled");
          break;
        default:
          break;
      }
    });

    BackgroundFetch.configure({
      stopOnTerminate: false,
    }, () => {
      console.log('[js] Received background-fetch event');

      //PushNotificationIOS.scheduleLocalNotification({ fireDate: Date.now() + (15 * 1000), alertBody: 'test' });

      this.doBackgroundFetchStuff().then((data) => {
     // To signal completion of your task to iOS, you must call #finish!
      // If you fail to do this, iOS can kill your app.
        BackgroundFetch.finish();
      });
      

    }, (error) => {
      console.log('[js] RNBackgroundFetch failed to start');
    });

  }

  doBackgroundFetchStuff = async () => {
    const loggedIn = await this.auth.checkAuth();
    const settings = this.arbeidsMaur.settings.getSettings();
    // console.log('bgSettings', settings);
    if (!loggedIn) return false;

    // Look for new messages
    if (settings.notifyMessages) {
      let data = await this.arbeidsMaur.messageUpdater.getMessageThreads(1);
      if (settings.notifyMessagesIgnoreRabbit) {
        data = data.filter(p => p.user.id !== 0);
      }
      const unread = sumBy(data, 'unread_count');
      PushNotificationIOS.setApplicationIconBadgeNumber(unread);
      // console.log('msg data', data, unread);
    }
    

    return true;
  }

}
