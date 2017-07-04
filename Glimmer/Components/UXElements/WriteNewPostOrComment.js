/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
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

export default class WriteNewPostOrComment extends React.Component {

    /*

     props:

     type: "comment"; "post"
     postId: null (for new post), postId(for comment)
     forum: null (for comment), forumid (for new post)

     */

    constructor(props) {
        super(props);
        this.state = {text: '', images: {}, bodyCursorPosition: null};

    }

    _clear() {
        console.log("Clear comment");
    }

    _post() {

        if (this.state.text !== "") {
            let text = this.parseAndReplaceImages(this.state.text);
        }
        else {
            Alert.alert(
                'Skjerpings',
                'Tom kommentar? Trist og uproft.');
            return false;
        }

        //Post a new comment
        if (this.props.type === "comment") {
            arbeidsMaur.forumUpdater.postCommentInThread(text, this.props.postId).then((data) => {

                this.setState({text: ""});

            }).catch((error) => {
                Alert.alert("Noe gikk galt :(");
            });

        }

    }

    parseAndReplaceImages(text) {
        return text;
    }

    addPictures() {

        ImagePicker.launchImageLibrary(imagePickerOptions, (response) => {

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
                tmpImages[fileName] = {orig_uri: response.uri, uri: null, done: false}

                this.setState({images: tmpImages});

                //Upload
                firebaseApp.storage()
                .ref('/postImages/' + fileName)
                .putFile(response.origURL)
                .then(uploadedFile => {

                    let imageList = this.state.images;
                    imageList[fileName] = {orig_uri: response.uri, uri: uploadedFile.downloadUrl, done: true};

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

    //To put a loading indicator on top of pictures while they are uploading. Mr fancypants I am indeed. 
    getLoadingIndicator(loading) {
        if (loading) {
            return (<View style={{backgroundColor: "#FFFFFF66", height: 75, width: 75, padding: 20}}><ActivityIndicator size="large" color="#444444" hidesWhenStopped={true}/></View>)
        }
    }

    insertIntoBodyText(text) {

        //We have not yet started writing
        if (this.state.bodyCursorPosition === null && this.state.text === "") this.setState({text: text});

        var tmpText = this.state.text;

        var start = tmpText.substring(0, this.state.bodyCursorPosition);

        var tail = tmpText.substring(this.state.bodyCursorPosition, tmpText.length);

        this.setState({text: start + text + tail});

    }

    cursormoved(event) {
        this.setState({bodyCursorPosition: event.nativeEvent.selection.start});
        console.log(event.nativeEvent.selection);
    }

    _hideMe() {

    }

    getImageList() {
        var outImg = [];

        for (key in this.state.images) {
            outImg.push(
                <View key={key} style={{justifyContent: 'flex-start', margin: 10}}>
                    <TouchableOpacity onPress={() => this.insertIntoBodyText("!" + this.state.images[key].uri + "!")}>
                        <Image key={Math.random()} source={{uri: this.state.images[key].orig_uri}}
                               style={{height: 75, width: 75, margin: 5, borderRadius: 0}}>
                            {this.getLoadingIndicator(!this.state.images[key].done)}
                        </Image>
                    </TouchableOpacity>
                </View>
            )
        }

        return outImg;

    }

    /*
     <View style={{
     justifyContent: "center",
     alignItems: "center",
     backgroundColor: "#00000055",
     padding: 5,
     margin: 5,
     width: 25,
     height: 25,
     borderRadius: 10
     }}><Text style={{color: "#FFFFFF", fontSize: 15, fontWeight: "200"}}>1</Text></View>

     */

    render() {

        var title = "Ny kommentar til " + this.props.title;

        return (


            <View style={pageStyles.container}>

                <View style={{marginTop: 22}}>
                    <View>

                        <View><Text>{this.props.title}</Text></View>

                        <View style={pageStyles.imageViewer}>
                            {this.getImageList()}
                        </View>

                        <View>

                            <TextInput
                                style={pageStyles.textInput}
                                autoCapitalize="sentences"
                                autoFocus={false}
                                onChangeText={(text) => this.setState({text: text})}
                                onSelectionChange={(event) => this.cursormoved(event)}
                                value={this.state.text}
                                multiline={true}
                                placeholder="Skriv ny kommentar"
                                placeholderTextColor="#888888"

                            />

                        </View>

                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <Button onPress={() => this._clear()} title="Tøm"/>
                            <Button onPress={() => this.addPictures()} title="Bilder"/>
                            <Button onPress={() => this._hideMe()} title="Gjem"/>
                            <Button onPress={() => this._post()} title="Send"/>
                        </View>

                    </View>
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
    imageViewer: {}

});