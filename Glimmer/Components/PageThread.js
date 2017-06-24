/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {KeyboardAvoidingView, ScrollView, StyleSheet, View} from "react-native";

import StreamForumPost from "./StreamForumPost";
import ForumComment from "./ForumComment";
import AddCommentBlock from "./ForumAddComment";

export default class PageThread extends React.Component {

    constructor(props) {
        super(props);
        this.state = {id: null, next: null, comments: []};
    }

    componentDidMount() {
        this.refreshComments();
    }

    refreshComments() {
        var uri = "/posts/" + this.props.post.id + "/comments";

        auth.makeApiGetCall(uri).then((data) => {
            console.log(data);
            this.setState({comments: data.data, next: data.paging.next});
        })
    }

    getComments() {
        var out = [];

        for (var i = this.state.comments.length - 1; i >= 0; i--) {
            var c = this.state.comments[i];
            console.log("Comment", this.state.comments[i]);
            out.push(<ForumComment key={c.id} data={c}/>)
        }

        return out;
    }

    render() {

        return (

            <ScrollView style={pageStyles.container}>
                <StreamForumPost data={this.props.post} metaData={false} cut={false}
                                 touchable={false}/>
                {this.getComments()}
                <AddCommentBlock postId={this.props.post.id}/>
                <KeyboardAvoidingView behavior="padding"/>
                <View style={{height: 20}}/>
            </ScrollView>

        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#AAAAAA',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
});