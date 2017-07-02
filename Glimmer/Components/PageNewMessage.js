/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Button, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";

export default class PageNewMessage extends React.Component {


    constructor(props) {
        super(props);
        this.state = {text: null, receivers: []};

    }

    componentDidMount() {

        this.setState({receivers:store.getState().MessageRecipients});

        //Listen to state changes. This really needs to change at some later point.
        this.reduxUnsubscribe = store.subscribe(() => {

                var tmpRec = store.getState().MessageRecipients;

                if (tmpRec !== this.state.receivers) {
                    this.setState({receivers: tmpRec});
                }
            }
        )
    }

    componentWillUnmount() {
        this.reduxUnsubscribe();
    }

    _onTextChange(text) {
        this.setState({text: text});
    }

    render() {

        return (
            <ScrollView style={pageStyles.container}>

                <View style={pageStyles.mottakere}>

                    <Text>Mottakere</Text>

                    <View style={pageStyles.faceList}/>

                </View>

                <TextInput multiline={true} style={pageStyles.textInput}
                           onChangeText={(text) => this._onTextChange(text)}/>

                <Button title="Avbryt" onPress={() => {
                    console.log("Avbryt melding")
                }}/>
                <Button title="Send" onPress={() => {
                    console.log("Sende melding")
                }}/>


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
    },
    mottakere: {

    }

});