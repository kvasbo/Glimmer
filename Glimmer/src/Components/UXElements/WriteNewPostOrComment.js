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
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import PropTypes from "prop-types";
import InputStyles from "../../Styles/InputStyles";
import * as colors from "../../Styles/colorConstants";
const ImagePicker = require('react-native-image-picker');

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


    itemKey; //To store in async storage.

    constructor(props) {

        super(props);

        //Set key for storing the temp data.
        if (this.props.type === "comment") {
            this.itemKey = "@tmp_comment_" + this.props.postId;
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

    componentWillMount() {

        AsyncStorage.getItem(this.itemKey + "_text").then((data) => {

            if (data !== null) {
                this.setState({text: data});
            }
        });

        AsyncStorage.getItem(this.itemKey + "_title").then((data) => {

            if (data !== null) {
                this.setState({title: data});
            }

        });

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

            var posttext = "";
            if (this.state.text !== "") {
                posttext = this.parseAndReplaceImages(this.state.text);
            }
            else {
                Alert.alert(
                    'Trist og uproft',
                    'Kommentaren din er tom.');
                return false;
            }

            //Post a new comment

            arbeidsMaur.forumUpdater.postCommentInThread(posttext, this.props.postId).then(() => {

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

            arbeidsMaur.forumUpdater.postNewThread(forumId, this.state.title, body, []).then(() => {

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

                //Check and set mimetype / rotation /metadata.
                //console.log('Response = ', response);

                var metadata = {};

                try {

                    let filename = response.fileName.toLowerCase();
                    let filenameArr = filename.split(".");
                    var extension = filenameArr.slice(-1)[0];

                    //console.log(filename, filenameArr, extension);

                    if (extension === "jpg" || extension === "jpeg") {
                        metadata.contentType = 'image/jpeg';
                    }
                    else if (extension === "png") {
                        metadata.contentType = 'image/png';
                    }
                    else if (extension === "gif") {
                        metadata.contentType = 'image/gif';
                    }
                    else if (extension === "webp") {
                        metadata.contentType = 'image/webp';
                    }
                }
                catch (err) {
                    console.log(err);
                }

                let fileName = (new Date().getTime() + "_" + response.fileName).toLowerCase();

                //tmp state
                let tmpImages = this.state.images;
                tmpImages[fileName] = {orig_uri: response.uri, uri: null, done: false}

                this.setState({images: tmpImages});

                //Upload
                firebaseApp.storage()
                .ref('/postImages/' + fileName)
                .putFile(response.origURL, metadata)
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
            return (
                <View style={{backgroundColor: "#FFFFFF66", height: 75, width: 75, padding: 20}}><ActivityIndicator
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

        for (let key in this.state.images) {
            outImg.push(
                <View key={key} style={{justifyContent: 'flex-start', margin: 10}}>
                    <TouchableOpacity
                        onPress={() => this.insertIntoBodyText("!" + this.state.images[key].uri + "!")}>
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

        return (

            <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={64} style={pageStyles.container}>

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
                    height: 50,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    padding: 3
                }}>
                    <Button onPress={() => this._clear()} title="Tøm" onLongPress={() => this.clear(true)}/>
                    <Button onPress={() => this.addPictures()} title="Bilder"/>
                    <Button onPress={() => this._post()} title="Send"/>
                </View>

            </KeyboardAvoidingView>


        )

    }

}

WriteNewPostOrComment.propTypes = {

    type: PropTypes.string.isRequired,
    postId: PropTypes.number,
    navigator: PropTypes.object,
    title: PropTypes.string

}



const
    pageStyles = StyleSheet.create({
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