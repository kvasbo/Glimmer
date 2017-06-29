/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Badge} from "react-native-elements";

import ForumText from "./ForumText.js";

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

export default class ThreadForumPost extends React.Component {

    constructor(props) {

        super(props);
        this.state = {};

    }

    componentDidMount() {

    }

    getTime(time) {
        return new moment(this.props.data.created_at).calendar();
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

                <Text style={pageStyles.creatorInfo}>{creator}, {this.getTime()}. {this.props.data.forum.title}.</Text>

                <View style={pageStyles.thePost}>
                    <ForumText cut={false} text={this.props.data.body} images={true}
                               style={{marginBottom: 10}}/>
                </View>

                <View style={this.metaData}>
                    {this.getMetadataSection()}
                </View>

            </View>
        );
    }

}

const pageStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF', padding: 0, marginBottom: 2,
    },
    title: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
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