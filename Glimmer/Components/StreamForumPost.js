/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Text, View} from "react-native";
import {Badge, Card, Divider} from "react-native-elements";

import ForumText from "./ForumText.js";

var DomParser = require('react-native-html-parser').DOMParser

var s = require('./Styles');

//https://github.com/jsdf/react-native-htmlview

class MetaDataFirstPost extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var comText = "kommentar";

        if (this.props.post.comment_count !== 1) {
            comText = "kommentarer";
        }

        return (

            <View style={{flexDirection: "row"}}>

                <Badge
                    value={"Gi kudos"}
                    textStyle={{color: 'white'}}
                    containerStyle={{backgroundColor: 'green', marginRight: 5}}
                />

                <Badge
                    value={this.props.post.comment_count + " " + comText}
                    textStyle={{color: 'white'}}
                    containerStyle={{backgroundColor: 'orange'}}
                    onPress={() => this.props.navigator.push({
                        screen: 'glimmer.PageThread',
                        title: this.props.post.title,
                        passProps: {post: this.props.post}
                    })}
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

    }

    componentDidMount() {

    }

    getTime(time) {
        return new moment(this.props.data.created_at).calendar();
    }

    getImages() {

        var imgOut = [];

        try {

            // console.log("getImage", this.)

            var body = "<html></html>";

            if (typeof(this.props.data.body) !== "undefined") {
                body = this.props.data.body;
            }

            let doc = new DomParser().parseFromString(body, 'text/html');

            var images = doc.getElementsByTagName('img');

            for (var i = 0; i < 50; i++) {
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
            console.log(err);
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

                        <MetaDataFirstPost showThreadButton={this.props.showThreadButton}
                                           navigator={this.props.navigator} post={this.props.data}/>

                    </View>
                </View>
            )
        }
    }

    render() {


        return (

            <Card title={this.props.data.title} image={this.getFirstImage()}>
                <Text>{this.props.data.creator.name}, {this.getTime()}. {this.props.data.forum.title}.</Text>

                <ForumText cut={this.props.cut} text={this.props.data.body} images={this.props.images}
                           style={{marginBottom: 10}}/>

                {this.getMetadataSection()}

            </Card>
        );
    }

}