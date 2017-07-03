/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import {StyleSheet, View, Text, Image, WebView, Linking} from 'react-native';
import HTMLView from 'react-native-htmlview';
import AutoHeightWebView from "react-native-autoheight-webview";

export default class ForumText extends React.Component {

    constructor(props)
    {
        super(props);
        this.renderNode = this.renderNode.bind(this);
    }

    wrapper = {

        start: "<html><head><style>" +
        ".skogspost {font-family: -apple-system, Roboto, sans-serif; padding-left: 0px !important; margin: 0px !important;}" +
        "img, iframe {max-width:100% !important; height: auto !important; clear: both !important}" +
        "div {max-width:100% !important; height: auto !important; padding-left: 0px !important;}" +
        "body {max-width:91% !important; height: auto !important; margin-left: 0px !important; padding: 0px !important;}" +
        "</style></head><body><div class='skogspost'>",
        end: "</div></body></html>",

        imageRemove: "<style>img {display: none !important;}</style>"

    }

    fixBody() {

        var cutLength = 75;

        var text = this.props.text;

        if (this.props.cut === true) {
            var tmp = text.split(" ");

            tmp = tmp.slice(0, cutLength);

            if (tmp.length == cutLength) {
                tmp.push("(...)");
            }

            text = tmp.join(" ");

        }

        text = this.replaceAll(text, 'href="//images', 'href="https://images');
        text = this.replaceAll(text, 'src="//images', 'src="https://images');

        // console.log(out);

        out = this.wrapper.start;

        if (this.props.images === false) {
            out += this.wrapper.imageRemove;
        }

        out += text;
        out += this.wrapper.end;

        return out;
    }

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    getTime(time) {
        return new moment(this.props.data.created_at).calendar();
    }

    renderNode(node, index, siblings, parent, defaultRenderer) {

        if (node.name == 'iframe') {

            const a = node.attribs;
            const iframeHtml = `<iframe src="${a.src}"></iframe>`;
            return (
                <Text key={index}>Åpne innlegget for å se iFrame</Text>
            );
        }

        if (this.props.images == false && node.name == 'img') {
             return null;
        }

    }

    render() {

        var postBody = this.fixBody();

        if(this.props.webview)
        {
            return (
                <AutoHeightWebView
                    enableAnimation={false}
                    source={{html: postBody}}
                    //onHeightUpdated={height => console.log(height)}
                    style={{margin: 0, padding: 0, borderWidth: 0, flex: 1}}
                />
            );
        }
        else {

            return(
                <HTMLView
                    value={postBody}
                    stylesheet={styles}
                    renderNode={this.renderNode}
                />
            )
        }
    }

}

const styles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
});