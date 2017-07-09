/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from 'prop-types';
import {View, StyleSheet, ViewPropTypes} from "react-native";
import * as colors from "../../Styles/colorConstants"

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