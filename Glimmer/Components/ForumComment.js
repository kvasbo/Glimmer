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
import HTMLView from 'react-native-htmlview';

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
            <View>
                <Text>{this.props.data.body}</Text>
                <CommentMetadata data={this.props.data}/>
            </View>
        )

    }

}