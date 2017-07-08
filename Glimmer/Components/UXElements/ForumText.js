/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Alert, Dimensions, Image, Linking, StyleSheet, Text, View} from "react-native";
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

            //Avslutte rensinga.

            doc.normalize();

            var str = serializer.serializeToString(doc);

            //console.log(str);

            return str;

        } catch (err) {
            console.log(err);
            return "";
        }
    }

    fixBody() {

        var text = "";

        if (typeof(this.props.text) !== "undefined" && this.props.text !== null) {
            var text = this.props.text;
        }

        text = this.replaceAll(text, 'href="//images', 'href="https://images');
        text = this.replaceAll(text, 'src="//images', 'src="https://images');

        return text;
    }

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    renderNode(node, index, siblings, parent, defaultRenderer) {

        if (node.name == 'iframe') {

            const a = node.attribs;
            const iframeHtml = `<iframe src="${a.src}"></iframe>`;
            return (
                <Text key={index}>Åpne innlegget for å se iFrame</Text>
            );
        }

        if (node.name == 'img') {

            try {

                const Dim = Dimensions.get("window");

                var width = Dim.width - 30;

                return (
                    <Image key={index} resizeMode="contain" source={{uri: node.attribs.src}}
                           style={{width: width, height: width}}/>
                );
            }
            catch (err) {
                return null;
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
        else if (url.includes("http") && url.includes("://")){

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
                nodecomponent={View}
                paragraphBreak=''
                value={this.parsed}
                stylesheet={styles}
                renderNode={this.renderNode}
                onLinkPress={(url) => this._handleLink(url)}
            />
        )
    }

}

const styles = StyleSheet.create({
    a: {
        fontWeight: '400',
        color: colors.COLOR_HIGHLIGHT,
    },
    p: {}
});