/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {Text} from "react-native";
import WriteNewPostOrComment from "./UXElements/WriteNewPostOrComment";

export default class PageNewForumPost extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        if (this.forumId === null) {
            return <Text>Intet forum valgt, noe er galt</Text>
        }
        else {
            return (
                <WriteNewPostOrComment type="post" navigator={this.props.navigator}/>
            );
        }

    }
}

PageNewForumPost.propTypes = {
    navigator: PropTypes.object.isRequired
}