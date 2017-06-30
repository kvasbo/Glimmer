/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";


export default class LoadingScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <View style={pageStyles.container}>
                <ActivityIndicator size="large" color="#555555"/>
                <Text style={{marginTop: 20, color: "#555555"}}>{this.props.text}</Text>
            </View>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
        justifyContent: "center",
        alignItems: 'center',
    },
});