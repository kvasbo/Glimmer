/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {StyleSheet, FlatList, View} from "react-native";
import LoadingScreen from "./UXElements/LoadingScreen";
import StreamForumPost from "./UXElements/StreamForumPost";
import Divider from "./UXElements/Divider";
import * as colors from "../Styles/colorConstants"

export default class PageStream extends React.Component {

    constructor(props) {

        super(props);
        this.state = {posts: [], loading: true, refreshing: false};
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this._onRefresh = this._onRefresh.bind(this);

    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                this._silentRefresh();
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
        drawUnderTabBar: false,
        statusBarBlur: true,
        drawUnderStatusBar: false,
        drawUnderNavBar: false,
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

    _renderItem(item) {

        return (

            <StreamForumPost navigator={this.props.navigator}
                             cut={true} images={false} data={item.data}/>

        )
    }

    _silentRefresh() {
        if (!this.state.refreshing) global.arbeidsMaur.forumUpdater.loadStream(1);
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
                <FlatList
                    style={pageStyles.container}
                    data={this.state.posts}
                    renderItem={(item) => this._renderItem(item.item)}
                    keyExtractor={(item) => {return item.data.id}}
                    onRefresh={this._onRefresh}
                    refreshing={this.state.refreshing}
                    initialNumToRender={5}

                />
            );
        }
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.COLOR_LIGHT,
        padding: 0,
        margin: 0,
    },
});
