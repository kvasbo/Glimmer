/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";

export default class PageForumList extends React.Component {

    constructor(props) {
        super(props);

        this.forumsRef = firebaseApp.database().ref("forums/list");
        this.state = {filterText: "", loading: true, forums: []};
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    static navigatorButtons = {
        rightButtons: [
            {
                title: 'Lukk', // for a textual button, provide the button title (label)
                id: 'close', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
            }
        ]
    };

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                break;
            case 'didAppear':
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                break;
        }

        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'close') { // this is the same id field from the static navigatorButtons definition
                this.props.navigator.dismissAllModals();
            }
        }
    }


    componentWillMount() {
        this.listenForForums(this.forumsRef);
    }

    componentWillUnmount() {
        this.forumsRef.off();
    }

    //Connect to Firebase
    listenForForums(forumsRef) {

        forumsRef.on('value', (snap) => {

            this.setState({
                forums: snap.val(),
                loading: false
            });

        });
    }

    getFilteredForumList() {

        var arr = this.state.forums.sort((x,y)=>{
            return x.title.trim().localeCompare(y.title.trim());
        });

        if (this.state.filterText === "") {
            return arr;
        }
        else {

            return arr.filter((forum) => {
                return forum.title.toLocaleLowerCase().indexOf(this.state.filterText.toLocaleLowerCase()) !== -1;
            })

        }
    }

    render() {

        return (
            <View style={{flex: 1, paddingTop: 0}}>

                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, padding: 5, paddingLeft: 10, paddingRight: 10}}
                    onChangeText={(text) => this.setState({filterText: text})}
                    value={this.state.text}
                />

                <FlatList style={pageStyles.container}
                          data={this.getFilteredForumList()}
                          keyExtractor={(item, index) => item.id}
                          renderItem={({item}) => <Forum forum={item}></Forum>}
                >

                </FlatList>
            </View>
        );
    }
}

class Forum extends React.Component {

    styles = new StyleSheet.create({

        forumContainer: {
            height: 20,
            margin: 5,
            padding: 5,

        },

        forumText: {
            color: "#FFFFFF",
        }

    });

    render() {

        return (
            <TouchableOpacity onPress={()=>{console.log(this.props.forum.id)}}>
                <View style={this.styles.forumContainer}>
                    <Text style={this.styles.forumText}>{this.props.forum.title}</Text>
                </View>
            </TouchableOpacity>
        )

    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333333',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
});
