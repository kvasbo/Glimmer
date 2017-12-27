import React from 'react';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import { Alert, AppState, AsyncStorage } from 'react-native';
import registerScreens from './screens';
import { Navigation } from 'react-native-navigation';
import Workers from './Workers/index.js';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import glimmerReducers from './Redux/index';
import RNFirebase from 'react-native-firebase';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import 'moment/locale/nb';
import GlimmerAuth from './auth.js';
import GlimmerAPI from './api';
import Helpers from './helpers';
import NavStyles from './Styles/NavigatorStyles';
import { iconsLoaded, iconsMap } from './Components/UXElements/Icons';
import SafariView from 'react-native-safari-view';

global.moment = require('moment');

moment.locale('nb');

console.disableYellowBox = true;

const config = require('../config.js');

global.config = config;

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
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler, true);

const firebase = RNFirebase.app();

global.firebase = firebase;

global.auth = new GlimmerAuth();
global.api = new GlimmerAPI();
global.helpers = new Helpers();
global.arbeidsMaur = new Workers();
global.SafariView = SafariView;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // console.log("Firebase signed in", user)
  } else {
    // User is signed out.
    // console.log("Firebase signed out", user)
  }
});

// Create the Redux Store. Saving disabled for now
const loggerMiddleware = createLogger();

// Create redux store, with logging only for dev env
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(glimmerReducers, undefined, composeEnhancers(applyMiddleware()));

global.store = store;

// Make root navigation callable from anywhere. Should be cleaned up and done via store!
global.rootNavigation = Navigation;

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
        this.startAppBasedOnLoginStatus();
      }).catch((err) => {
        // Not logged in
      });
    }

    startAppBasedOnLoginStatus() {
      console.log('starting app based on status', this.loggedIn);
      if (this.loggedIn === true) {
        global.arbeidsMaur.initData();
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
    animationType: 'fade',
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
    passProps: { store: global.store },
    tabs: [{
      label: 'Kudos',
      screen: 'glimmer.PageKudos',
      icon: iconsMap['ios-ribbon'],
      title: 'Kudos',
      navigatorStyle: NavStyles.default,
    }, {
      label: 'Strøm',
      screen: 'glimmer.PageStream',
      icon: iconsMap['ios-list'],
      title: 'Strøm',
      navigatorStyle: NavStyles.default,
    }, {
      label: 'Forsiden',
      screen: 'glimmer.PageStart',
      icon: iconsMap['ios-home'],
      title: 'Forsiden',
      navigatorStyle: NavStyles.default,
    }, {
      label: 'Mine tråder',
      screen: 'glimmer.PageFavorites',
      icon: iconsMap['ios-star'],
      title: 'Mine tråder',
      navigatorStyle: NavStyles.default,
    }, {
      label: 'Samtaler',
      screen: 'glimmer.PageMessages',
      icon: iconsMap['ios-chatbubbles'],
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