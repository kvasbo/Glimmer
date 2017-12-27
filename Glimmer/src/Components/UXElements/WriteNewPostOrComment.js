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
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import PropTypes from "prop-types";
import InputStyles from "../../Styles/InputStyles";
import * as colors from "../../Styles/colorConstants";
const ImagePicker = require('react-native-image-picker');

export default class WriteNewPostOrComment extends React.Component {

    itemKey; //To store in async storage.

    constructor(props) {

        super(props);

        //Set key for storing the temp data.
        if (!this.props.edit && this.props.type === "comment") {
            this.itemKey = "@tmp_comment_" + this.props.postId;
        }
        else if (!this.props.edit && this.props.type === "post") {
            this.ItemKey = "@tmp_newPost";
        }
        else {
            this.itemKey = "@trash"
        }

        //get existing text if we are editing!
        var existingText = "";
        if (this.props.type === "comment" && this.props.edit) {
            existingText = this.props.existingText;
        }

        this.state = {
            text: existingText,
            title: '',
            forumName: "",
            tags: [],
            images: {},
            bodyCursorPosition: null,
            buttonsActive: true,
            timeRemaining: null,
            modalVisible: false,
            photos: []
        };

        this.tick = this.tick.bind(this);

        this._isMounted = false;

    }

    tick() {

        if (this._isMounted) {

            let now = new moment();
            let editEnd = new moment(this.props.comment.updated_at).add(14, "m");

            let diff = editEnd.diff(now, "s");

            this.setState({timeRemaining: diff});

            if (diff < 0) {
                this.setState({buttonsActive: false});
            }

        }
    }

    componentDidMount() {

        this._isMounted = true;

        //Countdown if edit
        if (this.props.edit) {
            this.interval = setInterval(this.tick, 1000);
        }

        //Only load previous edit if needed.
        if (!this.props.edit) {
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

        if (this.props.type === "post") {
            arbeidsMaur.forumListUpdater.getForumInfo(store.getState().AppStatus.activePostingForum).then((data) => {

                if (this._isMounted) {
                    this.setState({forumName: data.title});

                    this.props.navigator.setTitle({
                        title: "Post i " + data.title, // the new title of the screen as appears in the nav bar
                    });
                }

            })
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
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

        if (this._isMounted) {
            this.setState({text: "", title: "", tags: []});
        }
    }

    _post() {

        this.setState({buttonsActive: false});

        if (!this.props.edit && this.props.type === "comment") {

            var posttext = "";
            if (this.state.text !== "") {
                posttext = this.parseAndReplaceImages(this.state.text);
            }
            else {
                Alert.alert(
                    'Trist og uproft',
                    'Kommentaren din er tom.');
                if (this._isMounted) {
                    this.setState({buttonsActive: true});
                }
                return false;
            }

            //Post a new comment

            arbeidsMaur.forumUpdater.postCommentInThread(posttext, this.props.postId).then(() => {

                this._doClear();
                this.props.navigator.pop();

            }).catch((error) => {
                Alert.alert("Noe gikk galt :(");
                if (this._isMounted) {
                    this.setState({buttonsActive: true});
                }
                console.log(error);
            });

        }
        else if (this.props.edit && this.props.type === "comment") {

            var posttext = "";
            if (this.state.text !== "") {
                posttext = this.parseAndReplaceImages(this.state.text);
            }
            else {
                Alert.alert(
                    'Trist og uproft',
                    'Kommentaren din er tom. Det var den ikke før.');
                if (this._isMounted) {
                    this.setState({buttonsActive: true});
                }
                return false;
            }

            arbeidsMaur.forumUpdater.editPostComment(this.props.commentId, posttext).then(() => {

                this._doClear();
                this.props.navigator.pop();

            }).catch((error) => {
                Alert.alert("Noe gikk galt :(");
                if (this._isMounted) {
                    this.setState({buttonsActive: true});
                }
                console.log(error);
            });

        }
        else if (!this.props.edit && this.props.type === "post") {
            var forumId = store.getState().AppStatus.activePostingForum;

            var body = ""
            if (this.state.text !== "" && this.state.title !== "") {
                body = this.parseAndReplaceImages(this.state.text);
            }
            else {
                Alert.alert(
                    'Trist og uproft',
                    'Kommentaren eller tittelen din er tom.');
                if (this._isMounted) {
                    this.setState({buttonsActive: true});
                }
                return false;
            }

            //Post a new comment

            arbeidsMaur.forumUpdater.postNewThread(forumId, this.state.title, body, []).then(() => {

                this._doClear();
                arbeidsMaur.forumUpdater.loadFirstStream(1);
                if (this._isMounted) {
                    this.setState({buttonsActive: true});
                }
                this.props.navigator.popToRoot();

            }).catch((error) => {
                Alert.alert("Noe gikk galt :(");
                if (this._isMounted) {
                    this.setState({buttonsActive: true});
                }
                console.log(error);
            });

        }

    }

    textChanged(text) {

        if (this._isMounted) {
            this.setState({text: text});
        }
        AsyncStorage.setItem(this.itemKey + "_text", text);
    }

    titleChanged(text) {

        if (this._isMounted) {
            this.setState({title: text});
        }
        AsyncStorage.setItem(this.itemKey + "_title", text);
    }

    parseAndReplaceImages(text) {
        return text;
    }

    insertIntoBodyText(text) {

        //We have not yet started writing
        if (this.state.bodyCursorPosition === null && this.state.text === "") this.setState({text: text});

        var tmpText = this.state.text;
        var start = tmpText.substring(0, this.state.bodyCursorPosition);
        var tail = tmpText.substring(this.state.bodyCursorPosition, tmpText.length);
        if (this._isMounted) {
            this.setState({text: start + text + tail});
        }

    }

    cursormoved(event) {
        this.setState({bodyCursorPosition: event.nativeEvent.selection.start});
    }

    getImageListContent() {
        var outImg = [];

        for (let key in this.state.images) {
            outImg.push(
                <TouchableOpacity key={key} onPress={() => this.insertIntoBodyText("!" + this.state.images[key].uri + "!")}>
                    <View style={{justifyContent: 'flex-start', margin: 10, width: 75, height: 75}}>
                            <Image source={{uri: this.state.images[key].orig_uri}}
                                style={{height: 75, width: 75, position: 'absolute', top: 0, left: 0, borderRadius: 0}} />
                                {this.getLoadingIndicator(!this.state.images[key].done)}
                    </View>
                 </TouchableOpacity>
            )
        }
        return outImg;
    }

    getImageList() {
        return (
            <ScrollView horizontal={true} contentContainerStyle={{flexDirection: 'row'}}>
                {this.getImageListContent()}
            </ScrollView>    
        );
    }

       //To put a loading indicator on top of pictures while they are uploading. Mr fancypants I am indeed.
    getLoadingIndicator(loading) {
        if (loading) {
            return (
            <View style={{backgroundColor: "#FFFFFF66", position: 'absolute', top: 0, left: 0, height: 75, width: 75, padding: 20}}>
                <ActivityIndicator size="large" color="#444444" hidesWhenStopped={true}/>
            </View>
            )
        }
    }

    _getTimer() {
        if (!this.props.edit || this.state.timeRemaining === null) return null;

        if (this.state.timeRemaining < 0) {
            var outText = "For sent, du får ikke endre :("
        }
        else {

            let t = new moment(this.props.comment.updated_at);

            t.add(14, "m");

            let fromNow = t.fromNow(true);

            var outText = fromNow + " igjen før endringer låses";
        }

        return (
            <View style={{height: 30, alignItems: "center", justifyContent: "center"}}><Text>{outText}</Text></View>
        )

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

    _uploadAndAddPicture(pictureData) {

        //Hide modal
        this.setState({modalVisible: false});

        console.log("pictureData", pictureData)

        var metadata = {};

        try {

            metadata.uri = pictureData.uri;

            let filename = pictureData.fileName.toLowerCase();
            let filenameArr = filename.split(".");
            var extension = filenameArr.slice(-1)[0];

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

            metadata.fileName = new Date().getTime() + "_" + filename;

            let tmpImages = this.state.images;
            tmpImages[metadata.fileName] = {orig_uri: metadata.uri, uri: null, done: false}

            this.setState({images: tmpImages});

            //Upload
            firebase.storage()
            .ref('/postImages/' + metadata.fileName)
            .putFile(metadata.uri, metadata)
            .then(uploadedFile => {
                let imageList = this.state.images;
                imageList[metadata.fileName] = {orig_uri: metadata.uri, uri: uploadedFile.downloadURL, done: true};
                if (this._isMounted) {
                    this.setState({images: imageList});
                }
            })
            .catch(err => {
                Alert.alert("Noe gikk galt med opplastingen. Pokker ta.", err)
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    pickPictures() {

      const options = {
        title: 'Hvor skal vi finne et bilde?',
        cancelButtonTitle: 'Avbryt',
        takePhotoButtonTitle: 'Ta nytt',
        chooseFromLibraryButtonTitle: 'Velg fra bibliotek',
        mediaType: 'photo',
        maxWidth: 2000,
        maxHeight: 2000,
        quality: 0.85,
        noData: true,
        storageOptions: {
          skipBackup: false,
        }
      };

      ImagePicker.showImagePicker(options, (response) => {
        
        this._uploadAndAddPicture(response);

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
          let source = { uri: response.uri };
        }
      });

    }

    _getPictureButton() {

        return (
            <Button disabled={!this.state.buttonsActive} onPress={() => this.pickPictures()} title="Bilder"/>)
    }

    render() {

        return (

            <View style={pageStyles.container}>

            
                <KeyboardAvoidingView behavior="padding"
                                      keyboardVerticalOffset={helpers.getPlatformDependentVars().keyboardAvoidingOffset}
                                      style={{flex: 1}}>

                    {this._getTitleBox()}

                    {this._getTimer()}

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
                        <Button disabled={!this.state.buttonsActive} onPress={() => this._clear()} title="Tøm"
                                onLongPress={() => this.clear(true)}/>

                        {this._getPictureButton()}

                        <Button disabled={!this.state.buttonsActive} onPress={() => this._post()} title="Send"/>
                    </View>

                </KeyboardAvoidingView>

            </View>


        )

    }

}

WriteNewPostOrComment.defaultProps = {
    edit: false
}

WriteNewPostOrComment.propTypes = {

    type: PropTypes.oneOf(['comment', 'post']).isRequired,
    postId: PropTypes.number,
    navigator: PropTypes.object,
    title: PropTypes.string,
    edit: PropTypes.bool,
    existingText: PropTypes.string,
    existingTitle: PropTypes.string,
    commentId: PropTypes.number

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