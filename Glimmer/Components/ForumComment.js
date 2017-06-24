/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import ForumText from "./ForumText.js";
import {Card, Divider} from "react-native-elements";

var s = require('./Styles');

//https://github.com/jsdf/react-native-htmlview

class CommentMetadata extends React.Component {

    constructor(props) {
        super(props);
    }

    getTime() {
        return new moment(this.props.data.created_at).calendar();
    }

    styles = StyleSheet.create({
        element: {
            margin: 0,
            marginRight: 6,
        }
    })

    render() {

        return (
            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 3}}>
                <Image
                    style={[this.styles.element, {width: 30, height: 30}]}
                    source={{uri: this.props.data.creator.image_url}}
                />
                <Text style={this.styles.element}>{this.props.data.creator.name}</Text>
                <Text style={this.styles.element}>{this.getTime()}</Text>
            </View>
        )

    }

}

export default class ForumComment extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Card>
                <CommentMetadata data={this.props.data}/>
                <Divider/>
                <ForumText cut={false} text={this.props.data.body}/>
            </Card>
        )

    }

}