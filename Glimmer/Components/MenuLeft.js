/**
 * Created by kvasbo on 31.05.2017.
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';


export default class MenuLeft extends React.Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = ({navigation}) => ({
        title: "Title",
    });

    componentDidMount() {

    }

    render() {

        return (
            <ScrollView style={pageStyles.container}>

            </ScrollView>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 0,
    },
});