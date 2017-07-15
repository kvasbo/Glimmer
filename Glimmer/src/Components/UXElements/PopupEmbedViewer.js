/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {StyleSheet, View, WebView, Button, Dimensions} from "react-native";
import * as colors from "../../Styles/colorConstants";

export default class PopupEmbedViewer extends React.Component {

    constructor(props) {
        super(props);
        console.log("Popup", this.props);
    }

    componentDidMount() {

    }

    render() {

        const Dim = Dimensions.get("window");
        var maxWidth = Dim.width - 30;
        var maxHeight= Dim.height - 100;

        return (
            <View style={pageStyles.container}>
                <WebView userAgent="Glimmer" scalesPageToFit={true} style={{width: maxWidth, height: maxHeight, marginTop: 20, borderWidth: 1, borderColor: "black"}} source={{uri: this.props.uri}}/>
                <Button title="Lukk" onPress={()=>this.props.navigator.dismissLightBox()} />
            </View>
        );
    }
}

PopupEmbedViewer.propTypes = {
    navigator: PropTypes.object.isRequired,
    uri: PropTypes.string.isRequired
}

const pageStyles = StyleSheet.create({

    container: {
        flex: 1,
        margin: 5,
    },

});