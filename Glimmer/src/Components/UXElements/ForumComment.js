/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {StyleSheet, View} from "react-native";
import ForumText from "./ForumText.js";
import GiKudos from "./GiKudos";
import VisKudos from "./VisKudos";
import CommentMetadata from "./CommentMetadata";
import * as colors from "../../Styles/colorConstants";

var s = require('../Styles');

export default class ForumComment extends React.Component {

    byMe = false;

    constructor(props) {
        super(props);

        if (this.props.data.creator_id === store.getState().AppStatus.activeUserId) {
            this.byMe = true;
        }
    }

    getKudosSection() {
        if (this.byMe) {

            var kudos = [];

            if (typeof this.props.data.kudos.from !== "undefined") {
                kudos = this.props.data.kudos.from;
            }

            return (<VisKudos kudos={kudos}/>)
        }
        else {
            var given = false;
            if (typeof(this.props.data.kudos.given) !== "undefined" && this.props.data.kudos.given) given = true;
            return (<GiKudos id={this.props.data.id} type="comment" given={given}/>)
        }
    }

    render() {

        return (
            <View style={pageStyles.container}>

                <View>
                    <CommentMetadata name={this.props.data.creator_name} time={this.props.data.created_at} image={this.props.data.creator_image}/>
                </View>

                <View style={pageStyles.comment}>
                    <ForumText webview={true} cut={false} text={this.props.data.body}/>
                </View>
                <View style={{flexDirection: "row", margin: 10, marginTop: 5, padding: 0}}>
                    {this.getKudosSection()}
                </View>
            </View>
        )

    }

}

ForumComment.propTypes = {
    data: PropTypes.object.isRequired
}

const pageStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.COLOR_WHITE,
        padding: 10,

        paddingBottom: 5,
        marginBottom: 2,
        marginTop: 2,
        flex: 1
    },
    comment: {
        padding: 10,
        paddingTop: 10,
        marginRight: 10,
    }
});