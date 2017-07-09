/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {StyleSheet, View} from "react-native";
import KudosAndCommentsAndStuff from "./KudosAndCommentsAndStuff";
import ForumText from "./ForumText.js";
import CommentMetadata from "./CommentMetadata";
import * as colors from "../../Styles/colorConstants";

export default class ThreadForumPost extends React.Component {

    byMe = false;

    constructor(props) {

        super(props);
        this.state = {};

        try {
            if (this.props.data.creator_id === store.getState().AppStatus.activeUserId) {
                this.byMe = true;
            }
        }
        catch (err) {
            console.log("error parsing", this.props);
        }

    }

    componentDidMount() {

    }

    getTime() {
        return helpers.getCalendarTime(this.props.data.created_at);
    }

    render() {

        var creator = null;
        if (typeof this.props.data.creator_name !== "undefined") {
            creator = this.props.data.creator_name;
        }

        return (

            <View style={pageStyles.container}>

                <View style={pageStyles.creatorInfo}>
                    <CommentMetadata image={this.props.data.creator_image} name={this.props.data.creator_name}
                                     time={this.props.data.created_at} forum={this.props.data.forum_title}/>
                </View>

                <View style={pageStyles.thePost}>
                    <ForumText webview={true} cut={false} text={this.props.data.body} images={true}
                               style={{marginBottom: 10}}/>
                </View>

                <View style={pageStyles.metaData}>
                    <View style={{flexDirection: "row"}}>

                        <KudosAndCommentsAndStuff showCommentBadge={false}
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
        marginBottom: 2,
        borderBottomWidth: 5,
        borderBottomColor: colors.COLOR_GRAD2

    },
    creatorInfo: {
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 15,
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