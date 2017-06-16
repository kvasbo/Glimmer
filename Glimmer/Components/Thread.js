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
import ForumComment from "./ForumComment";

export default class Thread extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {id: null, next: null, comments: []};
    }

    static navigationOptions = ({ navigation }) => ({
        title: `Tråd ${navigation.state.params.postId}`,
    });

    componentDidMount()
    {
       this.refreshComments();
    }


    refreshComments()
    {
        var uri = "/posts/"+this.props.navigation.state.params.post.id+"/comments";

        auth.makeApiGetCall(uri, (data)=>{
            console.log(data);
            this.setState({comments:data.data, next: data.paging.next});
        })
    }

    getComments()
    {
        var out = [];

        for(var i=0; i < this.state.comments.length; i++)
        {
            var c = this.state.comments[i];
            console.log("Comment", this.state.comments[i]);
            out.push(<ForumComment key={c.id} data={c} />)
        }

        return out;
    }

    render() {

        return (
            <ScrollView style={pageStyles.container}>
               <StreamForumPost data={this.props.navigation.state.params.post}/>
                {this.getComments()}
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