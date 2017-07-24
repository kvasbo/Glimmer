/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {Alert, Dimensions, Linking, Platform, StyleSheet, Text, View, WebView} from "react-native";
import textile from "textile-js";
import HTMLView from "react-native-htmlview";
import GlimmerImage from "./GlimmerImage";
import * as colors from "../../Styles/colorConstants";
import {REGEX_LINK_THREAD, REGEX_TEXTILE_INTERNAL_IMAGE,REGEX_VALID_URL} from "../../constants";

const baseImageUrl = "https://images.underskog.no/versions/1250/XXXXX.jpeg";

export default class ForumTextTextile extends React.Component {

    constructor(props) {
        super(props);

        this.dim = Dimensions.get("window");

        this.parsed = this.parseText();//textile.parse(this.props.text);

    }

    //http://regexr.com
    //Regex bilde: (!bilde [0-9]*!)
    //regex lenke: (\"(.*?)\"\:[a-z:/.0-9-#]*)

    parseText() {

        var text = this.props.text;
        var outArray = [];

        //Newline før og etter bilde

        text = text.replace(REGEX_TEXTILE_INTERNAL_IMAGE, (match) => {
            return "\n" + match + "\n";
        })

        //Splitte ved newline
        var textArray = text.split(/\r?\n/);

        //Fjern tomme avsnitt
        textArray = textArray.filter((x) => {
            return x !== ""
        });

        //Loope og parse
        for (key in textArray) {
            var tmp = textArray[key];

            if (REGEX_TEXTILE_INTERNAL_IMAGE.test(tmp)) {
                //Bytte ut underskogs-bildekode
                tmp = tmp.replace(REGEX_TEXTILE_INTERNAL_IMAGE, (match) => {
                    let arr = match.split(" ");
                    let nr = arr[1].substring(0, arr[1].length - 1);
                    let url = baseImageUrl.replace("XXXXX", nr);
                    return nr;
                });

                outArray.push({type: "img", data: tmp});

            }
            //else if()
            else if (tmp.indexOf("> ") === 0) //BQ
            {
                outArray.push({type: "bq", data: tmp.substring(2)});
            }
            else if (tmp.indexOf("bq. ") === 0) //BQ
            {
                outArray.push({type: "bq", data: tmp.substring(3)});
            }
            else {
                outArray.push({type: "txt", data: tmp});
            }

        }

        var mergedArray = [];

        for(let i = 0; i < outArray.length; i++)
        {
            if(typeof(outArray[i+1]) !== "undefined" && outArray[i].type == "txt" && outArray[i+1].type == "txt")
            {
                outArray[i+1].data = outArray[i].data + "\n" + outArray[i+1].data;
            }
            else
            {
                mergedArray.push(outArray[i]);
            }
        }

        for(let i = 0; i < mergedArray.length; i++)
        {
            if(mergedArray[i].type === "txt")
            {
                mergedArray[i].data = textile.parse(mergedArray[i].data);
            }
        }

        //console.log("outArray", outArray, "merged array", mergedArray);

        return mergedArray;

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

    //renderNode(node, index, siblings, parent, defaultRenderer) {
    renderNode(node, index, siblings, parent, defaultRenderer) {

        const Dim = Dimensions.get("window");
        var maxWidth = Dim.width - 50;

        try {
            if (node.name == 'img') {

                if(REGEX_VALID_URL.test(node.attribs.src))
                {
                    {defaultRenderer(node, parent)}
                }
                else {
                    return null;
                }
            }
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
                        <Text key={index} style={{color: colors.COLOR_HIGHLIGHT}} onPress={() => {

                            this.props.navigator.showLightBox({
                                screen: "glimmer.PopupEmbedViewer", // unique ID registered with Navigation.registerScreen
                                passProps: {uri: a.src}, // simple serializable object that will pass as props to the lightbox (optional)
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
        else if (url.search(REGEX_LINK_THREAD) !== -1) {

            var id = null;

            url.replace(/[0-9]+/, (match) => {
                id = match;
            });

            arbeidsMaur.forumGetter.getPost(id).then((data) => {

                console.log("post", data);

                this.props.navigator.push({
                    screen: 'glimmer.PageThread',
                    title: data.title,
                    passProps: {post: data}
                })
            }).catch((err) => {
                console.log(err);
            })

        }
        else if (url.includes("http") && url.includes("://")) {

            Linking.openURL(url);
        }
        else {
            Alert.alert("Jøsses.", "Dette er en lenketype Glimmer ikke kjenner igjen. Send gjerne @kvasbo en melding om hva du trykka på!");
            console.log("samtalelenke");
        }

    }

    getContent() {

        outArray = [];

        for (key in this.parsed) {
            var node = this.parsed[key];

            if (node.type === "txt") {
                outArray.push(
                    <HTMLView
                        style={styles.paragraph}
                        key={key}
                        NodeComponent={Text}
                        TextComponent={Text}
                        RootComponent={View}
                        value={node.data}
                        stylesheet={styles}
                        renderNode={this.renderNode}
                        onLinkPress={(url) => this._handleLink(url)}
                        onError={(err) => console.log(err)}
                    />
                )
            }
            else if (node.type === "bq") {
                outArray.push(
                    <HTMLView
                        style={styles.bq}
                        key={key}
                        NodeComponent={Text}
                        TextComponent={Text}
                        RootComponent={View}
                        value={node.data}
                        stylesheet={styles}
                        renderNode={this.renderNode}
                        onLinkPress={(url) => this._handleLink(url)}
                        onError={(err) => console.log(err)}
                    />
                )
            }
            else if (node.type === "img") {
                outArray.push(
                    <GlimmerImage style={styles.paragraph} key={key} id={node.data}/>
                )
            }
        }

        return outArray;

    }

    render() {

        return (
            <View >
                {this.getContent()}
            </View>
        )
    }

}

ForumTextTextile.propTypes = {
    text: PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
    paragraph: {
        marginTop: 3,
        marginBottom: 3
    },

    bq: {
        marginTop: 3,
        marginBottom: 3,
        marginLeft: 5,
        paddingLeft: 5,
        borderLeftWidth: 3,
        borderLeftColor: colors.COLOR_LIGHTGREY
    }
});