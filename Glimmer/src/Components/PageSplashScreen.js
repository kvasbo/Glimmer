/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {StyleSheet, View} from "react-native";
import * as colors from "../Styles/colorConstants";

export default class PageSplashScreen extends React.Component {

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
        flex: 1,
        backgroundColor: colors.COLOR_LIGHT,
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 0,
    },
});