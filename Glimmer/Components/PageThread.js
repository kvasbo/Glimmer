/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {KeyboardAvoidingView, ScrollView, StyleSheet, View} from "react-native";

import ThreadForumPost from "./UXElements/ThreadForumPost";
import ForumComment from "./UXElements/ForumComment";
import AddCommentBlock from "./UXElements/ForumAddComment";

const commentsInPage = 30;


export default class PageThread extends React.Component {

    lastPage = null;
    reduxUnsubscribe = null;

    constructor(props) {
        super(props);

        if(typeof store.getState().ForumPostComment.posts[this.props.post.id] !== "undefined")
        {
            this.state = {loading: true, comments: store.getState().ForumPostComment.posts[this.props.post.id].comments};
        }
        else
        {
            this.state = {loading: true, comments: []};
        }

        this.lastPage = this.findLastPageOfComments();

        this.loadInitComments();

    }

    componentWillMount() {
        //Listen to state changes. This really needs to change at some later point.
        this.reduxUnsubscribe = store.subscribe(() => {

            var state = store.getState();

            if(typeof state.ForumPostComment.posts[this.props.post.id] !== "undefined")
            {

                var tmpComments = state.ForumPostComment.posts[this.props.post.id].comments;

                if (tmpComments !== this.state.comments) {
                    this.setState({loading: false, comments: tmpComments});
                }

            }
            }
        )
    }

    componentWillUnmount() {
        this.reduxUnsubscribe();
    }

    loadInitComments() {

        //Get last comments
        arbeidsMaur.forumUpdater.loadCommentsForPost(this.props.post.id, 1);

        //...and the page before if possible.
        if(this.lastPage > 1)
        {
            arbeidsMaur.forumUpdater.loadCommentsForPost(this.props.post.id, 2);
        }

    }

    findLastPageOfComments()
    {


        var cCount = parseInt(this.props.post.comment_count);

       // console.log("findLastPageOfComments", this.props, cCount);

        return parseInt((Math.floor(cCount / commentsInPage) + 1));
    }


    getComments() {

        var out = [];

        for (key in this.state.comments) {
            var c = this.state.comments[key];
            //console.log("Comment", this.state.comments[i]);
            out.push(<ForumComment key={c.id} data={c}/>)
        }

        return out;

    }

    render() {

        return (

            <ScrollView style={pageStyles.container}>
                <ThreadForumPost data={this.props.post} metaData={false} cut={false}
                                 touchable={false}/>
                {this.getComments()}
                <AddCommentBlock postId={this.props.post.id} navigator={this.props.navigator} title={this.props.post.title}/>
                <KeyboardAvoidingView behavior="padding"/>
                <View style={{height: 20}}/>
            </ScrollView>

        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECF0F1',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
});