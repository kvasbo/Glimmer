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
    AsyncStorage
} from 'react-native';

import StreamForumPost from "./ForumPost";

export default class PageStream extends React.Component {

    constructor(props) {
        super(props);
        this.state = {posts: [], next: null, paging: null};
        this.getFromCache();
    }

    static navigationOptions = {
        title: 'Strøm',
    };

    componentDidMount() {
        this.getPosts();
    }

    getFromCache(){
        AsyncStorage.getItem('@Cache:latestStream', (err, result) => {
            if(!err && result !== null) {
                var resultP = JSON.parse(result);
                //console.log(resultP);
                this.setState({posts: resultP.data, paging: resultP.paging})
            }
        });
    }

    getPosts()
    {
        var uri = "/streams/posts";

        auth.makeApiGetCall("/streams/posts", (data)=>{

            try {
                AsyncStorage.setItem('@Cache:latestStream', JSON.stringify(data));
            } catch (error) {
                // Error saving data
            }

            this.setState({posts:data.data,  paging: data.paging});
        })
    }

    createPostList()
    {
        out = [];

        for(post in this.state.posts)
        {
            out.push(
                <StreamForumPost touchable={true} navigation={this.props.navigation} key={this.state.posts[post].id} cut={true} images={false} data={this.state.posts[post]} />
            );
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