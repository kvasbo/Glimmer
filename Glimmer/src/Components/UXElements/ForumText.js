/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {Alert, Dimensions, Image, Linking, Platform, StyleSheet, Text, View, WebView} from "react-native";
import HTMLView from "react-native-htmlview";
import * as colors from "../../Styles/colorConstants";
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;

export default class ForumText extends React.Component {

    constructor(props) {
        super(props);
        this.renderNode = this.renderNode.bind(this);

        this.dim = Dimensions.get("window");
        this.parsed = this.parseBody(this.fixBody());

    }

    parseBody(html) {
        try {

            const parser = new DOMParser();
            const serializer = new XMLSerializer();

            let doc = parser.parseFromString(html, 'text/html');

            //Rense opp inni her!

            //Fjerne HR.
            let hr = doc.getElementsByTagName("hr");
            for (let i = 0; i <= hr.$$length; i++) {
                if (typeof(hr[i]) !== "undefined") {
                    doc.removeChild(hr[i]);
                }
                else {
                    break;
                }
            }

            let iframes = doc.getElementsByTagName("iframe");
            for (let i = 0; i <= iframes.$$length; i++) {
                if (typeof(iframes[i]) !== "undefined") {
                    console.log("Iframe")
                    //doc.removeChild(hr[i]);
                }
                else {
                    break;
                }
            }

            //Avslutte rensinga.

            doc.normalize();

            var str = serializer.serializeToString(doc);

            return str;

        } catch (err) {
            console.log(err);
            return "";
        }
    }

    fixBody() {

        var text = "";

        if (typeof(this.props.text) !== "undefined" && this.props.text !== null) {
            text = this.props.text;
        }

        text = this.replaceAll(text, 'href="//images', 'href="https://images');
        text = this.replaceAll(text, 'src="//images', 'src="https://images');

        return text;
    }

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    //renderNode(node, index, siblings, parent, defaultRenderer) {
    renderNode(node, index, siblings, parent, defaultRenderer) {

        const Dim = Dimensions.get("window");
        var maxWidth = Dim.width - 50;


        try {
            if (node.name == 'iframe') {

                const a = node.attribs;

                if (Platform.OS === "ios") {

                    const iframeHtml = `<iframe src="${a.src}"></iframe>`;

                    let frameW = Number(node.attribs.width);
                    let frameH = Number(node.attribs.height);

                    let factor = frameW / maxWidth;

                    if (factor > 1) {
                        var width = Math.round(frameW / factor);
                        var height = Math.round(frameH / factor);
                    }
                    else {
                        var width = frameW;
                        var height = frameH;
                    }

                    console.log(frameW, frameH, width, factor);

                    return (
                        <View key={index} style={{width: width, height: height}}>
                            <WebView source={{html: iframeHtml}}/>
                        </View>
                    );
                }
                else {



                    return (
                        <Text key={index} style={{color:colors.COLOR_HIGHLIGHT}} onPress={() => {

                            this.props.navigator.showLightBox({
                                screen: "glimmer.PopupEmbedViewer", // unique ID registered with Navigation.registerScreen
                                passProps: {uri:a.src}, // simple serializable object that will pass as props to the lightbox (optional)
                                style: {
                                    backgroundBlur: "light", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
                                }
                            });

                        }}>Embed, trykk for å vise ({a.src})</Text>
                    )
                }
            }

        }
        catch (error) {
            console.log(error);
        }

        if (node.name == "img") {

            //console.log(node);

            try {
                
                var linkSrc = node.attribs.src;

                if(typeof node.attribs["data-image-url-large"] !== "undefined") linkSrc = node.attribs["data-image-url-large"];

                if(typeof node.attribs.width !== "undefined")
                {
                    var frameW = Number(node.attribs.width);
                }
                else
                {
                    var frameW = maxWidth;
                }

                if(typeof node.attribs.height !== "undefined")
                {
                    var frameH = Number(node.attribs.height);
                }
                else {
                    var frameH = maxWidth;
                }

                var factor = frameW / maxWidth;

                if (factor > 1) {
                    var width = Math.round(frameW / factor);
                    var height = Math.round(frameH / factor);
                }
                else {
                    var width = frameW;
                    var height = frameH;
                }

                return (
                    <Text key={index} style={{
                        width: width,
                        height: height + 20,
                        paddingTop: 20,
                        paddingBottom: 20,
                        marginBottom: 20
                    }}
                    onPress={
                        ()=>{
                            this.props.navigator.showLightBox({
                                screen: "glimmer.PopupEmbedViewer", // unique ID registered with Navigation.registerScreen
                                passProps: {uri:linkSrc}, // simple serializable object that will pass as props to the lightbox (optional)
                                style: {
                                    backgroundBlur: "light", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
                                }
                            });
                        }
                    }
                    >
                        {"\n"}<Image source={{uri: node.attribs.src}} resizeMode="contain"
                                     style={{width: width, height: height}}/>
                    </Text>
                );

            }
            catch (error) {
                console.log(error);
            }
        }


    }

    _handleLink(url) {

        console.log("Url pressed", url);

        if (url.includes("images.underskog.no")) {
            console.log("Bildelenke");
            Linking.openURL(url);
        }
        else if (url.includes("underskog.no/medlem/")) {
            Alert.alert("Dette er litt flaut...", "Lenker internt på Underskog er ikke implementert ennå");
            console.log("brukerlenke");
        }
        else if (url.includes("underskog.no/samtale/")) {
            Alert.alert("Dette er litt flaut...", "Lenker internt på Underskog er ikke implementert ennå");
            console.log("samtalelenke");
        }
        else if (url.includes("http") && url.includes("://")) {

            Linking.openURL(url);
        }
        else {
            Alert.alert("Jøsses.", "Dette er en lenketype Glimmer ikke kjenner igjen. Send gjerne @kvasbo en melding om hva du trykka på!");
            console.log("samtalelenke");
        }

    }

    render() {

        return (
            <HTMLView
                NodeComponent={Text}
                TextComponent={Text}
                RootComponent={View}
                paragraphBreak={"\n"}
                lineBreak={"\n"}
                value={this.parsed}
                stylesheet={styles}
                renderNode={this.renderNode}
                onLinkPress={(url) => this._handleLink(url)}
                onError={(err) => console.log(err)}
            />
        )
    }

}

ForumText.propTypes = {
    text: PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
    a: {
        fontWeight: '400',
        color: colors.COLOR_HIGHLIGHT,
    },

    p: {
        marginTop: 5,
        marginBottom: 5
    },

    blockquote: {
        padding: 20,
        borderWidth: 2,
        borderColor: "red"
    }

});