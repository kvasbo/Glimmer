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


import {Navigation} from 'react-native-navigation';

import {Button} from 'react-native-elements'

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {userName: null, loggedIn: false, frontpage: []}

        auth.testAuth((data) => {
            this.startApp(data)
        });

        this.saveWorkerDataToState = this.saveWorkerDataToState.bind(this);
    }

    static navigationOptions = {
        title: 'Glimmer',
    };

    componentWillMount() {

    }

    saveWorkerDataToState(data) {
        if (typeof(data.name) !== "undefined" && data.success === true) {
            console.log("saving data to state", data);
            if (data.name === "forside") {
                this.setState({frontpage: data.data});
            }
        }
        else {
            console.log("Error in worker return data", data);
        }
    }

    componentDidMount() {
        //debug
        // arbeidsMaur.forumUpdater.update(this.saveWorkerDataToState);
        // this.props.navigation.navigate('PageMessages');

    }

    startApp(userObject) {
        console.log("startApp", userObject);
        if (typeof(userObject.data.name !== "undefined")) {
            this.setState({userName: userObject.data.name, loggedIn: true});

            global.loggedInUserName = userObject.data.name;

        }

    }

    getUserName() {
        if (this.state.userName !== null) {
            return "Velkommen, " + this.state.userName;
        }
        else {
            return null;
        }
    }

    getLoginScreen() {
        return (
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
                    title='Strøm'/>
                <Button
                    onPress={() => this.props.navigation.navigate('PageCalendar')}
                    large
                    icon={{name: 'event'}}
                    title='Kalender'/>
                <Button
                    onPress={() => this.props.navigation.navigate('PageMessages')}
                    large
                    icon={{name: 'message'}}
                    title='Meldinger'/>
                <Button
                    onPress={() => this.props.navigation.navigate('PageSettings')}
                    large
                    icon={{name: 'settings'}}
                    title='Innstillinger'/>
            </View>
        )
    }
}

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