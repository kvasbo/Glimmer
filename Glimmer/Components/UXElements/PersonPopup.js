/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Button, Image, StyleSheet, Text, View} from "react-native";

export default class PersonPopup extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <View style={pageStyles.container}>
                <View style={{flexDirection: "row", alignItems: "center", padding: 5}}>
                    <Image style={pageStyles.image} source={{uri: this.props.person.image_url}}/>
                    <Text style={pageStyles.title}>{this.props.person.realname}</Text>
                </View>
                <Button title="Lukk" onPress={() => this.props.navigator.dismissLightBox() }/>
            </View>
        );
    }
}

const pageStyles = StyleSheet.create({

    container: {
        backgroundColor: "#CCCCCC",
        borderRadius: 8,
        padding: 10,
        width: 250,
        borderColor: "#CCCCCC",
    },

    title: {
        fontSize: 16,
        padding: 10,
    },

    image: {
        height: 60,
        width: 60,
        padding: 10
    }

});