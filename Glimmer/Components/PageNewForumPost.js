/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {AsyncStorage, Button, ScrollView, StyleSheet, TextInput, View} from "react-native";

export default class PageNewForumPost extends React.Component {

    itemKey;

    constructor(props) {
        super(props);
        this.state = {text: ""}
        itemKey = "@TmpPost:" + this.props.type + ":" + this.props.id;
    }

    componentDidMount() {

        //Get cached item if it's there
        AsyncStorage.getItem(itemKey, (err, result) => {
            if (!err && result !== null) {
                this.setState({text: result});
            }
        })

    }

    postMessage() {

        if(this.props.type = "comment")
        {
            console.log("Posting comment in thread", this.props.id, this.state.text);
        }

        var postBody = {"comment": {"body": this.state.text}};

        //TODO Fix!
        var url = "/posts/"+202176+"/comments";

        api.makeApiPostCall(url, {}, postBody).then((data) => {
            console.log("Post success", data);
        }).catch((err)=>{
            console.log("Post error", err)
        });

    }

    textChanged(text) {

        this.setState({text: text});

       // console.log(itemKey, text);

        AsyncStorage.setItem(itemKey, text);

    }

    render() {

        return (
            <ScrollView style={pageStyles.container}>

                <TextInput
                    style={pageStyles.input}
                    onChangeText={(text) => this.textChanged(text)}
                    value={this.state.text}
                    autoFocus={true}
                    multiline={true}
                />

                <View style={pageStyles.buttons}>
                    <Button title="Send" onPress={() => this.postMessage()}/>
                    <Button title="Gjem" onPress={() => this.props.navigator.dismissModal()}/>
                </View>
            </ScrollView>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCCCCC',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },

    buttons: {
        flex: 1,
    },

    input: {
        padding: 10,
        flex: 4,
        height: 40,
        borderColor: '#CCCCCC',
        borderWidth: 1
    }

});