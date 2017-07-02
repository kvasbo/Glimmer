/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {
    AsyncStorage,
    Alert,
    Button,
    KeyboardAvoidingView,
    Picker,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from "react-native";
const TextStyles = require("../Styles/TextStyles");

export default class PageNewForumPost extends React.Component {

    itemKey = "newPost";

    constructor(props) {
        super(props);
        this.state = {text: "", title: "", forums: [], muchUsedForums: [], showAllForums: false, selectedForum: 5};

        //Listen for forums
        this.forumsRef = firebaseApp.database().ref("forums/");

        itemKey = "@TmpPost:" + this.props.type + ":" + this.props.id;
    }

    componentDidMount() {

        //Get cached item if it's there
        AsyncStorage.getItem(itemKey+"_text", (err, result) => {
            if (!err && result !== null) {
                this.setState({text: result});
            }
        })

        //Attach to forum list
        this.listenForForums(this.forumsRef);

    }

    componentWillUnmount() {
        this.forumsRef.off();
    }

    //Connect to Firebase
    listenForForums(forumsRef) {

        forumsRef.on('value', (snap) => {

            var forums = snap.val();

            //console.log("Forums from db", forums)

            if (typeof(forums.list) !== "undefined" && typeof(forums.muchused) !== "undefined") {
                this.setState({
                    forums: forums.list,
                    muchUsedForums: forums.muchused,
                });

                console.log("State set from db", this.state.forums, this.state.muchUsedForums, this.state.selectedForum);

            }

        });
    }

    componentWillUnmount() {
        this.forumsRef.off();
    }

    postMessage() {

        if(this.state.title == "" || this.state.text == "")
        {
            Alert.alert("Ooops", "Du må skrive både en tittel og en tekst.");
        }

        var forum = this.state.selectedForum;

        if (this.state.selectedForum !== null && this.state.text !== "") {
           // console.log("Posting message");

            arbeidsMaur.forumUpdater.postNewThread(forum, this.state.title, this.state.text).then((data) => {
                //Håndtere at det gikk bra.
                console.log(data);
            }).catch((err) => {
                console.log(err);
            });

        }

    }

    textChanged(text) {

        this.setState({text: text});
        AsyncStorage.setItem(itemKey+"_text", text);
    }

    titleChanged(text) {

        this.setState({title: text});
        AsyncStorage.setItem(itemKey+"_title", text);
    }

    getForumList() {

        var out = [];

        var muchUsed = []; //= this.state.muchUsedForums;

        //Lag array av mye brukte
        for (key in this.state.muchUsedForums) {
            muchUsed.push(this.state.muchUsedForums[key]);
        }

        var tmpForums = this.state.forums;

        //clean list and remove filter if needed
        tmpForums = tmpForums.filter((item) => {

            if(item === null) return false; //Due to stupidity
            if(typeof(item.id) === "undefined" || typeof(item.title) === "undefined") return false;

            //Filtrer hvis vi skal dét.
            if(!this.state.showAllForums)
            {
                if(!muchUsed.includes(item.id)) return false;
            }

            return true;
            
        });

        //Sortér
        tmpForums.sort((x, y) => {
            return x.title.toLowerCase().localeCompare(y.title.toLowerCase());
        })

        //Lag elementjævlene
        for (key in tmpForums) {
            out.push(<Picker.Item label={tmpForums[key].title} key={tmpForums[key].id} value={tmpForums[key].id}/>);
        }

        return out;
    }

    render() {

        return (


            <ScrollView style={pageStyles.container}>


                <KeyboardAvoidingView behavior="position">

                    <View style={pageStyles.forumChooser}>
                        <Text style={TextStyles.uxTitle}>Velg forum</Text>
                        <View style={{flexDirection: "row", justifyContent: "center"}}>
                            <Switch
                                onValueChange={(value) => this.setState({showAllForums: value})}
                                value={this.state.showAllForums}
                            />
                            <Text style={TextStyles.uxExplain}>Vis alle</Text>
                        </View>
                        <Picker

                            selectedValue={this.state.selectedForum}
                            onValueChange={(itemValue, itemIndex) => this.setState({selectedForum: itemValue})}>
                            {this.getForumList()}
                        </Picker>
                    </View>

                    <TextInput
                        style={pageStyles.title}
                        onChangeText={(text) => this.titleChanged(text)}
                        value={this.state.title}
                        autoFocus={false}
                        multiline={false}
                        placeholder="Tittel"
                    />
                    <TextInput
                        style={pageStyles.input}
                        onChangeText={(text) => this.textChanged(text)}
                        value={this.state.text}
                        autoFocus={false}
                        multiline={true}
                        placeholder="Innlegg"
                    />

                    <View style={pageStyles.buttons}>
                        <Button title="Send" onPress={() => this.postMessage()}/>
                    </View>

                    <View style={{height: 30}}/>

                </KeyboardAvoidingView>


            </ScrollView>




        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
    buttons: {},
    title: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: "#CCCCCC",
        marginLeft: 5,
        marginRight: 5,
        height: 60,
    },
    input: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: "#CCCCCC",
        marginLeft: 5,
        marginRight: 5,
        height: 300,
    },
    forumChooser: {
        padding: 5,
        marginLeft: 10,
        marginRight: 10,
    }

});