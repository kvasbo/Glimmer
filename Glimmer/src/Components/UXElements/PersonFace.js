/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {addNewMessageRecipient, removeNewMessageRecipient} from "../../Redux/actions";
import * as colors from "../../Styles/colorConstants";

//const CachedImage = require('react-native-cached-image');

export default class PersonFace extends React.Component {

    constructor(props) {
        super(props);

        let initActive = false;
        if (this.props.active === true) initActive = true

        this.state = {selected: initActive}
    }

    componentDidMount() {

    }

    getSelectedStyle() {
        if (this.state.selected) return pageStyles.faceSelected;
        else return pageStyles.faceNotSelected;
    }

    getImageUrl() {
        return this.props.person.image;
    }

    getImage() {
        let url = this.getImageUrl();

        if (url === "https://underskog.no/assets/images/noicon_48.png") {
            return <Image style={this.getSelectedStyle()} source={require('../../../icons/default_avatar.png')}/>
        }

        return <Image style={this.getSelectedStyle()} source={{uri: url}}/>

    }

    toggleState() {

        if (__DEV__) {
            console.log("Setstate", !this.state.selected, this.props.person.id, this.props.person.name);
        }

        if (this.state.selected) {
            store.dispatch(removeNewMessageRecipient(this.props.person.id));
        }
        else {
            store.dispatch(addNewMessageRecipient(this.props.person.id));
        }

        this.setState({selected: !this.state.selected});

    }

    showInfo() {

        this.props.navigator.showLightBox({
            screen: "glimmer.PersonPopup", // unique ID registered with Navigation.registerScreen
            passProps: {person: this.props.person}, // simple serializable object that will pass as props to the lightbox (optional)
            style: {
                backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
                //backgroundColor: "#ffffff20" // tint color for the background, you can specify alpha here (optional)
            }
        });

    }

    render() {

        return (
            <TouchableOpacity onPress={() => this.toggleState()} onLongPress={() => this.showInfo()}>
                <View style={pageStyles.container}>
                    {this.getImage()}
                    <Text style={pageStyles.name}>{this.props.person.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

PersonFace.defaultProps = {
    active: true
}

PersonFace.propTypes = {
    person: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    active: PropTypes.bool
};

const pageStyles = StyleSheet.create({

    container: {
        width: 90,
        height: 90,
        padding: 0,
        justifyContent: "space-around",
        alignItems: "center",
    },

    faceSelected: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 3,
        borderColor: colors.COLOR_LIGHT + "FF"
    },

    faceNotSelected: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 3,
        borderColor: colors.COLOR_LIGHT + "00"
    },

    name: {
        fontSize: 12,
        color: colors.COLOR_LIGHT
    }

});