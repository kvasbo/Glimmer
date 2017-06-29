/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {RefreshControl, ScrollView, StyleSheet} from "react-native";
import LoadingScreen from "./LoadingScreen";
import StreamForumPost from "./UXElements/StreamForumPost";
import Divider from "./UXElements/Divider";

export default class PageStream extends React.Component {

    constructor(props) {

        super(props);
        this.state = {posts: [], loading: true, refreshing: false};
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
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
        statusBarBlur: true,
        drawUnderStatusBar: false,
        drawUnderNavBar: false,
        navBarBlur: true,
        navBarHidden: true,
    };


    componentDidMount() {

        this.setState({posts:this.props.store.getState().ForumStream.posts});

        //Listen to state changes. This really needs to change at some later point.
        reduxUnsubscribe = store.subscribe(() => {

                var tmpPosts = store.getState().ForumStream.posts;

                if (tmpPosts !== this.state.posts) {
                    this.setState({loading: false, posts: tmpPosts});
                }
            }
        )
    }

    createPostList() {
        out = [];

        for (post in this.state.posts) {

            out.push(<StreamForumPost showThreadButton={true} navigator={this.props.navigator}
                                      key={this.state.posts[post].data.id}
                                      cut={true} images={false} data={this.state.posts[post].data}/>);
        }
        return out;
    }

    _onRefresh() {
         this.setState({refreshing: true});
         global.arbeidsMaur.forumUpdater.loadStream(1).then((data) => {
            this.setState({refreshing: false});
         });
    }

    render() {

        if (this.state.loading) {
            return <LoadingScreen text="Laster forsiden..."/>
        } else {

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
        flex: 1, backgroundColor: '#FAFAFA', paddingLeft: 0, marginTop: 20, paddingBottom: 0, paddingRight: 0,
    },
});