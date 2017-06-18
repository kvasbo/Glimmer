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
import PageStream from "./Components/PageStream";
import PageThread from "./Components/PageThread";
import PageCalendar from "./Components/PageCalendar";
import PageMessages from "./Components/PageMessages";
import PageSettings from "./Components/PageSettings";

import { Button } from 'react-native-elements'
import { Icon } from 'react-native-elements'

global.moment = require('moment');

import 'moment/locale/nb';
moment.locale('nb')

import GlimmerAuth from "./src/auth.js";

//Some hacks
console.ignoredYellowBox = ['[xmldom warning]'];

const config = require("./config.js");

global.auth = new GlimmerAuth();
global.loggedInUserName = "kvasbo"; //TODO TODOTDO

export default class HomeScreen extends Component {

    constructor(props)
    {
        super(props);

        this.state = {userName: null, loggedIn: false}

        auth.testAuth((data)=>{this.startApp(data)});

    }

    static navigationOptions = {
        title: 'Glimmer',
    };

    componentDidMount()
    {
        //debug
        this.props.navigation.navigate('PageMessages');

    }

    startApp(userObject)
    {
        console.log("startApp", userObject);
        if(typeof(userObject.data.name !== "undefined"))
        {
            this.setState({userName: userObject.data.name, loggedIn: true});

            global.loggedInUserName = userObject.data.name;

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
                <Button
                    onPress={() => this.props.navigation.navigate('PageStream')}
                    large
                    icon={{name: 'view-agenda'}}
                    title='Strøm' />
                <Button
                    onPress={() => this.props.navigation.navigate('PageCalendar')}
                    large
                    icon={{name: 'event'}}
                    title='Kalender' />
                <Button
                    onPress={() => this.props.navigation.navigate('PageMessages')}
                    large
                    icon={{name: 'message'}}
                    title='Meldinger' />
                <Button
                    onPress={() => this.props.navigation.navigate('PageSettings')}
                    large
                    icon={{name: 'settings'}}
                    title='Innstillinger' />
            </View>
        )
    }
}

const Glimmer = StackNavigator({
    Home: { screen: HomeScreen },
    PageStream: {screen: PageStream},
    PageThread: {screen: PageThread },
    PageMessages: {screen: PageMessages},
    PageSettings: {screen: PageSettings},
    PageCalendar: {screen: PageCalendar}
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