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

        this._isMounted = false;

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    componentWillMount()
    {
        this._isMounted = true;
    }

    componentWillUnmount()
    {
        this._isMounted = false;
    }

    static navigatorButtons = {
        rightButtons: [
            {
                title: 'Uleste', // for a textual button, provide the button title (label)
                id: 'alle', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
            }/*,
             {
             icon: require('../../img/navicon_add.png'), // for icon button, provide the local image asset name
             id: 'add' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
             }*/
        ]
    };

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                this._silentRefresh();
                break;
            case "alle":

                this.props.navigator.push({
                    screen: 'glimmer.PageUnread', // unique ID registered with Navigation.registerScreen
                    title: "Mine uleste tråder", // navigation bar title of the pushed screen (optional)
                    animated: true, // does the push have transition animation or does it happen immediately (optional)
                    backButtonTitle: "Mine tråder",
                });

                break;

        }

    }

    _silentRefresh() {

        this.setState({silentLoading: true});

        if (!this.state.loading) global.arbeidsMaur.forumUpdater.addFavorites(1, 1).then(() => {
            if(this._isMounted) {
                this.setState({silentLoading: false})
            }});
    }

    _refresh() {

        this.setState({refreshing: true});

        global.arbeidsMaur.forumUpdater.loadFirstFavorites(1).then((data) => {
            if(this._isMounted){
                this.setState({refreshing: false});
            }
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

        var outString = helpers.getCalendarTime(data.updated_at);

        if(data.unread_comment_count === 1)
        {
            outString += ", én ulest kommentar"
        }
        else if (data.unread_comment_count > 1)
        {
            outString += ", "+data.unread_comment_count+" uleste kommentarer"
        }

        return outString;
    }

    getUnreadStyle(data) {
        if(data.unread_comment_count > 0)
        {
            return {fontWeight: '600'}
        }
    }

    _renderItem = ({item}) => {

        if(item.type === "post")
        {
           var nav = {
               screen: 'glimmer.PageThread',
               title: item.title,
               passProps: {post: item}
           }
        }
        else if(item.type === "event")
        {
            var nav = {
                screen: 'glimmer.PageEvent',
                title: item.title,
                passProps: {event: item}
            }
        }
        else {
            return null;
        }


        return (

        <TouchableOpacity onPress={() =>
            this.props.navigator.push(nav)
        }>
            <View>

                <View style={[listStyles.whiteBox, {justifyContent: "space-between"}]}>
                    <View style={listStyles.textBlock}>
                        <Text style={[listStyles.listTitle, this.getUnreadStyle(item)]}>{item.title}</Text>
                        <Text style={listStyles.listSubtitle}>{this.getSubtitle(item)}</Text>
                    </View>
                    <View style={listStyles.iconBlock}>
                        <Icon name="ios-arrow-forward" color={colors.COLOR_LIGHTGREY} size={30}/>
                    </View>
                </View>


                <Divider />
            </View>
        </TouchableOpacity>
    )}

    _loadMoreItems(distance) {

        global.arbeidsMaur.forumUpdater.addPagesToFavorites(1);

    }

    _getHeader() {
        return (<Divider/>)
    }

    render() {

        var data = this.getData();

        if (data.length === 0 || this.state.loading === true) {
            return <LoadingScreen text="Laster alle tråder du følger"/>
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