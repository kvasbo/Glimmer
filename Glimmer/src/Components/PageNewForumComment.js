/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {Text} from "react-native";
import WriteNewPostOrComment from "./UXElements/WriteNewPostOrComment";

export default class PageNewForumComment extends React.Component {

    constructor(props) {

        super(props);
    }

    render() {

        if (this.props.postId === null) {
            return <Text>Intet forum valgt, noe er galt</Text>
        }
        else {

            return (
                <WriteNewPostOrComment type="comment" postId={this.props.postId} navigator={this.props.navigator}/>
            );
        }
    }
}

PageNewForumComment.propTypes = {
    navigator: PropTypes.object.isRequired,
    postId: PropTypes.number.isRequired
}