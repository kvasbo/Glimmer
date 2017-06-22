/**
 * Created by kvasbo on 31.05.2017.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    FlatList,
    Text,
    View,
} from 'react-native';

import {Card, Icon, Badge, Divider, ListItem} from 'react-native-elements'

import FavoriteForumPost from "./FavoriteForumPost";

export default class PageFavorites extends React.Component {

    constructor(props) {
        super(props);
        this.state = {posts: [], loading: true, refreshing: false};
        this.createPostList = this.createPostList.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.updatePostsFromStore = this.updatePostsFromStore.bind(this);
    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                this.updatePostsFromStore();
                break;
            case 'didAppear':
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                break;
        }
    }

    static navigatorStyle = {
        drawUnderTabBar: true,
        statusBarBlur: false,
        drawUnderStatusBar: true,
        drawUnderNavBar: true,
        navBarBlur: true,
        navBarHidden: false,
    };

    static navigationOptions = {
        // title: 'Strøm',
    };

    componentDidMount() {
        this.updatePostsFromStore();
    }

    updatePostsFromStore() {
        var posts = global.arbeidsMaur.forumUpdater.getFavorites();

        if (posts.length > 0) {
            this.setState({posts: posts, loading: false});
        }
        else {
            setTimeout(this.updatePostsFromStore, 200);
        }
    }

    componentDidMount() {

    }

    createPostList() {
        out = [];

        for (post in this.state.posts) {

            out.push(
                <FavoriteForumPost showThreadButton={true} navigator={this.props.navigator}
                                   key={this.state.posts[post].id}
                                   cut={true} images={false} data={this.state.posts[post].bulletin}/>
            );

        }
        return out;
    }

    _onRefresh() {
        /* this.setState({refreshing: true});
         global.arbeidsMaur.forumUpdater.getFrontPagePosts().then((data) => {
         this.setState({refreshing: false});
         });*/
    }

    render() {

        if (this.state.loading) {
            return <View style={pageStyles.container}><Text>Laster inn...</Text></View>
        }
        else {

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
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCCCC0',
        paddingLeft: 0,
        paddingTop: 60,
        paddingBottom: 0,
        paddingRight: 0,
    },
});