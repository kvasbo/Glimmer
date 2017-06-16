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
import { StackNavigator } from 'react-navigation';
import Stream from "./Components/Stream";
import Thread from "./Components/Thread";

global.moment = require('moment');

import 'moment/locale/nb';
moment.locale('nb')

import GlimmerAuth from "./src/auth.js";

const config = require("./config.js");

global.auth = new GlimmerAuth();

export default class HomeScreen extends Component {

    constructor(props)
    {
        super(props);

        this.state = {userName: null, loggedIn: false}

    }

    static navigationOptions = {
        title: 'Glimmer',
    };

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

    render() {

        return (
            <View style={styles.container}>
                <Text onPress={() => this.props.navigation.navigate('Stream')} style={styles.welcome}>Strøm</Text>
            </View>
        )
    }
}

const Glimmer = StackNavigator({
    Home: { screen: HomeScreen },
    Stream: {screen: Stream},
    Thread: {screen: Thread }
});

const styles = StyleSheet.create({
    container: {

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        top: 0,
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