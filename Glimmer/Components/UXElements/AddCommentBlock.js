/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {View, Text, StyleSheet, TextInput, Button, Alert} from "react-native";
var ImagePicker = require('react-native-image-picker');


const imagePickerOptions = {
    title: 'Velg bilde',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class AddCommentBlock extends React.Component {



    constructor(props) {
        super(props);
        this.state = {text: '', pics: ''};

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
        ImagePicker.showImagePicker(imagePickerOptions, (response) => {



            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {

                storageRef = firebaseApp.storage().ref();

                let fileName = Math.random() + response.fileName;

                firebaseApp.storage()
                .ref('/images/'+fileName)
                .putFile(response.origURL)
                .then(uploadedFile => {
                    console.log("Uploaded");
                })
                .catch(err => {
                    console.log("file upload error");
                });

                /*

                let data = ''
                RNFetchBlob.fs.readStream(
                    // file path
                    response.origURL,
                    // encoding, should be one of `base64`, `utf8`, `ascii`
                    'base64',
                    // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
                    // when reading file in BASE64 encoding, buffer size must be multiples of 3.
                    4095)
                .then((ifstream) => {
                    ifstream.open()
                    ifstream.onData((chunk) => {
                        // when encoding is `ascii`, chunk will be an array contains numbers
                        // otherwise it will be a string
                        data += chunk
                    })
                    ifstream.onError((err) => {
                        console.log('oops', err)
                    })
                    ifstream.onEnd(() => {
                        console.log("File read!");

                        storageRef = firebaseApp.storage().ref();
                        var uploadTask = storageRef.child('images/'+fileName).putString(response.data, 'base64');


                    })})

                */

               /* let binData = RNFetchBlob.fs.readStream(source, 'base64', 4095).then((filedata)=>{

                    let fileName = Math.random() + response.fileName;

                    console.log(source,fileName,binData);


                });*/

                //var uploadTask = storageRef.child('images/'+response.fileName).putString(response.data, 'base64');

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                //this.setState({
                 //   avatarSource: source
                //});
            }
        });
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