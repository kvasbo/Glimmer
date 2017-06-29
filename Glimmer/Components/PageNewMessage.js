/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {ScrollView, StyleSheet, View, TextInput, TouchableOpacity} from "react-native";

export default class PageNewMessage extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <ScrollView style={pageStyles.container}>

                <View>

                </View>

                <TextInput/>

            </ScrollView>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCCCCC',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
});