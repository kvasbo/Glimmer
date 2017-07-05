/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import ForumText from "./ForumText.js";
import GiKudos from "./GiKudos";
import VisKudos from "./VisKudos";
import * as colors from "../../Styles/colorConstants"

var s = require('../Styles');

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
            <View style={{flexDirection: "row", alignItems: "center", marginLeft: 10, marginRight: 10, flex: 1}}>

                <Image
                    style={[this.styles.element, {width: 34, height: 34, borderRadius: 2}]}
                    source={{uri: this.props.data.creator.image_url}}
                />
                <Text style={this.styles.element}>{this.props.data.creator.name}</Text>
                <Text style={this.styles.element}>{this.getTime()}</Text>


            </View>
        )

    }

}

export default class ForumComment extends React.Component {

    byMe = false;

    constructor(props) {
        super(props);

        if (this.props.data.creator.id === auth.currentUser.id) {
            this.byMe = true;
        }

       // console.log("Comment", this.props.data, "By me;", this.byMe);

    }

    getKudosSection() {
        if (this.byMe) {

            var kudos = [];

            if(typeof this.props.data.kudos.from !== "undefined")
            {
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
                <CommentMetadata data={this.props.data}/>
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

const pageStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.COLOR_WHITE,
        padding: 0,
        paddingTop: 10,
        paddingBottom: 5,
        marginBottom: 2,
        marginTop: 2,
        flex: 1
    },
    comment: {
        padding: 10,
        paddingLeft: 13,
        paddingTop: 5,
        marginRight: 10,
    }
});