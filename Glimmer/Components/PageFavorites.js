/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import LoadingScreen from "./UXElements/LoadingScreen";
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from "../Styles/colorConstants";
import Divider from "./UXElements/Divider";

//Get common list styles
const listStyles = require('../Styles/ListStyles');

export default class PageFavorites extends React.Component {

    reduxUnsubscribe = null;

    constructor(props) {

        super(props);
        this.state = {
            posts: this.props.store.getState().ForumFavorite,
            loading: true,
            refreshing: false,
            silentLoading: false
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    static navigatorStyle = {
        drawUnderTabBar: false,
        statusBarBlur: true,
        drawUnderStatusBar: false,
        drawUnderNavBar: false,
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

                var tmpPosts = store.getState().ForumFavorite;

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
        this.setState({silentLoading: true});

        if (!this.state.loading) global.arbeidsMaur.forumUpdater.addFavorites(1, 1).then(() => this.setState({silentLoading: false}));
    }

    _refresh() {

        this.setState({refreshing: true});
        global.arbeidsMaur.forumUpdater.addFavorites(1, 1).then((data) => {
            this.setState({refreshing: false});
        });

    }

    getData() {
        let out = Object.values(this.state.posts);

        out.sort((x, y) => {
            return (new Date(y.updated_at) - new Date(x.updated_at));
        })

        return out;
    }

    getSubtitle(data) {
        return helpers.getCalendarTime(data.updated_at);
    }

    _renderItem = ({item}) => (

        <View>
            <TouchableOpacity onPress={() =>
                this.props.navigator.push({
                    screen: 'glimmer.PageThread',
                    title: item.title,
                    passProps: {post: item}
                })
            }>
                <View style={listStyles.whiteBox}>
                    <View style={listStyles.textBlock}>
                        <Text style={listStyles.listTitle}>{item.title}</Text>
                        <Text style={listStyles.listSubtitle}>{this.getSubtitle(item)}</Text>
                    </View>
                    <View style={listStyles.iconBlock}>
                        <Icon name="ios-arrow-forward" color={colors.COLOR_LIGHTGREY} size={30}/>
                    </View>
                </View>

            </TouchableOpacity>
            <Divider />
        </View>

    )

    _loadMoreItems(distance) {
        if (__DEV__) {
            console.log("Reached end", distance)
        }
        global.arbeidsMaur.forumUpdater.addPagesToFavorites(1);

    }

    _getHeader() {
        return (<Divider/>)
    }

    render() {

        if (this.state.loading) {
            return <LoadingScreen text="Laster trådene dine..."/>
        }
        else {

            return (

                <FlatList
                    style={pageStyles.container}
                    data={this.getData()}
                    onRefresh={() => this._refresh()}
                    refreshing={this.state.refreshing}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.id}
                    onEndReached={this._loadMoreItems}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={15}
                    ListHeaderComponent={this._getHeader}
                />
            );
        }
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: colors.COLOR_WHITE,
        paddingLeft: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingRight: 0,

    },

});