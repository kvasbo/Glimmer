/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {StyleSheet, Text, View} from "react-native";
import KudosAndCommentsAndStuff from "./KudosAndCommentsAndStuff";
import ForumText from "./ForumText.js";
import * as colors from "../../Styles/colorConstants"

var s = require('../Styles');

export default class ThreadForumPost extends React.Component {

    byMe = false;

    constructor(props) {

        super(props);
        this.state = {};

        try {
            if (this.props.data.creator.id === auth.currentUser.id) {
                this.byMe = true;
            }
        }
        catch(err)
        {
            console.log("error parsing", this.props);
        }

    }

    componentDidMount() {

    }

    getTime(time) {
        return new moment(this.props.data.created_at).calendar();
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
                    <ForumText webview={true} cut={false} text={this.props.data.body} images={true}
                               style={{marginBottom: 10}}/>
                </View>

                <View style={pageStyles.metaData}>
                    <View style={{flexDirection: "row"}}>

                        <KudosAndCommentsAndStuff showCommentBadge={false}
                                                  navigator={this.props.navigator} post={this.props.data} byMe={this.byMe} />

                    </View>
                </View>

            </View>
        );
    }

}

const pageStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.COLOR_WHITE, padding: 0, marginBottom: 2,
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