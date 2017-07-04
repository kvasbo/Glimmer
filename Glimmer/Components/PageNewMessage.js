/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Button, ScrollView, StyleSheet, Text, TextInput, View, Alert} from "react-native";
import PersonFace from "./UXElements/PersonFace";

export default class PageNewMessage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {text: null, receivers: []};

    }

    componentDidMount() {

        this.setState({receivers: store.getState().MessageRecipients.recipients});

        //Listen to state changes. This really needs to change at some later point.
        this.reduxUnsubscribe = store.subscribe(() => {

                var tmpRec = store.getState().MessageRecipients.recipients;

                if (tmpRec !== this.state.receivers) {
                    this.setState({receivers: tmpRec});
                }
            }
        )
    }

    getReceivers() {

        let out = [];

        let users = store.getState().User;

        for (key in this.state.receivers) {

            var userId = this.state.receivers[key]

            //We have the user info!

           if (typeof(users[userId]) !== "undefined") {

                out.push(<PersonFace key={key} person={users[userId]} active={true}></PersonFace>);

            }
        }

        return out;

    }

    sendMessage()
    {
        if(this.state.text != "" && this.state.receivers.length > 0)
        {
            let sending = [];

            for(key in this.state.receivers)
            {

                sending.push(arbeidsMaur.messageUpdater.sendMessageToUser(this.state.receivers[key], this.state.text));

            }

            Promise.all(sending).then(() => {
                Alert.alert("Hurra", "Alle meldingene er sendt!");
                This.props.navigator.pop();
            })



        }
        else {
            Alert.alert("Hoppsann", "Ingen mottakere, eller tom melding.");
        }
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

                    <View style={pageStyles.faceList}>
                        {this.getReceivers()}
                    </View>

                </View>

                <TextInput multiline={true} style={pageStyles.textInput}
                           onChangeText={(text) => this._onTextChange(text)}/>

                <Button title="Avbryt" onPress={() => {
                    console.log("Avbryt melding")
                }}/>
                <Button title="Send" onPress={() => {
                    this.sendMessage();
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

        height: 100,
    },
    faceList: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    mottakere: {
        backgroundColor: "#666666",

    }

});