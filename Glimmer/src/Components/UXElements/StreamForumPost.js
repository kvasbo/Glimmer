/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import CommentMetadata from "./CommentMetadata";
import ForumText from "./ForumText.js";
import KudosAndCommentsAndStuff from "./KudosAndCommentsAndStuff";
import * as colors from "../../Styles/colorConstants";
var DomParser = require('xmldom').DOMParser;

export default class StreamForumPost extends React.Component {

    images = [];
    byMe = false;

    constructor(props) {

        super(props);
        this.state = {showText: false};

        try {
            if (this.props.data.creator_id === store.getState().AppStatus.activeUserId) {
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

    getTime() {
        return helpers.getCalendarTime(this.props.data.created_at);
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

        if (this.images.length === 0 || this.state.showText) return null;

        else {
            return <View style={pageStyles.image}><Image style={{flex: 1}} source={{uri: this.images[0].src}}/></View>;
        }

    }

    getTextSection() {
        if (this.state.showText) {
            return (
                <View style={pageStyles.thePost}>
                    <ForumText cut={false} text={this.props.data.body} images={true}
                               style={{flex: 1}}/>
                </View>
            )
        }
        else {
            return false;
        }
    }

    render() {

        var creator = null;
        if (typeof this.props.data.creator_name !== "undefined") {
            creator = this.props.data.creator_name;
        }

        return (

            <View style={pageStyles.container}>

                <TouchableOpacity
                    onPress={() => this.props.navigator.push({
                        screen: 'glimmer.PageThread',
                        title: this.props.data.title,
                        passProps: {post: this.props.data}
                    })}
                    onLongPress={() => this.setState({showText: !this.state.showText})}
                >
                    <View>

                        <View style={pageStyles.title}>
                            <Text style={pageStyles.titleText}>{this.props.data.title}</Text>
                        </View>

                        <CommentMetadata image={this.props.data.creator_image} name={this.props.data.creator_name}
                                         time={this.props.data.created_at} forum={this.props.data.forum_title}/>

                        {this.getFirstImage()}

                    </View>

                </TouchableOpacity>

                {this.getTextSection()}

                <View style={pageStyles.metaDataBox}>

                    <View style={pageStyles.metaData}>
                        <View style={{flexDirection: "row"}}>

                            <KudosAndCommentsAndStuff showCommentBadge={true}
                                                      navigator={this.props.navigator} post={this.props.data}
                                                      byMe={this.byMe}/>

                        </View>
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
        marginTop: 5,
        flex: 1,
    },
    title: {
        marginTop: 12,
        marginBottom: 0,
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 0,
        paddingBottom: 0,
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
        color: colors.COLOR_BLACK,
    },
    creatorInfo: {
        margin: 0,
        marginLeft: 15,
        marginRight: 15,
        color: colors.COLOR_MIDGREY,
    },
    image: {
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 0,
        marginRight: 0,
        height: 120,
    },

    metaDataBox: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 5,
    },
    metaData: {
        flex: 1,
        justifyContent: "space-between",
        margin: 0,
    },
    thePost: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
    }

});
