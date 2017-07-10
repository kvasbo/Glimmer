/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {Alert, FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from "react-native";
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
            onlyMostUsed: true,
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

                if (store.getState().AppStatus.activePostingForum !== null) {
                    this.props.navigator.push({
                        screen: 'glimmer.PageNewForumPost', // unique ID registered with Navigation.registerScreen
                        title: "Nytt innlegg", // navigation bar title of the pushed screen (optional)
                        animated: true, // does the push have transition animation or does it happen immediately (optional)
                    });
                }
                else {
                    Alert.alert("Hoppsann", "Du må velge et forum å poste i.");
                }

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

                //console.log("State set from db", this.state.forums, this.state.muchUsedForums, this.state.selectedForum);

            }

        });

    }

    getFilteredForumList() {

        var arr = this.state.forums;

        if (this.state.onlyMostUsed) {
            var muchUsed = []; //= this.state.muchUsedForums;
            //Lag array av mye brukte
            for (let key in this.state.muchUsedForums) {
                muchUsed.push(this.state.muchUsedForums[key]);
            }
        }

        arr = arr.filter((x) => {

            if (x == null) return false;

            //Filtrer hvis vi skal dét.
            if (this.state.onlyMostUsed) {
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

                <View style={{height: 70, alignItems: "center", justifyContent: "center", margin: 0}}>
                    <Text style={{fontSize: 20}}>{this._getChosenForumInfo()}</Text>
                </View>

                <View style={{flex: 1, paddingTop: 0}}>

                    <View style={{flexDirection: "row", height: 50, backgroundColor: colors.COLOR_GRAD2}}>

                        <View style={{flex: 1, padding: 10, flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                                style={{
                                    height: 33,
                                    borderColor: colors.COLOR_LIGHT,
                                    color: colors.COLOR_DARKGREY,
                                    backgroundColor: colors.COLOR_WHITE,
                                    fontSize: 13,
                                    borderWidth: 1,
                                    padding: 5,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    margin: 0,
                                    flex: 1
                                }}
                                onChangeText={(text) => this.setState({filterText: text})}
                                value={this.state.text}
                                placeholder="Filtrér"
                            />
                        </View>

                        <View style={{
                            flex: 1,
                            padding: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around"
                        }}>

                            <Text style={{color: colors.COLOR_LIGHT, marginRight: 5}}>Kun velbrukte:</Text>

                            <Switch
                                onValueChange={(value) => this.setState({onlyMostUsed: value})}
                                value={this.state.onlyMostUsed}
                            />

                        </View>


                    </View>

                    <FlatList style={pageStyles.container}
                              data={this.getFilteredForumList()}
                              keyExtractor={(item, index) => item.id}
                              renderItem={({item}) => <Forum forum={item}></Forum>}
                    />

                </View>

            </View>

        );
    }
}

PageForumList.propTypes = {
    navigator: PropTypes.object.isRequired,
}

class Forum extends React.Component {

    styles = new StyleSheet.create({

        forumContainer: {
            height: 20,
            margin: 5,
            padding: 5,

        },

        forumText: {
            color: colors.COLOR_WHITE,
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

Forum.propTypes = {
    forum: PropTypes.object.isRequired
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
