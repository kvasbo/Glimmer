/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {ScrollView, StyleSheet, View, TextInput, Text, TouchableOpacity, Button, Alert} from "react-native";

export default class PageNewMessage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {text: null}
    }

    componentDidMount() {

    }

    _onTextChange(text)
    {
        this.setState({text: text});
    }

    render() {

        return (
            <ScrollView style={pageStyles.container}>

                <Text>Mottakere</Text>

                <View style={pageStyles.faceList}>

                </View>

                <TextInput multiline={true} style={pageStyles.textInput} onChangeText={(text) => this._onTextChange(text)} />

                <Button title="Avbryt" onPress={() => {console.log("Avbryt melding")}} />
                <Button title="Send" onPress={() => {console.log("Sende melding")}} />


            </ScrollView>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECF0F1',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
    textInput: {
        backgroundColor: '#FFFFFF',
        margin: 10,
        flex: 5,
        height: 100,
    },
    faceList: {
        flex: 3,
    }
});