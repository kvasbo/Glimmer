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

class PageUnread extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            refreshing: false,
            silentLoading: false
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    static navigatorButtons = {
        rightButtons: [
            {
                title: 'Alle', // for a textual button, provide the button title (label)
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
                    screen: 'glimmer.PageFavorites', // unique ID registered with Navigation.registerScreen
                    title: "Mine tråder", // navigation bar title of the pushed screen (optional)
                    animated: true, // does the push have transition animation or does it happen immediately (optional)
                    backButtonTitle: "Uleste",
                });

                break;

        }

    }

    _silentRefresh() {
        this.setState({silentLoading: true});

        if (!this.state.loading) global.arbeidsMaur.forumUpdater.addUnread(1, 1).then(() => this.setState({silentLoading: false}));
    }

    _refresh() {

        this.setState({refreshing: true});
        global.arbeidsMaur.forumUpdater.loadFirstUnread(1).then((data) => {
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


    _getHeader() {
        return (<Divider/>)
    }

    _getFooter() {
        return (<Text style={{margin:0, textAlign: "center", padding: 15, color: colors.COLOR_LIGHTGREY}}>Les noen tråder for å se flere uleste.</Text>)
    }


    render() {

        var data = this.getData();

        if (data.length === 0 || this.state.loading === true) {
            return <LoadingScreen text="Laster tråder med uleste innlegg"/>
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
                    initialNumToRender={15}
                    ListHeaderComponent={this._getHeader}
                    ListFooterComponent={this._getFooter}
                    scrollsToTop={true}
                />
            );
        }
    }
}

PageUnread.propTypes = {
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
        favorites: state.ForumUnread
    }
}

export default connect(
    mapStateToProps
)(PageUnread)