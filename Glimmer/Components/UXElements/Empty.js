/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {View, StyleSheet, ViewPropTypes} from "react-native";

export default class Empty extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <View style={pageStyles.container}>

            </View>
        );
    }
}

const pageStyles = StyleSheet.create({

    container: {

    },

});