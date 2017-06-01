/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Tabs from './Components/TabsNavigation';
import GlimmerAuth from "./src/auth.js";

const config = require("./config.js");

global.auth = new GlimmerAuth();

export default class Glimmer extends Component {

    constructor(props)
    {
        super(props);

        this.state = {userName: null, loggedIn: false}

    }

    test(data)
    {
        console.log("running", data);
    }

    componentDidMount()
    {
        auth.testAuth((data)=>{this.startApp(data)});
        //auth.underskogOauth(config.app_key, auth.handleAuthResponse);
    }

    startApp(userObject)
    {
        console.log("startApp", userObject);
        if(typeof(userObject.data.name !== "undefined"))
        {
            this.setState({userName: userObject.data.name, loggedIn: true});
        }

    }

    getUserName()
    {
        if(this.state.userName !== null)
        {
            return "Velkommen, " + this.state.userName;
        }
        else
        {
            return null;
        }
    }

    getLoginScreen()
    {
        return(
            <View style={styles.container}>
                <Text style={styles.welcome}>Glimmer</Text>
            </View>
        )
    }

    getMainScreen()
    {
        return(
            <Tabs style={styles.container} />
        )
    }

    render() {

        const isLoggedIn = this.state.loggedIn;

        let screen = null;

        if(!isLoggedIn)
        {
            screen = this.getLoginScreen();
        }
        else
        {
            screen = this.getMainScreen();
        }

        return (
           screen
        )
    }
}

const styles = StyleSheet.create({
    container: {

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        top: 20,
        bottom: 0,
        left: 0,
        right: 0
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

AppRegistry.registerComponent('Glimmer', () => Glimmer);