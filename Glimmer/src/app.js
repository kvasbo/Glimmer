import React from "react";
import {Provider} from "react-redux";
import { composeWithDevTools } from 'remote-redux-devtools';
import {Alert, AppState} from "react-native";
import {AsyncStorage} from 'react-native';
import {registerScreens} from "./screens";
import {Navigation} from "react-native-navigation";
import Workers from "./Workers/index.js";
import {applyMiddleware, compose, createStore} from "redux";
import {createLogger} from "redux-logger";
import glimmerReducers from "./Redux/index";
import RNFirebase from "react-native-firebase";
import {setJSExceptionHandler} from "react-native-exception-handler";
import "moment/locale/nb";
import GlimmerAuth from "./auth.js";
import GlimmerAPI from "./api";
import Helpers from "./helpers";
import NavStyles from "./Styles/NavigatorStyles";
import {iconsLoaded, iconsMap} from "./Components/UXElements/Icons";
import SafariView from 'react-native-safari-view';

console.log("SafariView", SafariView)

global.moment = require('moment');
moment.locale('nb')

const config = require("../config.js");
global.config = config;

//Some hacks
//console.disableYellowBox = true;
console.ignoredYellowBox = ['[xmldom', 'Received data was not a string, or was not a recognised encoding.'];

const errorHandler = (e, isFatal) => {
    if (isFatal) {
        Alert.alert('Trist og uproft', `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
        `, [{
            text: 'OK', onPress: () => {

            }
        }]);
    } else {
        console.log(e); // So that we can see it in the ADB logs in case of Android if needed
    }
};

setJSExceptionHandler(errorHandler, true);

const firebaseApp = RNFirebase.app();

global.firebaseApp = firebaseApp;

global.auth = new GlimmerAuth();
global.api = new GlimmerAPI();
global.helpers = new Helpers();
global.arbeidsMaur = new Workers();
global.SafariView = SafariView;

firebaseApp.auth().onAuthStateChanged(function (user) {
    if (user) {
        //console.log("Firebase signed in", user)
    } else {
        // User is signed out.
        //console.log("Firebase signed out", user)
    }
});

//Create the Redux Store. Saving disabled for now
const loggerMiddleware = createLogger();

// Create redux store, with logging only for dev env
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(glimmerReducers, undefined, composeEnhancers(applyMiddleware()));

global.store = store;

//Make root navigation callable from anywhere. Should be cleaned up and done via store!
global.rootNavigation = Navigation;

//Reload stuff on wake.
const _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
        console.log('App has come to the foreground!');
        arbeidsMaur.refreshForumData();
    }
}

class Glimmer extends React.Component {

    constructor(props) {
        super(props);
        this.init();
        this.store = global.store;

    }

    //To keep track of changes in state, should be done with react
    loggedIn = null;

    attachStoreListener() {

        //Listen to state changes. This really needs to change at some later point.
        store.subscribe(() => {

                //Login state has changed, switch context (and start app, if first time)
                if (store.getState().AppStatus.loggedIn !== this.loggedIn) {
                    this.loggedIn = store.getState().AppStatus.loggedIn;
                    this.startAppBasedOnLoginStatus();
                }

            }
        )

    }

    init() {

        //function to attach listener to app state change
        AppState.addEventListener('change', _handleAppStateChange);

        this.attachStoreListener();

        registerScreens(store, Provider);

        this.startAppBasedOnLoginStatus();

        firebaseApp.auth().signInAnonymously();

        //This function will set the loggedin state to true or false in the store, which in term will trigger the store subscription.
        //Then the app starts. I know.
        auth.checkAuth().then(() => {
            //Logged in, app will start
        }).catch((err) => {
            //Not logged in
        });
    }

    startAppBasedOnLoginStatus() {
        if (this.loggedIn === true) {

            global.arbeidsMaur.initData();
            // global.arbeidsMaur.forumListUpdater.reloadForums(true);

            iconsLoaded.then(() => {
                this.startMainApp();
            })

        }
        else if (this.loggedIn === false) {
            this.startLoginApp();
        }
        else {
            this.showSplashScreen();
        }
    }

    showSplashScreen() {

        Navigation.startSingleScreenApp({
            screen: {
                screen: 'glimmer.PageSplashScreen', // unique ID registered with Navigation.registerScreen
                navigatorStyle: {navBarHidden: true}
            },
            animationType: 'none', // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
        })

    }

    startLoginApp() {

        Navigation.startSingleScreenApp({
            screen: {
                screen: 'glimmer.PageLogin', // unique ID registered with Navigation.registerScreen
                title: 'Velkommen til Glimmer', // title of the screen as appears in the nav bar (optional)
                navigatorStyle: {navBarHidden: true}
            },
            passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
            animationType: 'none', // optional, add transition animation to root change: 'none', 'slide-down', 'fade'

        });

    }

    startMainApp() {

        //Start the actual app
        Navigation.startTabBasedApp({
            animationType: 'none', // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
            passProps: {store: global.store}, //Pass the redux store.
            tabs: [{
                label: 'Mine tråder',
                screen: 'glimmer.PageFavorites', // this is a registered name for a screen
                icon: iconsMap['ios-star'],//icon: require('./icons/star.png'), //selectedIcon: require('./icons/ionicons/alert.png'), // iOS only
                title: 'Mine tråder',
                navigatorStyle: NavStyles.default,
            }, {
                label: 'Forsiden',
                screen: 'glimmer.PageStream',
                icon: iconsMap['ios-paper'], //selectedIcon: require('./icons/ionicons/alert.png'), // iOS only
                title: 'Forsiden',
                navigatorStyle: NavStyles.default,
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
                    icon: iconsMap['ios-chatbubbles'], //require('./icons/chat.png'), //selectedIcon: require('./icons/ionicons/alert.png'), // iOS only
                    title: 'Samtaler',
                    navigatorStyle: NavStyles.default,
                }, {
                    label: 'Røkla',
                    screen: 'glimmer.PageAnnet',
                    icon: iconsMap['ios-settings'], //require('./icons/chat.png'), //selectedIcon: require('./icons/ionicons/alert.png'), // iOS only
                    title: 'Røkla',
                    navigatorStyle: NavStyles.default,
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
                tabBarSelectedButtonColor: '#3499DB',
                initialTabIndex: 1,
            },

        });

    }

}

function mapStateToProps(state) {
    return {
        appState: state.AppState
    }
}

export default Glimmer
