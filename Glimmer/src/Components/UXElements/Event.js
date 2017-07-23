/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {StyleSheet, View} from "react-native";
import KudosAndCommentsAndStuff from "./KudosAndCommentsAndStuff";
import ForumTextTextile from "./ForumTextTextile.js";
import CommentMetadata from "./CommentMetadata";
import * as colors from "../../Styles/colorConstants";

export default class Event extends React.Component {

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

        return (

            <View style={pageStyles.container}>

                <View style={pageStyles.creatorInfo}>

                </View>

                <View style={pageStyles.thePost}>
                    <ForumTextTextile cut={false} text={this.props.data.body_textile} navigator={this.props.navigator} images={true}
                               style={{marginBottom: 10}}/>
                </View>

                <View style={pageStyles.metaData}>
                    <View style={{flexDirection: "row"}}>



                    </View>
                </View>

            </View>
        );
    }

}

/*
 <KudosAndCommentsAndStuff showCommentBadge={false}
 navigator={this.props.navigator} post={this.props.data}
 byMe={this.byMe}/>
 */

/*
 <CommentMetadata image={this.props.data.creator_image} name={this.props.data.creator_name}
 time={this.props.data.created_at} forum={this.props.data.forum_title}/>
 */

Event.propTypes = {

    data: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,

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