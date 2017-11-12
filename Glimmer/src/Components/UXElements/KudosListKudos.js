import React from "react";
import PropTypes from 'prop-types';
import {View, StyleSheet, Text, Image} from "react-native";
import * as colors from "../../Styles/colorConstants"
var striptags = require('striptags');

export default class KudosListKudos extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    getText() {
      return striptags(this.props.kudos.subjectLabel)
    }

    render() {

        return (
            <View style={pageStyles.container}>
              <Image style={{width: 60, height: 60}} source={{url: this.props.kudos.creatorImage}} />
              <View style={{flexDirection: 'column', flex: 1, marginLeft: 10}}>
                <Text>{this.props.kudos.creatorName}</Text>
                <Text>{this.props.kudos.createdAt.fromNow()}</Text>
                <Text numberOfLines={2} style={{color: '#666666'}}>{this.getText()}</Text>
              </View>
            </View>
        );
    }
}

KudosListKudos.propTypes = {

}

const pageStyles = StyleSheet.create({

    container: {
        backgroundColor: colors.COLOR_WHITE,
        padding: 5,
        flexDirection: 'row',
        margin: 0,
        flex: 1,
    },

});
