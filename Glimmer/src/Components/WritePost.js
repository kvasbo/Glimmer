/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {StyleSheet} from "react-native";

export default class WritePost extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <View style={pageStyles.container}>
                <Text>Write post gdammit</Text>
            </View>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        backgroundColor: '#CCCCCC',
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
    },
});