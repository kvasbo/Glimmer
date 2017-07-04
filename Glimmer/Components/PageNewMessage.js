/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Alert, Button, ScrollView, StyleSheet, TextInput, View, Text} from "react-native";
import PersonFace from "./UXElements/PersonFace";
import {clearMessageRecipients} from "../Redux/actions";

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

        if(this.state.receivers.length === 0)
        {
            return (<Text style={{margin: 10, color: "white"}}>Ingen mottakere valgt. Skal du sende til ingen du da?</Text>)
        }

        for (let key in this.state.receivers) {

            var userId = this.state.receivers[key]

            //We have the user info!

            if (typeof(users[userId]) !== "undefined") {

                out.push(<PersonFace key={key} person={users[userId]} active={true}></PersonFace>);

            }
        }

        return out;

    }

    sendMessage() {
        if (this.state.text != "" && this.state.receivers.length > 0) {
            let sending = [];

            for (key in this.state.receivers) {
                sending.push(arbeidsMaur.messageUpdater.sendMessageToUser(this.state.receivers[key], this.state.text));
            }

            Promise.all(sending).then(() => {
                Alert.alert("Hurra", "Alle meldingene er sendt!");
                this.props.navigator.popToRoot();
            })

        }
        else {
            Alert.alert("Hoppsann", "Ingen mottakere, eller tom melding.");
        }
    }

    _cancelMessage()
    {
        store.dispatch(clearMessageRecipients());
        this.props.navigator.popToRoot();
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

                <View style={{flexDirection:"row", justifyContent:"space-around"}}>

                    <Button title="Avbryt" onPress={() => {

                        Alert.alert("Avbryt", "Vil du avbryte? Meldingen går tapt.", [
                                {text: 'Nei', onPress: () => {}},
                                {text: 'Ja', onPress: () => this._cancelMessage()},
                            ],
                            { cancelable: false });

                    }}/>

                    <Button title="Send" onPress={() => {
                        this.sendMessage();
                    }}/>

                </View>


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
        margin: 0,
        fontSize: 15,
        padding: 15,
        paddingTop: 22,
        paddingBottom: 22,
        height: 250,
        borderRadius: 2
    },
    faceList: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    mottakere: {
        backgroundColor: "#666666",

    }

});