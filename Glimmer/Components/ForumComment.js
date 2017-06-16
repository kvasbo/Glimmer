/**
 * Created by kvasbo on 31.05.2017.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import HTMLView from 'react-native-htmlview';

//https://github.com/jsdf/react-native-htmlview

class CommentMetadata extends React.Component {

    constructor(props)
    {
        super(props);
    }

    render () {

        return (
            <View>
                <Text>{this.props.data.body}</Text>
            </View>
        )

    }

}

export default class ForumComment extends React.Component {

    constructor(props)
    {
        super(props);
    }

    render () {

        return (
            <View>
                <Text>{this.props.data.body}</Text>
            </View>
        )

    }

}