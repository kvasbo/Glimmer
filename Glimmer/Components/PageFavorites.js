/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import LoadingScreen from "./UXElements/LoadingScreen";
import {Divider, Icon} from "react-native-elements";

//Get common list styles
const listStyles = require('../Styles/ListStyles');

export default class PageFavorites extends React.Component {

    reduxUnsubscribe = null;

    constructor(props) {

        super(props);
        this.state = {posts: this.props.store.getState().ForumFavorite.posts, loading: true, refreshing: false};
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    static navigatorStyle = {
        drawUnderTabBar: true,
        statusBarBlur: false,
        drawUnderStatusBar: false,
        drawUnderNavBar: true,
        navBarBlur: true,
        navBarHidden: false,
    };

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                this._silentRefresh();
                break;
        }
    }

    componentWillMount() {

        //Listen to state changes. This really needs to change at some later point.
        this.reduxUnsubscribe = store.subscribe(() => {
            
                var tmpPosts = store.getState().ForumFavorite.posts;

                if (tmpPosts !== this.state.posts) {
                    this.setState({loading: false, posts: tmpPosts});
                }
            }
        )
    }

    componentWillUnmount() {
        this.reduxUnsubscribe();
    }

    _silentRefresh() {
        if(!this.state.loading) global.arbeidsMaur.forumUpdater.addFavorites(1, 1);
    }

    _refresh() {

        this.setState({refreshing: true});
        global.arbeidsMaur.forumUpdater.addFavorites(1, 1).then((data) => {
            this.setState({refreshing: false});
        });

    }

    getSubtitle(data) {
        var date = new moment(data.updated_at).calendar()
        return date;
    }

    _renderItem = ({item}) => (

        <View>
            <TouchableOpacity onPress={() =>
                this.props.navigator.push({
                    screen: 'glimmer.PageThread',
                    title: item.data.title,
                    passProps: {post: item.data}
                })
            }>
                <View style={listStyles.whiteBox}>
                    <View style={listStyles.textBlock}>
                        <Text style={listStyles.listTitle}>{item.data.title}</Text>
                        <Text style={listStyles.listSubtitle}>{this.getSubtitle(item.data)}</Text>
                    </View>
                    <View style={listStyles.iconBlock}>
                        <Icon name="keyboard-arrow-right" color="#AAAAAA" size={30}/>
                    </View>
                </View>

            </TouchableOpacity>
            <Divider style={listStyles.divider}/>
        </View>

    )

    _loadMoreItems(distance) {
        if (__DEV__) {
            console.log("Reached end", distance)
        }
        global.arbeidsMaur.forumUpdater.addPagesToFavorites(1);

    }

    render() {

        if (this.state.loading) {
            return <LoadingScreen text="Laster trådene dine..."/>
        }
        else {

            return (

                <FlatList
                    style={pageStyles.container}
                    data={this.state.posts}
                    onRefresh={() => this._refresh()}
                    refreshing={this.state.refreshing}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.data.id}
                    onEndReached={this._loadMoreItems}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={30}
                />
            );
        }
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#FFFFFF',
        paddingLeft: 0,
        marginTop: 60,
        marginBottom: 50,
        paddingRight: 0,

    },

});