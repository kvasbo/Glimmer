/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {View, StyleSheet} from "react-native";

export default class Divider extends React.Component {

   pageStyles = StyleSheet.create({

        container: {
            backgroundColor: this.props.color,
            marginLeft: 10,
            marginRight: 10,
            height: 5,
            flex: 1,
        },

    });

    componentDidMount() {

    }

    render() {

        return (
            <View style={this.pageStyles.container}></View>
        );
    }
}

