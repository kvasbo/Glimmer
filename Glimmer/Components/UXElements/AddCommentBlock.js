/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Alert, Button, StyleSheet, TextInput, View, Image, ActivityIndicator} from "react-native";
var ImagePicker = require('react-native-image-picker');

const imagePickerOptions = {
    title: 'Velg bilde',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
    mediaType: 'photo',
    maxWidth: '1200',
    maxHeight: '1200'

};

export default class AddCommentBlock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {text: '', images: {}};

    }

    _clear() {
        console.log("Clear comment");
    }

    _post() {
        if (this.state.text !== "") {

            arbeidsMaur.forumUpdater.postCommentInThread(this.state.text, this.props.postId).then((data) => {

                this.setState({text: ""});

            }).catch((error) => {
                Alert.alert("Noe gikk galt :(");
            });

        }
        else {
            Alert.alert(
                'Skjerpings',
                'Tom kommentar? Trist og uproft.',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false}
            )
        }
    }

    addPictures() {
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

                let fileName = Math.random() + response.fileName;

                //tmp state
                let tmpImages = this.state.images;
                tmpImages[fileName] = {orig_uri: response.uri, uri: null, uploaded: false}

                this.setState({images:tmpImages});

                //Upload
                firebaseApp.storage()
                .ref('/postImages/' + fileName)
                .putFile(response.origURL)
                .then(uploadedFile => {

                    let imageList = this.state.images;
                    imageList[fileName] = {orig_uri: response.uri, uri: uploadedFile.downloadUrl, uploaded: true};

                    console.log(imageList);

                    this.setState({images: imageList});

                    console.log("Uploaded", uploadedFile);
                })
                .catch(err => {
                    Alert.alert("Noe gikk galt med opplastingen. Pokker ta.", err)
                });

            }
        });
    }


    getLoadingIndicator(loading)
    {
        if(loading)
        {
            return <ActivityIndicator size="small" hidesWhenStopped={true}/>
        }
    }

    getImageList() {
        var outImg = [];



        for (key in this.state.images) {
            outImg.push(
                <View key={key}>
                    <Image key={Math.random()} source={{uri: this.state.images[key].orig_uri}} style={{height: 60, width: 60, margin: 5, borderRadius: 3}}>
                        {this.getLoadingIndicator(this.state.images[key].loading)}
                    </Image>
                </View>
            )
        }

        return outImg;

    }

    render() {

        var title = "Ny kommentar til " + this.props.title;

        return (
            <View style={pageStyles.container}>

                <View style={pageStyles.imageViewer}>
                    {this.getImageList()}
                </View>

                <View>

                    <TextInput
                        style={pageStyles.textInput}
                        autoCapitalize="sentences"
                        autoFocus={false}
                        onChangeText={(text) => this.setState({text: text})}
                        multiline={true}
                        placeholder="Skriv ny kommentar"
                        placeholderTextColor="#888888"

                    />


                </View>

                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Button onPress={() => this._clear()} title="Tøm"/>
                    <Button onPress={() => this.addPictures()} title="Bilder"/>
                    <Button onPress={() => this._post()} title="Send"/>
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
        height: 150,
        borderWidth: 0,
        backgroundColor: "#ECF0F1"
    },
    imageViewer: {

    }

});