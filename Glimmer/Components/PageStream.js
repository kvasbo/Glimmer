/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {RefreshControl, ScrollView, StyleSheet} from "react-native";
import LoadingScreen from "./LoadingScreen";
import StreamForumPost from "./UXElements/StreamForumPost";

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

        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'newMessage') { // this is the same id field from the static navigatorButtons definition

                this.props.navigator.push({
                    screen: 'glimmer.PageNewForumPost', // unique ID registered with Navigation.registerScreen
                    title: "Nytt innlegg", // navigation bar title of the pushed screen (optional)
                    animated: true, // does the push have transition animation or does it happen immediately (optional)
                });

            }
        }
    }

    static navigatorButtons = {
        rightButtons: [
            {
                icon: require("../icons/plus.png"),
                id: 'newMessage', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
            }
        ]
    };

    static navigatorStyle = {
        drawUnderTabBar: true,
        statusBarBlur: true,
        drawUnderStatusBar: false,
        drawUnderNavBar: true,
        navBarBlur: true,
        navBarHidden: false,
    };

    componentDidMount() {

        this.setState({posts: this.props.store.getState().ForumStream.posts});

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
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingLeft: 0,
        marginTop: 60,
        paddingBottom: 0,
        paddingRight: 0,
    },
});