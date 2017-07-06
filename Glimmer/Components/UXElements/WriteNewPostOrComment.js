/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {
    ActivityIndicator,
    Alert,
    AsyncStorage,
    Button,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView
} from "react-native";
import InputStyles from "../../Styles/InputStyles";
import * as colors from "../../Styles/colorConstants";
const ImagePicker = require('react-native-image-picker');
const TextStyles = require("../../Styles/TextStyles");

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

     */

    itemKey; //To store in async storage.

    constructor(props) {

        super(props);

        //Set key for storing the temp data.
        if (this.props.type === "comment") {
            this.itemKey = "@tmp_comment_" + this.postId;
        }
        else if (this.props.type === "post") {
            this.ItemKey = "@tmp_newPost";
        }
        else {
            this.itemKey = "@trash"
        }

        this.state = {text: '', title: '', tags: [], images: {}, bodyCursorPosition: null};

        console.log("Writer props", this.props);

    }

    _clear(force) {

        if (force) {
            this._doClear();
        }

        else {
            Alert.alert("Sikker", "Dette kan ikke angres",
                [
                    {
                        text: 'Nei',
                    },
                    {
                        text: 'Ja', onPress: () => {
                        this._doClear();

                    }
                    }],
            )
        }
    }

    _doClear() {
        AsyncStorage.setItem(this.itemKey + "_text", "");
        AsyncStorage.setItem(this.itemKey + "_title", "");
        this.setState({text: "", title: "", tags: []});
    }

    _post() {

        if (this.props.type === "comment") {

            var text = "";
            if (this.state.text !== "") {
                var text = this.parseAndReplaceImages(this.state.text);
            }
            else {
                Alert.alert(
                    'Trist og uproft',
                    'Kommentaren din er tom.');
                return false;
            }

            //Post a new comment

            arbeidsMaur.forumUpdater.postCommentInThread(text, this.props.postId).then((data) => {

                this._doClear();
                this.props.navigator.pop();

            }).catch((error) => {
                Alert.alert("Noe gikk galt :(");
                console.log(error);
            });

        }
        else if (this.props.type === "post") {
            var forumId = store.getState().AppStatus.activePostingForum;

            var body = ""
            if (this.state.text !== "" && this.state.title !== "") {
                body = this.parseAndReplaceImages(this.state.text);
            }
            else {
                Alert.alert(
                    'Trist og uproft',
                    'Kommentaren eller tittelen din er tom.');
                return false;
            }

            //Post a new comment

            arbeidsMaur.forumUpdater.postNewThread(forumId, this.state.title, body, []).then((data) => {

                this._doClear();
                this.arbeidsMaur.forumUpdater.loadFirstStream(1);
                this.props.navigator.popToRoot();

            }).catch((error) => {
                Alert.alert("Noe gikk galt :(");
                console.log(error);
            });

        }

    }

    textChanged(text) {

        this.setState({text: text});
        AsyncStorage.setItem(this.itemKey + "_text", text);
    }

    titleChanged(text) {

        this.setState({title: text});
        AsyncStorage.setItem(this.itemKey + "_title", text);
    }

    parseAndReplaceImages(text) {
        return text;
    }

    addPictures() {

        ImagePicker.launchImageLibrary(imagePickerOptions, (response) => {

            //console.log('Response = ', response);

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

                    //console.log(imageList);

                    this.setState({images: imageList});

                    //console.log("Uploaded", uploadedFile);
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
            return (<View style={{backgroundColor: "#FFFFFF66", height: 75, width: 75, padding: 20}}><ActivityIndicator
                size="large" color="#444444" hidesWhenStopped={true}/></View>)
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

    _getTitleBox() {
        if (this.props.type === "post") {
            return ( <View style={{height: 60}}><TextInput
                style={[InputStyles.textBox, {height: 75}]}
                autoCapitalize="sentences"
                autoFocus={false}
                onChangeText={(text) => this.titleChanged(text)}
                value={this.state.title}
                multiline={false}
                placeholder="Tittel"
                placeholderTextColor={colors.COLOR_DARKGREY}

            /></View>)
        }
    }

    getImageView() {

        if (Object.values(this.state.images).length > 0) {
            return (
                <View style={pageStyles.imageViewer}>
                    <ScrollView>
                        {this.getImageList()}
                    </ScrollView>
                </View>
            )
        }

    }

    render() {

        var title = "???";

        if (this.props.type === "comment") {
            title = "Ny kommentar til " + this.props.title;
        }
        else if (this.props.type === "post") {
            title = "Ny post";
        }

        return (

            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={64} style={pageStyles.container}>

                {this._getTitleBox()}

                <View style={{flex: 1}}>

                    <TextInput
                        textAlignVertical="top"
                        style={[InputStyles.textBox, {flex: 1, margin: 0}]}
                        autoCapitalize="sentences"
                        autoFocus={false}
                        onChangeText={(text) => this.textChanged(text)}
                        onSelectionChange={(event) => this.cursormoved(event)}
                        value={this.state.text}
                        multiline={true}
                        placeholder="Hva har du på hjertet?"
                        placeholderTextColor={colors.COLOR_LIGHTGREY}
                    />

                </View>

                {this.getImageView()}

                <View style={{
                    height: 60,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 20
                }}>
                    <Button onPress={() => this._clear()} title="Tøm" onLongPress={() => this.clear(true)}/>
                    <Button onPress={() => this.addPictures()} title="Bilder"/>
                    <Button onPress={() => this._post()} title="Send"/>
                </View>

            </KeyboardAvoidingView>


        )

    }

}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.COLOR_LIGHT,
        padding: 0,
        margin: 0,
    },
    imageViewer: {
        backgroundColor: colors.COLOR_LIGHT,
        height: 100
    }

});