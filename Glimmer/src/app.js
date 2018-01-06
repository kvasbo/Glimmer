import React from 'react';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import { Alert, AppState, AsyncStorage } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { applyMiddleware, compose, createStore } from 'redux';
import SafariView from 'react-native-safari-view';
// import { createLogger } from 'redux-logger';
import RNFirebase from 'react-native-firebase';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import 'moment/locale/nb';
import glimmerReducers from './Redux/index';
import Workers from './Workers/index';
import GlimmerAuth from './auth';
import registerScreens from './screens';
import GlimmerAPI from './api';
import Logger from './logger';
import Helpers from './helpers';
import NavStyles from './Styles/NavigatorStyles';
import { iconsLoaded, iconsMap } from './Components/UXElements/Icons';

const moment = require('moment');

moment.locale('nb');

// console.disableYellowBox = true;

const config = require('../config.js');



// Some hacks
// console.disableYellowBox = true;
console.ignoredYellowBox = ['[xmldom', 'Received data was not a string, or was not a recognised encoding.'];

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    Alert.alert('Trist og uproft', `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
        `, [{
      text: 'OK',
      onPress: () => {
      },
    }]);
  } else {
    // console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler, true);

const firebase = RNFirebase.app();
firebase.analytics().setAnalyticsCollectionEnabled(true);

// Create redux store, with logging only for dev env
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(glimmerReducers, undefined, composeEnhancers(applyMiddleware()));

global.firebase = firebase;
global.auth = new GlimmerAuth();
global.api = new GlimmerAPI();
global.helpers = new Helpers();
global.arbeidsMaur = new Workers();
global.SafariView = SafariView;
global.config = config;
global.logger = new Logger();
global.moment = moment;
global.store = store;
// global.rootNavigation = Navigation;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // console.log("Firebase signed in", user)
  } else {
    // User is signed out.
  }
});

// Reload stuff on wake.
const handleAppStateChange = (nextAppState) => {
  if (nextAppState === 'active') {
    arbeidsMaur.refreshAppData();
  }
};

class Glimmer extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

    // To keep track of changes in state, should be done with react
    loggedIn = null;

    attachStoreListener() {
      // Listen to state changes. This really needs to change at some later point.
      global.store.subscribe(() => {
        // Login state has changed, switch context (and start app, if first time)
        const loggedInNew = global.store.getState().AppStatus.loggedIn;
        if (loggedInNew !== this.loggedIn) {
          this.loggedIn = loggedInNew;
          this.startAppBasedOnLoginStatus();
        }
      });
    }

    init() {
      // function to attach listener to app state change
      AppState.addEventListener('change', handleAppStateChange);
      this.attachStoreListener();
      registerScreens(store, Provider);
      firebase.auth().signInAnonymously();

      // This function will set the loggedin state to true or false in the store, which in term will trigger the store subscription.
      // Then the app starts. I know.
      auth.checkAuth().then(() => {
        // this.startAppBasedOnLoginStatus();
      }).catch((err) => {
        // Not logged in
      });
    }

    async startAppBasedOnLoginStatus() {
      if (this.loggedIn === true) {
        global.arbeidsMaur.initData();
        await global.arbeidsMaur.settings.init();
        // global.arbeidsMaur.forumListUpdater.reloadForums(true);
        iconsLoaded.then(() => {
          setTimeout(() => { startMainApp(); }, 500);
        });
      } else if (this.loggedIn === false) {
        startLoginApp();
      } else {
        showSplashScreen();
      }
    }
}

export default Glimmer;

function showSplashScreen() {
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'glimmer.PageSplashScreen',
      navigatorStyle: { navBarHidden: true },
    },
    animationType: 'none',
  });
}

function startLoginApp() {
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'glimmer.PageLogin',
      title: 'Velkommen til Glimmer',
      navigatorStyle: { navBarHidden: true },
    },
    passProps: {},
    animationType: 'fade',
  });
}

function startMainApp() {
  Navigation.startTabBasedApp({
    animationType: 'fade',
    passProps: {},
    tabs: [{
      label: '',
      screen: 'glimmer.PageKudos',
      icon: iconsMap['ios-ribbon--tab-bar'],
      title: 'Kudos',
      navigatorStyle: NavStyles.default,
    }, {
      label: '',
      screen: 'glimmer.PageStream',
      icon: iconsMap['ios-list--tab-bar'],
      title: 'Strøm',
      navigatorStyle: NavStyles.default,
    }, {
      label: '',
      screen: 'glimmer.PageStart',
      icon: iconsMap['ios-home--tab-bar'],
      title: 'Forsiden',
      navigatorStyle: NavStyles.noScroll,
    }, {
      label: '',
      screen: 'glimmer.PageFavorites',
      icon: iconsMap['ios-star--tab-bar'],
      title: 'Mine tråder',
      navigatorStyle: NavStyles.default,
    }, {
      label: '',
      screen: 'glimmer.PageMessages',
      icon: iconsMap['ios-chatbubbles--tab-bar'],
      title: 'Samtaler',
      navigatorStyle: NavStyles.default,
    },
    ],
    tabsStyle: {
      tabBarSelectedButtonColor: '#3499DB',
      initialTabIndex: 2,
    },
  });
}
