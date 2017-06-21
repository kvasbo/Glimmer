/**
 * Created by kvasbo on 31.05.2017.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    FlatList
} from 'react-native';

import StreamForumPost from "./StreamForumPost";

export default class PageStream extends React.Component {

    constructor(props) {
        super(props);
        this.state = {posts: [], next: null, paging: null, refreshing: false};

        this.createPostList = this.createPostList.bind(this);

    }

    static navigatorStyle = {
        drawUnderTabBar: true,
        statusBarBlur: false,
        drawUnderStatusBar: false,
        navBarBlur: true,
        navBarHidden: true,
    };

    static navigationOptions = {
        title: 'Strøm',
    };

    componentDidMount() {

        global.arbeidsMaur.forumUpdater.getFrontpageFromCache().then((data) => {
            this.setState({posts:data});
            global.arbeidsMaur.forumUpdater.getFrontPagePosts().then((data) => {
                this.setState({posts:data.data});
            })
        });
    }

    createPostList() {
        out = [];

        for (post in this.state.posts) {
            out.push(
                    <StreamForumPost showThreadButton={true} navigator={this.props.navigator} key={this.state.posts[post].id}
                                 cut={true} images={false} data={this.state.posts[post]}/>

            );
        }
        return out;
    }

    _onRefresh() {
        this.setState({refreshing: true});
        global.arbeidsMaur.forumUpdater.getFrontPagePosts().then((data) => {
            this.setState({refreshing: false});
        });
    }

    render() {

        return (
            <ScrollView style={pageStyles.container}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />}
            >
                {this.createPostList()}
            </ScrollView>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCCCC0',
        paddingLeft: 0,
        paddingTop: 30,
        paddingBottom: 0,
        paddingRight: 0,
    },
});