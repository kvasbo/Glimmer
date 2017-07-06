/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {setActivePostingForum} from "../Redux/actions";
import * as colors from "../Styles/colorConstants";

export default class PageForumList extends React.Component {

    reduxUnsubscribe = null;

    constructor(props) {
        super(props);

        this.forumsRef = firebaseApp.database().ref("forums");
        this.state = {
            filterText: "",
            loading: true,
            forums: [],
            chosenForum: store.getState().AppStatus.activePostingForum,
            chosenForumName: null,
            chosenForumBody: null,
            mushUsedForums: [],
            showAllForums: false,
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    static navigatorButtons = {
        rightButtons: [
            {
                title: 'Skriv', // for a textual button, provide the button title (label)
                id: 'skriv', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
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
            if (event.id == 'skriv') { // this is the same id field from the static navigatorButtons definition

                this.props.navigator.push({
                    screen: 'glimmer.PageNewForumPost', // unique ID registered with Navigation.registerScreen
                    title: "Skriv", // navigation bar title of the pushed screen (optional)
                    animated: true, // does the push have transition animation or does it happen immediately (optional)
                });

            }
        }
    }

    componentWillMount() {

        this.listenForForums(this.forumsRef);

        this.setState({chosenForum: store.getState().AppStatus.activePostingForum});

        //Listen to state changes. This really needs to change at some later point.
        this.reduxUnsubscribe = store.subscribe(() => {

                var newForum = store.getState().AppStatus.activePostingForum;

                if (newForum !== this.state.chosenForum) {
                    this.setState({chosenForum: newForum});

                    arbeidsMaur.forumListUpdater.getForumInfo(newForum).then((data) => {
                        this.setState({chosenForumName: data.title, chosenForumBody: data.body});
                    });

                }

            }
        )
    }

    componentWillUnmount() {
        this.reduxUnsubscribe();
        this.forumsRef.off();
    }

    //Connect to Firebase
    listenForForums(forumsRef) {

        forumsRef.on('value', (snap) => {

            var forums = snap.val();

            if (typeof(forums.list) !== "undefined" && typeof(forums.muchused) !== "undefined") {
                this.setState({
                    forums: forums.list,
                    muchUsedForums: forums.muchused,
                    loading: false
                });

                console.log("State set from db", this.state.forums, this.state.muchUsedForums, this.state.selectedForum);

            }

        });

    }

    getFilteredForumList() {

        var arr = this.state.forums;

        if (!this.state.showAllForums) {
            var muchUsed = []; //= this.state.muchUsedForums;
            //Lag array av mye brukte
            for (key in this.state.muchUsedForums) {
                muchUsed.push(this.state.muchUsedForums[key]);
            }
        }

        arr = arr.filter((x) => {

            if (x == null) return false;

            //Filtrer hvis vi skal dét.
            if (!this.state.showAllForums) {
                if (!muchUsed.includes(x.id)) return false;
            }

            return true

        });

        arr.sort((x, y) => {
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

    _getChosenForumInfo() {

        if (this.state.chosenForum === null) {
            return "Intet forum valgt"
        }

        else {
            return this.state.chosenForumName;
        }

    }

    render() {

        return (
            <View style={{flex: 1}}>

                <View style={{flex: 1}}>
                    <Text>Valgt forum</Text>
                    <Text>{this._getChosenForumInfo()}</Text>
                </View>

                <View style={{flex: 6, paddingTop: 0}}>

                    <TextInput
                        style={{
                            height: 40,
                            borderColor: 'gray',
                            borderWidth: 1,
                            padding: 5,
                            paddingLeft: 10,
                            paddingRight: 10
                        }}
                        onChangeText={(text) => this.setState({filterText: text})}
                        value={this.state.text}
                        placeholder="Filtrér"
                    />

                    <FlatList style={pageStyles.container}
                              data={this.getFilteredForumList()}
                              keyExtractor={(item, index) => item.id}
                              renderItem={({item}) => <Forum forum={item}></Forum>}
                    >

                    </FlatList>
                </View>

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
            <TouchableOpacity onPress={() => {
                store.dispatch(setActivePostingForum(this.props.forum.id));
            }}>
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
        backgroundColor: colors.COLOR_DARKGREY,
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
});
