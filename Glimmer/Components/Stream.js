/**
 * Created by kvasbo on 31.05.2017.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';

import StreamForumPost from "./ForumPost";

export default class StreamPage extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {posts: [], next: null};
    }

    static navigationOptions = {
        title: 'Strøm',
    };

    componentDidMount()
    {
        this.getPosts();
    }

    getPosts()
    {
        auth.makeApiGetCall("/streams/posts", (data)=>{
            this.setState({posts:data.data, next: data.paging.next});
        })
    }

    createPostList()
    {
        out = [];

        for(post in this.state.posts)
        {
            out.push(<StreamForumPost navigation={this.props.navigation} key={this.state.posts[post].id} data={this.state.posts[post]} />);
        }
        return out;
    }

    render() {



        return (
            <ScrollView style={pageStyles.container}>
                {this.createPostList()}
            </ScrollView>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCCCCC',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
});