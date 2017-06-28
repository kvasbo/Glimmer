/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

export default class PersonFace extends React.Component {

    constructor(props) {
        super(props);
        this.state = {selected: false}
    }

    componentDidMount() {

    }

    getSelectedStyle() {
        if (this.state.selected) return pageStyles.faceSelected;
        else return pageStyles.faceNotSelected;
    }

    getImageUrl() {
        var url = this.props.person.image_url;
        return url;
    }

    toggleState() {
        var newState = !this.state.selected;
        console.log("Setstate", newState, this.props.person.name);
        this.setState({selected: newState});
    }

    showInfo() {

        this.props.navigator.showLightBox({
            screen: "glimmer.PersonPopup", // unique ID registered with Navigation.registerScreen
            passProps: {person: this.props.person}, // simple serializable object that will pass as props to the lightbox (optional)
            style: {
                backgroundBlur: "light", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
                backgroundColor: "#ffffff30" // tint color for the background, you can specify alpha here (optional)
            }
        });

    }

    render() {

        return (
            <TouchableOpacity onPress={() => this.toggleState()} onLongPress={() => this.showInfo()}>
                <View style={pageStyles.container}>
                    <Image style={this.getSelectedStyle()} source={{uri: this.props.person.image_url}}/>
                    <Text style={pageStyles.name}>{this.props.person.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const pageStyles = StyleSheet.create({

    container: {
        width: 90,
        height: 90,
        padding: 0,
        justifyContent: "space-around",
        alignItems: "center"
    },

    faceSelected: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 5,
        borderColor: "#A3D9B0FF"
    },

    faceNotSelected: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 5,
        borderColor: "#A3D9B000"
    },

    name: {
        fontSize: 12,
        color: "#cccccc"
    }

});