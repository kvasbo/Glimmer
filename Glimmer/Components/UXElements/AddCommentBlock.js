/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {View, Text, StyleSheet, TextInput, Button, Alert, CameraRoll} from "react-native";

export default class AddCommentBlock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {text: '', pics: ''};
        this.storageRef = firebaseApp.storage().ref().child('images');;

    }

    _clear()
    {
        console.log("Clear comment");
    }

    _post()
    {
        if (this.state.text !== "") {

            arbeidsMaur.forumUpdater.postCommentInThread(this.state.text, this.props.postId).then((data) => {

                this.setState({text: ""});


            }).catch((error) => {
                Alert.alert("Noe gikk galt :(");
            });

        }
        else
        {
            Alert.alert(
                'Skjerpings',
                'Tom kommentar? Trist og uproft.',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
            )
        }
    }

    addPictures()
    {
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'All'
        })
        .then(r => {
            this.setState({ photos: r.edges })
            console.log("images",r);
        })
    }

    render() {

        var title = "Ny kommentar til "+ this.props.title;

        return (
            <View style={pageStyles.container}>

                <View>

                    <TextInput
                        style={pageStyles.textInput}
                        autoCapitalize="sentences"
                        autoFocus={false}
                        onChangeText={(text) => this.setState({text:text})}
                        multiline={true}
                        placeholder="Skriv ny kommentar"
                        placeholderTextColor="#888888"

                    />


                </View>

                <View style={{flexDirection: "row", justifyContent: "space-between",  alignItems: "center"}}>
                    <Button onPress={() => this._clear()} title="Tøm"/>
                    <Button onPress={() => this.addPictures()} title="Bilder"/>
                    <Button onPress={() => this._post()} title="Send" />
                </View>

            </View>
        )

    }

}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginBottom: 2,
        paddingTop: 8,
    },
    textInput: {
        marginLeft: 0,
        marginRight: 0,
        padding: 5,
        height: 100,
        borderWidth: 0,
        backgroundColor: "#ECF0F1"
    }

});