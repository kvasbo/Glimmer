/**
 * Created by kvasbo on 31.05.2017.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import ForumText from './ForumText.js';

var s = require('./Styles');

//https://github.com/jsdf/react-native-htmlview

class CommentMetadata extends React.Component {

    constructor(props)
    {
        super(props);
    }

    getTime()
    {
        return new moment(this.props.data.created_at).calendar();
    }

    render () {

        return (
            <View>
                <Image

                    style={{width: 25, height: 25}}
                    source={{uri: this.props.data.creator.image_url}}
                />
                <Text>{this.props.data.creator.name}</Text>
                <Text>{this.props.data.creator.id}</Text>
                <Text>{this.getTime()}</Text>
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
            <View style={s.commentContainer}>
                <ForumText cut={false} text={this.props.data.body}/>
                <CommentMetadata data={this.props.data}/>
            </View>
        )

    }

}