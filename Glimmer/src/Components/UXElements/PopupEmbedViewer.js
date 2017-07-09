/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from 'prop-types';
import {View, StyleSheet, WebView} from "react-native";
import * as colors from "../../Styles/colorConstants"

export default class PopupEmbedViewer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <WebView source={{uri:this.props.uri}} style={pageStyles.container} />
        );
    }
}

PopupEmbedViewer.props = {
    uri: PropTypes.string.isRequired
}

const pageStyles = StyleSheet.create({

    container: {
        flex:1,
        margin: 0
    },

});