/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import ForumText from "./ForumText.js";
import KudosAndCommentsAndStuff from "./KudosAndCommentsAndStuff";
import * as colors from "../../Styles/colorConstants";
//const CachedImage = require('react-native-cached-image');
var DomParser = require('react-native-html-parser').DOMParser;

var s = require('../Styles');

export default class StreamForumPost extends React.Component {

    images = [];
    byMe = false;

    constructor(props) {

        super(props);
        this.state = {};

        try {
            if (this.props.data.creator.id === auth.currentUser.id) {
                this.byMe = true;
            }
        }
        catch (err) {
            console.log("error parsing", this.props);
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

                <View style={pageStyles.thePost}>
                    <ForumText cut={this.props.cut} text={this.props.data.body} images={this.props.images}
                               style={{marginBottom: 10}}/>
                </View>

                <Text style={pageStyles.creatorInfo}>{creator}, {this.getTime()}. {this.props.data.forum.title}.</Text>

                <View style={pageStyles.metaData}>
                    <View style={{flexDirection: "row"}}>

                        <KudosAndCommentsAndStuff showCommentBadge={true}
                                                  navigator={this.props.navigator} post={this.props.data}
                                                  byMe={this.byMe}/>

                    </View>
                </View>

            </View>
        );
    }

}

const pageStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.COLOR_WHITE,
        padding: 0,
        paddingTop: 5,
        paddingBottom: 15,
        marginBottom: 5,
        marginTop: 5,
        flex: 1,
    },
    title: {
        marginTop: 12,
        marginBottom: 0,
        marginLeft: 20,
        marginRight: 20,
        paddingTop: 0,
        paddingBottom: 5,
        backgroundColor: colors.COLOR_WHITE
    },
    titleText: {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        textAlign: "left",
        fontSize: 25,
        fontWeight: "300",
        color: colors.COLOR_DARKGREY,
    },
    image: {
        marginTop: 7,
        marginBottom: 10,
        marginLeft: 0,
        marginRight: 0,
        height: 120,
    },
    creatorInfo: {
        marginTop: 5,
        marginBottom: 7,
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
        marginTop: 7,
        marginBottom: 7,
        marginLeft: 20,
        marginRight: 20,
    }

});
