/**
 * Created by kvasbo on 31.05.2017.
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';

var DomParser = require('react-native-html-parser').DOMParser

import {Card, Icon, Badge, Divider} from 'react-native-elements'

import ForumText from './ForumText.js';

var s = require('./Styles');

//https://github.com/jsdf/react-native-htmlview

class MetaDataFirstPost extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var comText = "kommentar";

        if (this.props.comments !== 1) {
            comText = "kommentarer";
        }

        return (

            <View style={{flexDirection: "row"}}>

                <Badge
                    value={this.props.comments + " " + comText}
                    textStyle={{color: 'white'}}
                    containerStyle={{backgroundColor: 'orange', marginRight: 5}}
                />

                <Badge
                    value={"Gi kudos"}
                    textStyle={{color: 'white'}}
                    containerStyle={{backgroundColor: 'green'}}
                />

            </View>
        )

    }

}

export default class StreamForumPost extends React.Component {

    images = [];

    constructor(props) {

        super(props);
        this.state = {};

        this.images = this.getImages();

        //console.log(this.images);

    }

    componentDidMount() {
        //console.log(this.props.data);
    }

    getTime(time) {
        return new moment(this.props.data.created_at).calendar();
    }

    getImages() {

        var imgOut = [];

        try {
            let doc = new DomParser().parseFromString(this.props.data.body, 'text/html');

            var images = doc.getElementsByTagName('img');

            for (var i = 0; i < 1000; i++) {
                if (typeof(images[i]) !== "undefined") {
                    for (attr in images[i].attributes) {
                        if (images[i].attributes[attr].name === "src") {
                            var uri = "https:" + images[i].attributes[attr].value;
                            var image = {src: uri, id: null, width: null, height: null}
                            imgOut.push(image);
                        }

                    }
                }
                else {
                    break;
                }
            }

        }

        catch (err) {
            //console.log(err);
        }

        return imgOut;

    }

    getFirstImage() {
        if (this.images.length === 0) return null;

        else {
            return {uri: this.images[0].src};
        }

    }

    getMetadataSection() {
        if (this.props.metaData === false) {
            return null;
        }
        else {
            return (
                <View>
                    <Divider/>

                    <View style={{flexDirection: "row", marginTop: 10}}>

                        <MetaDataFirstPost comments={this.props.data.comment_count}
                                           forum={this.props.data.forum.title}/>

                    </View>
                </View>
            )
        }
    }

    render() {


        return (

            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('PageThread', {
                    post: this.props.data,
                    postId: this.props.data.id
                })}
            >
                <Card title={this.props.data.title} image={this.getFirstImage()}>
                    <Text>{this.props.data.creator.name}, {this.getTime()}. {this.props.data.forum.title}.</Text>

                    <ForumText cut={this.props.cut} text={this.props.data.body} images={this.props.images} style={{marginBottom: 10}}/>

                    {this.getMetadataSection()}

                </Card>
            </TouchableOpacity>

        );
    }

}

class Tag
    extends Component {

    render() {
        return (
            <View><Text>{this.props.tag}</Text></View>
        )
    }
}

class ViewUser extends Component {


}