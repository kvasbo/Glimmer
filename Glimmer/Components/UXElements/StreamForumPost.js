/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {StyleSheet, Text, View, Image} from "react-native";
import {Badge} from "react-native-elements";

import ForumText from "./ForumText.js";

var DomParser = require('react-native-html-parser').DOMParser

var s = require('../Styles');

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

            var body = "<html></html>";

            if (typeof(this.props.data.body) !== "undefined") {
                body = this.props.data.body;
            }

            let doc = new DomParser().parseFromString(body, 'text/html');

            var images = doc.getElementsByTagName('img');

            for (var i = 0; i <= 1; i++) {
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

        } catch (err) {
            console.log(err);
        }

        return imgOut;

    }

    getFirstImage() {

        if (this.images.length === 0) return null;

        else {
            return <View style={pageStyles.image}><Image style={{flex:1}} source={{uri: this.images[0].src}} /></View>;
        }

    }

    getMetadataSection() {
        if (this.props.metaData === false) {
            return null;
        }
        else {
            return (

                <View style={{flexDirection: "row"}}>

                    <MetaDataFirstPost showThreadButton={this.props.showThreadButton}
                                       navigator={this.props.navigator} post={this.props.data}/>

                </View>

            )
        }
    }

    render() {

        var creator = null;
        if (typeof this.props.data.creator !== "undefined") {
            creator = this.props.data.creator.name;
        }

        return (

            <View style={pageStyles.container}>

                <Text style={pageStyles.title}>{this.props.data.title}</Text>

                {this.getFirstImage()}

                <Text style={pageStyles.creatorInfo}>{creator}, {this.getTime()}. {this.props.data.forum.title}.</Text>

                <View style={pageStyles.thePost}>
                    <ForumText cut={this.props.cut} text={this.props.data.body} images={this.props.images}
                               style={{marginBottom: 10}}/>
                </View>

                <View style={pageStyles.metaData}>
                    {this.getMetadataSection()}
                </View>

            </View>
        );
    }

}

const pageStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAFA', padding: 0, marginBottom: 10, marginTop: 10, flex: 1
    },
    title: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        fontSize: 20,
        fontWeight: "600",
    },
    image: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 0,
        marginRight: 0,
        height: 120,
    },
    creatorInfo: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    thePost: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    metaData: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    }

});