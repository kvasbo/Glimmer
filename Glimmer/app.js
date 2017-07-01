import React from "react";
import {Alert} from "react-native";
import {registerScreens} from "./src/screens";
import {Navigation} from "react-native-navigation";
import Workers from "./Workers/index.js";
import * as firebase from "firebase";
import {applyMiddleware, createStore} from "redux";
import {createLogger} from "redux-logger";
import {Provider} from "react-redux";
import glimmerReducers from "./Redux/index";

import {setJSExceptionHandler} from "react-native-exception-handler";
import RNRestart from "react-native-restart";
import "moment/locale/nb";
import GlimmerAuth from "./src/auth.js";
import GlimmerAPI from "./src/api";
import Helpers from "./src/helpers";

global.moment = require('moment');
moment.locale('nb')

const config = require("./config.js");

//Some hacks
console.ignoredYellowBox = ['[xmldom warning]'];

const errorHandler = (e, isFatal) => {
    if (isFatal) {
        Alert.alert('Pokker.', `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
 
        Vi må starte på nytt.
        `, [{
            text: 'Omstart', onPress: () => {
                RNRestart.Restart();
            }
        }]);
    } else {
        console.log(e); // So that we can see it in the ADB logs in case of Android if needed
    }
};

setJSExceptionHandler(errorHandler, true);

// Initialize Firebase
const firebaseConfig = {
    apiKey: config.firebase_api_key,
    authDomain: "glimmer-28101.firebaseapp.com",
    databaseURL: "https://glimmer-28101.firebaseio.com",
    projectId: "glimmer-28101",
    storageBucket: "glimmer-28101.appspot.com",
    messagingSenderId: "971596888536"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
global.firebaseApp = firebaseApp;

global.auth = new GlimmerAuth();
global.api = new GlimmerAPI();
global.helpers = new Helpers();
global.arbeidsMaur = new Workers();

firebaseApp.auth().onAuthStateChanged(function (user) {
    if (user) {

        console.log("Firebase signed in", user)

    } else {
        // User is signed out.
        console.log("Firebase signed out", user)

    }
});

//Create the Redux Store. Saving disabled for now
const loggerMiddleware = createLogger();

if (__DEV__) {
    global.store = createStore(glimmerReducers, applyMiddleware(
        //thunkMiddleware, // lets us dispatch() functions
        //loggerMiddleware // neat middleware that logs actions
    ));
}
else {
    global.store = createStore(glimmerReducers, applyMiddleware(
        //thunkMiddleware, // lets us dispatch() functions
        //loggerMiddleware // neat middleware that logs actions
    ));
}

//Make root navigation callable from anywhere. Should be cleaned up and done via store!
global.rootNavigation = Navigation;

if (__DEV__) {
    console.log("Store init", global.store.getState());
}

export default class Glimmer {

    constructor() {
        this.init();
    }

    //To keep track of changes in state, should be done with react
    loggedIn = null;

    attachStoreListener() {

        //Listen to state changes. This really needs to change at some later point.
        reduxUnsubscribe = store.subscribe(() => {

                //Login state has changed, switch context (and start app, if first time)
                if (store.getState().AppStatus.loggedIn !== this.loggedIn) {
                    this.loggedIn = store.getState().AppStatus.loggedIn;
                    this.startAppBasedOnLoginStatus();
                }

            }
        )

    }

    init() {

        helpers.log("Init started");

        this.attachStoreListener();

        registerScreens(store, Provider);

        firebaseApp.auth().signInAnonymously();

        //This function will set the loggedin state to true or false in the store, which in term will trigger the store subscription.
        //Then the app starts. I know.
        auth.checkAuth();
    }

    startAppBasedOnLoginStatus() {
        if (this.loggedIn === true) {
            global.arbeidsMaur.initData();
            this.startMainApp();
        }
        else if (this.loggedIn === false) {
            this.startLoginApp();
        }
    }

    startLoginApp() {

        Navigation.startSingleScreenApp({
            screen: {
                screen: 'glimmer.PageLogin', // unique ID registered with Navigation.registerScreen
                title: 'Velkommen til Glimmer', // title of the screen as appears in the nav bar (optional)
                navigatorStyle: {navigatorHidden: true}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
                navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
            },
            passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
            animationType: 'slide-down' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
        });

    }

    startMainApp() {

        //Start the actual app
        Navigation.startTabBasedApp({
            passProps: {store: global.store}, //Pass the redux store.
            tabs: [{
                label: 'Mine tråder', screen: 'glimmer.PageFavorites', // this is a registered name for a screen
                icon: require('./icons/star.png'), //selectedIcon: require('./icons/ionicons/alert.png'), // iOS only
                title: 'Mine tråder'
            }, {
                label: 'Forsiden',
                screen: 'glimmer.PageStream',
                icon: require('./icons/front.png'), //selectedIcon: require('./icons/ionicons/alert.png'), // iOS only
                title: 'Forsiden'
            }, /*{
             label: 'Kalender',
             screen: 'glimmer.PageCalendar',
             icon: require('./icons/calendar.png'),
             //selectedIcon: require('./icons/ionicons/alert.png'), // iOS only
             title: 'Kalender'
             }
             ,*/
                {
                    label: 'Samtaler',
                    screen: 'glimmer.PageMessages',
                    icon: require('./icons/chat.png'), //selectedIcon: require('./icons/ionicons/alert.png'), // iOS only
                    title: 'Samtaler'
                },
                /*{
                    label: 'Mer',
                    screen: 'glimmer.MenuLeft',
                    icon: require('./icons/more.png'), //selectedIcon: require('./icons/ionicons/alert.png'), // iOS only
                    title: 'Andre greier',
                    iconInsets: { // add this to change icon position (optional, iOS only).
                        right: 1, // optional, default is 0.
                        left: -1
                    },
                }*/
            ],
            tabsStyle: { // optional, add this if you want to style the tab bar beyond the defaults
                tabBarSelectedButtonColor: '#3499DB', // optional, change the color of the selected tab icon and text (only selected)
            },

        });

    }

}


