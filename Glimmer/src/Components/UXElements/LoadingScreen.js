/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types"
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import * as colors from "../../Styles/colorConstants"

export default class LoadingScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <View style={pageStyles.container}>
                <ActivityIndicator size="large" color={colors.COLOR_DARKGREY}/>
                <Text style={{marginTop: 20, color: colors.COLOR_DARKGREY}}>{this.props.text}</Text>
            </View>
        );
    }
}

LoadingScreen.propTypes = {
    text: PropTypes.string
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.COLOR_LIGHT,
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
        justifyContent: "center",
        alignItems: 'center',
    },
});