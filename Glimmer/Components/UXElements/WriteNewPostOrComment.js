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
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
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
     forum: null (for comment), forumid (for new post)

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

            }).catch((error) => {
                Alert.alert("Noe gikk galt :(");
            });

        }

    }

    textChanged(text) {

        this.setState({text: text});
        AsyncStorage.setItem(this.itemKey+"_text", text);
    }

    titleChanged(text) {

        this.setState({title: text});
        AsyncStorage.setItem(this.itemKey+"_title", text);
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

    _getTitleBox()
    {
        if(this.props.type === "post")
        {
            return ( <TextInput
                style={[InputStyles.textBox, {height: 50}]}
                autoCapitalize="sentences"
                autoFocus={false}
                onChangeText={(text) => this.titleChanged(text)}
                value={this.state.title}
                multiline={false}
                placeholder="Tittel"
                placeholderTextColor={colors.COLOR_DARKGREY}

            />)
        }
    }

    render() {

        var title = "???";

        if(this.props.type === "comment")
        {
            title = "Ny kommentar til " + this.props.title;
        }
        else if(this.props.type === "post")
        {
            title = "Ny post";
        }

        return (

            <View style={pageStyles.container}>

                <View style={{marginTop: 22}}>
                    <View>

                        <View style={pageStyles.imageViewer}>
                            {this.getImageList()}
                        </View>

                        <View>

                            <TextInput
                                style={[InputStyles.textBox, {height: 250}]}
                                autoCapitalize="sentences"
                                autoFocus={false}
                                onChangeText={(text) => this.textChanged(text)}
                                onSelectionChange={(event) => this.cursormoved(event)}
                                value={this.state.text}
                                multiline={true}
                                placeholder="Hva har du på hjertet?"
                                placeholderTextColor={colors.COLOR_DARKGREY}

                            />

                        </View>

                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <Button onPress={() => this._clear()} title="Tøm" onLongPress={() => this.clear(true)}/>
                            <Button onPress={() => this.addPictures()} title="Bilder"/>
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
        backgroundColor: colors.COLOR_LIGHT,
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
        backgroundColor: colors.COLOR_WHITE
    },
    imageViewer: {
        backgroundColor: colors.COLOR_LIGHT,
        minHeight: 15,
    }

});