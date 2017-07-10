/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {StyleSheet, View, WebView} from "react-native";
import * as colors from "../../Styles/colorConstants";

export default class PopupEmbedViewer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <View>
                <WebView source={{uri: this.props.uri}} style={pageStyles.container}/>
            </View>
        );
    }
}

PopupEmbedViewer.propTypes = {
    person: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    uri: PropTypes.string.isRequired
}

const pageStyles = StyleSheet.create({

    container: {
        flex: 1,
        margin: 0,
        backgroundColor: colors.COLOR_LIGHT
    },

});