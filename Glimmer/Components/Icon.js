/**
 * Created by kvasbo on 31.05.2017.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Image
} from 'react-native';

export default class Icon extends React.Component {
    render() {
        return (
            <View>
                <Image source={this.getIcon()} style={{width: 25, height: 25, tintColor:this.getTint()}} />
            </View>
        );
    }

    getTint()
    {
        if(typeof(this.props.tint) === undefined) return "#444444";

        else return this.props.tint;

    }

    getIcon()
    {
        if(typeof(this.props.name) === "undefined" || this.props.name === null)
        {
            return this.icons.notfound;
        }

        else {
            if(typeof(this.icons[this.props.name]) !== "undefined")
            {
                return this.icons[this.props.name];
            }
            else
            {
                return this.icons.notfound;
            }
        }
    }

    icons = {
/*
        "home": require("./icons/home.png"),
        "grid": require("./icons/calendar.png"),
        "messages": require("./icons/chatbubbles.png"),
        "image":  require("./icons/image.png"),
        "activity":  require("./icons/earth.png"),
        "more": require("./icons/more.png"),
        "notification": require("./icons/ios7-bolt-outline.png"),
        "notfound": require("./icons/bug.png")
*/
    };

}

