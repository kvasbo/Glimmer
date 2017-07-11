/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {StyleSheet, View, Text, Dimensions} from "react-native";
import HTMLView from "react-native-htmlview";
import * as colors from "../../Styles/colorConstants";

export default class ChatBubble extends React.Component {

    constructor(props) {
        super(props);

        this.fromMe = false;
        this.fromMe = (this.props.message.from_id === store.getState().AppStatus.activeUserId) ? true : false;
        
        this.alignBox = (this.fromMe) ? "flex-end" : "flex-start";
 
        console.log("In bubble", this.props.message, this.fromMe, this.alignBox);
    }

    componentDidMount() {

    }

    render() {

        let contentStyle = (this.fromMe) ? htmlViewStylesMe : htmlViewStylesThem;
        let contStyle = (this.fromMe) ? pageStyles.containerMe : pageStyles.containerThem;
        let fromStyle = (this.fromMe) ? pageStyles.boxFromMe : pageStyles.boxFromOther;
        let textStyle = (this.fromMe) ? pageStyles.textFromMe : pageStyles.textFromThem;

        return (
            <View style={[pageStyles.container, contStyle]}>
                <View style={[pageStyles.textBox, fromStyle]}>
                    <HTMLView
                        paragraphBreak=''
                        stylesheet={contentStyle}
                        value={this.props.message.body}
                        renderNode={this.renderNode}
                    />
                    <Text style={[pageStyles.time, textStyle]}>{helpers.getCalendarTime(this.props.message.sent_at)}</Text>
                </View>
            </View>
        );
    }
}

ChatBubble.propTypes = {
    message: PropTypes.object.isRequired
}

const pageStyles = StyleSheet.create({

    container: {
        margin: 10,
        marginTop: 5,
        marginBottom: 5,
        flex: 1,
        flexDirection: 'column',
    },

    containerMe: {
        alignItems: "flex-end",
        marginLeft: 80
    },

    containerThem: {
        alignItems: "flex-start",
        marginRight:  80
    },

    textBox: {
        borderRadius: 10,
        paddingTop: 7,
        paddingBottom: 5,
        paddingLeft: 8,
        paddingRight: 8,
        flex: 1
    },

    boxFromMe: {
        backgroundColor: colors.COLOR_GRAD1,
    },

    boxFromOther: {
        backgroundColor: colors.COLOR_LIGHT,
    },

    time: {
        fontSize: 11,
        marginTop: 3,
        marginRight: 2,
        marginLeft: 0,
        textAlign: "right",
    },

    textFromMe: {
        color: colors.COLOR_WHITE
    },

    textFromThem: {
        color: colors.COLOR_BLACK
    }

});

const htmlViewStylesThem = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: colors.COLOR_DARKGREY, // make links coloured pink
    },

    p: {
        color: colors.COLOR_BLACK
    }
});

const htmlViewStylesMe = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: colors.COLOR_LIGHTGREY, // make links coloured pink
    },

    p: {
        color: colors.COLOR_WHITE
    }
});