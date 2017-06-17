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


import ForumText from './ForumText.js';

var s = require('./Styles');

//https://github.com/jsdf/react-native-htmlview

class MetaDataFirstPost extends React.Component {

    constructor(props)
    {
        super(props);
    }

    render () {

        return (
            <View>
                <Text>{this.props.comments} Kommentarer</Text>
                <Text>{this.props.forum}</Text>
                <Text></Text>
            </View>
        )

    }

}

export default class StreamForumPost extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {};
    }

    componentDidMount()
    {
        //console.log(this.props.data);
    }

    getTime(time)
    {
        return new moment(this.props.data.created_at).calendar();
    }

    render() {

        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('PageThread', { post: this.props.data, postId: this.props.data.id })}>
                <View style={s.postContainer}>
                    <Text style={{fontSize: 15}}>{this.props.data.title}</Text>
                    <Text>{this.props.data.creator.name}</Text>
                    <Text>{this.getTime()}</Text>

                    <ForumText cut={true} text={this.props.data.body}/>

                    <MetaDataFirstPost comments={this.props.data.comment_count} forum={this.props.data.forum.title}/>
                </View>
            </TouchableOpacity>
        );
    }

}

class Tag extends Component {

    render() {
        return (
            <View><Text>{this.props.tag}</Text></View>
        )
    }
}

class ViewUser extends Component {



}