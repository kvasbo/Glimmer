/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {addNewMessageRecipient, removeNewMessageRecipient, clearNewMessageRecipient} from "../../Redux/actions"

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



        if(__DEV__)
        {
            console.log("Setstate", !this.state.selected, this.props.person.name);
        }

        if(this.state.selected)
        {
            store.dispatch(removeNewMessageRecipient(this.props.person.id));
        }
        else
        {
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
        borderWidth: 3,
        borderColor: "#E74C3CFF"
    },

    faceNotSelected: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 3,
        borderColor:  "#E74C3C00"
    },

    name: {
        fontSize: 12,
        color: "#ECF0F1"
    }

});