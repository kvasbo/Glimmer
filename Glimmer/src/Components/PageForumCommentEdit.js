/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {Text} from "react-native";
import WriteNewPostOrComment from "./UXElements/WriteNewPostOrComment";

export default class PageForumCommentEdit extends React.Component {

    constructor(props) {

        super(props);
    }

    render() {

        if (this.props.postId === null) {
            return <Text>Intet forum valgt, noe er galt</Text>
        }
        else {

            return (
                <WriteNewPostOrComment type="comment" edit={true} comment={this.props.comment} existingText={this.props.bodyTextile} commentId={this.props.commentId} navigator={this.props.navigator}/>
            );
        }
    }
}

PageForumCommentEdit.propTypes = {
    navigator: PropTypes.object.isRequired,
    commentId: PropTypes.number.isRequired,
    bodyTextile: PropTypes.string.isRequired
}