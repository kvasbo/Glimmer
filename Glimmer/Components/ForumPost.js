/**
 * Created by kvasbo on 31.05.2017.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import HTMLView from 'react-native-htmlview';



//https://github.com/jsdf/react-native-htmlview

class MetaDataFirstPost extends React.Component {

    constructor(props)
    {
        super(props);
    }

    render () {

        return (
            <View>
                <Text>{this.props.comments} Kommentarer</Text>
                <Text>{this.props.forum}</Text>
                <Text></Text>
            </View>
        )

    }

}

export default class StreamForumPost extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {};
    }

    componentDidMount()
    {
        //console.log(this.props.data);
    }

    styles = StyleSheet.create({
        container: {
            backgroundColor: '#FFFFFF',
            paddingLeft: 20,
            paddingTop: 30,
            paddingBottom: 30,
            paddingRight: 30,
            marginTop: 0,
            marginBottom: 20,
        },
    })

    wrapper = {
        start: "<html><head><style>" +
        ".skogspost {font-family: -apple-system, Roboto, sans-serif; padding-left: 0px} .textile {padding-left: 0px; margin-left: 0px;}" +
        "img {width: 100px}" +
        "</style></head><body><div class='skogspost'>",
        end: "</div></body></html>"
    }

    fixBody(body, cut)
    {
        var out = body;

        //Add https to image links
        out = out.replace('href="//images', 'href="https://images');
        out = out.replace('src="//images', 'src="https://images');

        out = this.wrapper.start + out + this.wrapper.end;

        return out;
    }

    getTime(time)
    {
        return new moment(this.props.data.created_at).calendar();
    }

    render() {

        var postBody = this.fixBody(this.props.data.body, true);

        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Thread', { post: this.props.data, postId: this.props.data.id })}>
                <View style={this.styles.container}>
                    <Text style={{fontSize: 15}}>{this.props.data.title}</Text>
                    <Text>{this.props.data.creator.name}</Text>
                    <Text>{this.getTime()}</Text>
                    <HTMLView
                        value={postBody}
                        stylesheet={styles}
                    />
                    <MetaDataFirstPost comments={this.props.data.comment_count} forum={this.props.data.forum.title}/>
                </View>
            </TouchableOpacity>
        );
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

const styles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
    img: {
        maxWidth: 200
    }
});