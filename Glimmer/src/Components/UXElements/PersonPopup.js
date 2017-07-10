/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {Button, Image, StyleSheet, Text, View} from "react-native";
//const CachedImage = require('react-native-cached-image');

export default class PersonPopup extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <View style={pageStyles.container}>
                <View style={{flexDirection: "column", alignItems: "center", padding: 5}}>
                    <Image style={pageStyles.image} source={{uri: this.props.person.image}}/>
                    <Text style={pageStyles.title}>{this.props.person.realName}</Text>
                </View>
                <Button title="Lukk" onPress={() => this.props.navigator.dismissLightBox() }/>
            </View>
        );
    }
}

PersonPopup.propTypes = {
    person: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
}

const pageStyles = StyleSheet.create({

    container: {
        backgroundColor: "#ECF0F1",
        borderRadius: 5,
        padding: 10,
        width: 250,
        borderColor: "#CCCCCC",
    },

    title: {
        fontSize: 16,
        padding: 10,
    },

    image: {
        borderRadius: 5,
        height: 80,
        width: 80,
        padding: 10
    }

});