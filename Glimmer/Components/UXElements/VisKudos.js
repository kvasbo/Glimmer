/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {StyleSheet, View} from "react-native";
import {Badge} from "react-native-elements";

export default class VisKudos extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    getKudosCount() {
        return this.props.kudos.length;
    }

    render() {

        return (
            <View style={pageStyles.container}>
                <Badge
                    value={this.getKudosCount() + " kudos"}
                    textStyle={{color: 'white'}}
                    containerStyle={{backgroundColor: 'red', marginRight: 5}}
                />
            </View>
        );
    }
}

const pageStyles = StyleSheet.create({

    container: {},

});