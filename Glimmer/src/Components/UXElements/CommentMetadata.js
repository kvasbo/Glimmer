/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {Image, StyleSheet, Text, View} from "react-native";
import * as colors from "../../Styles/colorConstants";

export default class CommentMetadata extends React.Component {

    constructor(props) {
        super(props);
    }

    getTime() {
        return helpers.getCalendarTime(this.props.time);
    }

    styles = StyleSheet.create({
        element: {
            margin: 0,
            marginRight: 6,
        }
    })

    getForumTitle()
    {
        if(typeof this.props.forum === "undefined") return null;

        else
        {
            return (
                <Text style={[this.styles.element, {color: colors.COLOR_MIDGREY}]}>{this.props.forum}</Text>
            )
        }

    }

    render() {

        return (
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                marginLeft: 10,
                marginRight: 10,
                flex: 1
            }}>

                <Image
                    style={[this.styles.element, {width: 24, height: 24, borderRadius: 12}]}
                    source={{uri: this.props.image}}
                />

                <Text style={[this.styles.element, {color: colors.COLOR_MIDGREY}]}>{this.props.name}</Text>
                <Text style={[this.styles.element, {color: colors.COLOR_MIDGREY}]}>{this.getTime()}</Text>

                {this.getForumTitle()}

            </View>
        )

    }

}

CommentMetadata.defaultProps = {
    showImage: true
};

CommentMetadata.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    forum: PropTypes.string,
    showImage: PropTypes.bool
};

