/**
 * Created by kvasbo on 30.05.2017.
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import {
    TabNavigator,
} from 'react-navigation';

//import Icon from "./Icon.js";

import StreamPage from './Stream.js';

export const Tabs = TabNavigator({
    Stream: {
        screen: StreamPage,
        navigationOptions: {
            tabBarLabel: 'Strøm',
           // tabBarIcon: <Icon name="home"/>
        },
    },
});

export default Tabs