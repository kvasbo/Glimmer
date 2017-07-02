/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View, Alert} from "react-native";
import {Badge} from "react-native-elements";
import GiKudos from "./GiKudos";
import ForumText from "./ForumText.js";
import VisKudos from "./VisKudos";
import KudosAndCommentsAndStuff from "./KudosAndCommentsAndStuff";
//const CachedImage = require('react-native-cached-image');
var DomParser = require('react-native-html-parser').DOMParser

var s = require('../Styles');


export default class StreamForumPost extends React.Component {

    images = [];
    byMe = false;

    constructor(props) {

        super(props);
        this.state = {};

        if(this.props.data.creator.id === auth.currentUser.id)
        {
            this.byMe = true;
        }

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
            return <View style={pageStyles.image}><Image style={{flex: 1}} source={{uri: this.images[0].src}}/></View>;
        }

    }

    getMetadataSection() {

        return (

            <View style={{flexDirection: "row"}}>

                <KudosAndCommentsAndStuff showCommentBadge={true}
                                   navigator={this.props.navigator} post={this.props.data} byMe={this.byMe} />

            </View>

        )

    }

    render() {

        var creator = null;
        if (typeof this.props.data.creator !== "undefined") {
            creator = this.props.data.creator.name;
        }

        return (

            <View style={pageStyles.container}>

                <View style={pageStyles.title}>
                    <Text style={pageStyles.titleText}>{this.props.data.title}</Text>
                </View>

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
        backgroundColor: '#FFFFFF',
        padding: 0,
        marginBottom: 10,
        marginTop: 10,
        flex: 1
    },
    title: {
        marginTop: 10,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: "#2C3E50"
    },
    titleText: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        fontSize: 20,
        fontWeight: "400",
        color: "#ECF0F1"
    },
    image: {
        marginTop: 0,
        marginBottom: 10,
        marginLeft: 0,
        marginRight: 0,
        height: 120,
    },
    creatorInfo: {
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
    },
    thePost: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
    },
    metaData: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
    }

});