/**
 * Created by kvasbo on 31.05.2017.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    WebView,
    ScrollView
} from 'react-native';

export default class ForumPost extends React.Component {

    styles = StyleSheet.create({
        container: {
            backgroundColor: '#FFFFFF',
            paddingLeft: 20,
            paddingTop: 30,
            paddingBottom: 30,
            paddingRight: 30,
        },
    })

    constructor(props)
    {
        super(props);
        this.state = {};
    }

    componentDidMount()
    {
        console.log(this.props.data);
    }

    fixBody(body)
    {
        var out = body;

        //Add https to image links
        out = out.replace('href="//images', 'href="https://images');
        out = out.replace('src="//images', 'src="https://images');

        out = this.wrapper.start + out + this.wrapper.end;

        return out;
    }

    render() {

        var postBody = this.fixBody(this.props.data.body);

        console.log(postBody);

        return (
            <View style={this.styles.container}>
                <Text>{this.props.data.title}</Text>
                <Text>{this.props.data.creator.name}</Text>
                <Text>{this.props.data.created_at}</Text>
                <WebView
                    style={{
                        backgroundColor: "#FFFFFF",
                        height: 100,

                    }}
                    source={{html: postBody}}
                    scalesPageToFit={false}
                />

            </View>
        );
    }

    wrapper = {
        start: "<html><head><style>" +
            ".skogspost {font-family: -apple-system, Roboto, sans-serif; padding-left: 0px} .textile {padding-left: 0px; margin-left: 0px;}" +
        "img {width: 100px}" +
        "</style></head><body><div class='skogspost'>",
        end: "</div></body>"
    }

}

class Tag extends Component {

    render() {
        return (
            <View><Text>{this.props.tag}</Text></View>
        )
    }
}

class ViewUser extends Component {



}