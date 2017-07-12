/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import LoadingScreen from "./UXElements/LoadingScreen";
import Icon from "react-native-vector-icons/Ionicons";
import * as colors from "../Styles/colorConstants";
import Divider from "./UXElements/Divider";

//Get common list styles
const listStyles = require('../Styles/ListStyles');

class PageFavorites extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            refreshing: false,
            silentLoading: false
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                this._silentRefresh();
                break;
        }
    }

    _silentRefresh() {
        this.setState({silentLoading: true});

        if (!this.state.loading) global.arbeidsMaur.forumUpdater.addFavorites(1, 1).then(() => this.setState({silentLoading: false}));
    }

    _refresh() {

        this.setState({refreshing: true});
        global.arbeidsMaur.forumUpdater.loadFirstFavorites(1).then((data) => {
            this.setState({refreshing: false});
        });

    }

    getData() {

        let out = Object.values(this.props.favorites);

        out.sort((x, y) => {
            return (new Date(y.updated_at) - new Date(x.updated_at));
        })

        return out;
    }

    getSubtitle(data) {
        return helpers.getCalendarTime(data.updated_at);
    }

    _renderItem = ({item}) => (

        <TouchableOpacity onPress={() =>
            this.props.navigator.push({
                screen: 'glimmer.PageThread',
                title: item.title,
                passProps: {post: item}
            })
        }>
            <View>

                <View style={[listStyles.whiteBox, {justifyContent: "space-between"}]}>
                    <View style={listStyles.textBlock}>
                        <Text style={listStyles.listTitle}>{item.title}</Text>
                        <Text style={listStyles.listSubtitle}>{this.getSubtitle(item)}</Text>
                    </View>
                    <View style={listStyles.iconBlock}>
                        <Icon name="ios-arrow-forward" color={colors.COLOR_LIGHTGREY} size={30}/>
                    </View>
                </View>


                <Divider />
            </View>
        </TouchableOpacity>
    )

    _loadMoreItems(distance) {

        global.arbeidsMaur.forumUpdater.addPagesToFavorites(1);

    }

    _getHeader() {
        return (<Divider/>)
    }

    render() {

        var data = this.getData();

        if (data.length === 0 || this.state.loading === true) {
            return <LoadingScreen text="Laster trådene dine..."/>
        }
        else {

            return (

                <FlatList
                    style={pageStyles.container}
                    data={data}
                    onRefresh={() => this._refresh()}
                    refreshing={this.state.refreshing}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.id}
                    onEndReached={this._loadMoreItems}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={15}
                    ListHeaderComponent={this._getHeader}
                    scrollsToTop={true}
                />
            );
        }
    }
}

PageFavorites.propTypes = {
    favorites: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
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

function mapStateToProps(state) {
    return {
        favorites: state.ForumFavorite
    }
}

export default connect(
    mapStateToProps
)(PageFavorites)