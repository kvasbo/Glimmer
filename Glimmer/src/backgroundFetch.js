import BackgroundFetch from 'react-native-background-fetch';

export default class GlimmerBackgroundFetch {
  constructor(api, auth) {
    this.api = api;
    this.auth = auth;
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

      // To signal completion of your task to iOS, you must call #finish!
      // If you fail to do this, iOS can kill your app.
      BackgroundFetch.finish();
    }, (error) => {
      console.log('[js] RNBackgroundFetch failed to start');
    });

  }

}
