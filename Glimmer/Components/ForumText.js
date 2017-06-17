/**
 * Created by kvasbo on 31.05.2017.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    WebView
} from 'react-native';
//import HTMLView from 'react-native-htmlview';
//import Dimensions from 'Dimensions';
import MyWebView from 'react-native-webview-autoheight';
import AutoHeightWebView from 'react-native-autoheight-webview';
//import HTML from 'react-native-render-html'

export default class ForumText extends React.Component {

    wrapper = {
        start: "<html><head><style>" +
        ".skogspost {font-family: -apple-system, Roboto, sans-serif; padding-left: 0px} .textile {padding-left: 0px; margin-left: 0px;}" +
        "img {max-width:80% !important; height: auto !important;}" +
        "</style></head><body><div class='skogspost'>",
        end: "</div></body></html>"
    }



    renderNode(node, index, siblings, parent, defaultRenderer) {

        if (node.name == 'iframe') {
            const a = node.attribs;
            const iframeHtml = `<iframe src="${a.src}"></iframe>`;
            return (
                <View key={index} style={{width: Number(a.width), height: Number(a.height)}}>
                    <WebView source={{html: iframeHtml}}/>
                </View>
            );
        }

        if (false && node.name == 'img') {

            const a = node.attribs;

            if(true)
            {
                return (
                    <Text style={{width: Number(1), height: Number(1)}} />
                )
            }

            const widthWeWant = 300;

            var width = 0;
            var height = 0;

            if (a.width < widthWeWant) {
                width = a.width;
                height = a.height;
            }
            else {
                width = widthWeWant;
                height = a.height * (widthWeWant / a.width);
            }

            return (

                    <Text key={index} source={{url: a.src}}
                           style={{width: Number(width), height: Number(height)}}/>

            )
        }

    }

    fixBody(body, cut) {
        var out = body;

        if (cut) {
            var tmp = out.split(" ");

            tmp = tmp.slice(0, 100);

            if (tmp.length > 99) {
                tmp.push("(...)");
            }

            out = tmp.join(" ");

        }

        out = this.replaceAll(out, 'href="//images', 'href="https://images');
        out = this.replaceAll(out, 'src="//images', 'src="https://images');

       
        out = this.wrapper.start + out + this.wrapper.end;



        return out;
    }

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    getTime(time) {
        return new moment(this.props.data.created_at).calendar();
    }

    render() {

        const styles = {
            h1: { backgroundColor: '#FF0000' },
            h2: { fontFamily: 'Arial' },
            img: { resizeMode: 'cover' }
        }

        const renderers = {
            img: (htmlAttribs, children, passProps) => {
                return (
                    <Image
                        source={{uri: htmlAttribs.src, width: 100, height: 100}}
                        style={passProps.htmlStyles.img}
                        {...passProps} />)
            }
        }

        var postBody = this.fixBody(this.props.text, this.props.cut);

        return (

            <View>
                <AutoHeightWebView
                    enableAnimation={true}
                    animationDuration={255}
                    source={{ html: postBody}}
                    //onHeightUpdated={height => console.log(height)}
                    heightOffset={5}
                    />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    }
});

/*
 <HTMLView
 value={postBody}
 stylesheet={styles}
 renderNode={this.renderNode}
 />

 <HTML html={postBody} />

 <MyWebView
 source={{html: postBody}}
 startInLoadingState={true}
 />
 */