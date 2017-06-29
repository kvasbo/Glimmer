/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {ScrollView, StyleSheet, Text, Button} from "react-native";
//Get common list styles
const listStyles = require('../Styles/ListStyles');


export default class PageAbout extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <ScrollView style={pageStyles.container}>
                <Text style={listStyles.listSubtitle}>Glimmer lages av kvasbo. For gøy.</Text>
                <Text style={listStyles.listSubtitle}>Hvis det er noe som ikke virker, send meg en PM.</Text>
                <Text style={listStyles.listSubtitle}>Glenn, Trist og Uproft, Alt er Trash, Hawk. Sånn.</Text>
                <Button title="Lukk" onPress={() => {
                    this.props.navigator.dismissModal();
                }}/>
            </ScrollView>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECF0F1',
        padding: 10,
    },
});