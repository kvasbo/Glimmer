/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";

import AutoHeightWebView from "react-native-autoheight-webview";

export default class ForumText extends React.Component {

    wrapper = {

        start: "<html><head><style>" +
        ".skogspost {font-family: -apple-system, Roboto, sans-serif; padding-left: 0px; margin: 0px;}" +
        "img, iframe {max-width:100% !important; height: auto !important;}" +
        "div {max-width:90% !important; height: auto !important; padding-left: 0px !important;}" +
        "body {max-width:100% !important; height: auto !important; margin-left: 0px !important; padding-left: 0px !important;}" +
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

    render() {

        var postBody = this.fixBody();

        return (
            <AutoHeightWebView
                enableAnimation={false}
                animationDuration={255}
                source={{html: postBody}}
                //onHeightUpdated={height => console.log(height)}
                style={{margin: 0, padding: 0, borderWidth: 0, flex: 1}}
            />
        );
    }

}