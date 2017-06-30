/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {FlatList, StyleSheet, Text, TextInput, View, Animated} from "react-native";
import PersonFace from "./UXElements/PersonFace";

//TODO sort by status and then name

export default class PageKretsVelger extends React.Component {

    reduxUnsubscribe = null;

    constructor(props) {
        super(props);
        var tmpKrets = store.getState().Krets;
        this.state = {krets: store.getState().Krets, searchText: "", searchHits: [], performedSearches: []}
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

        switch (event.id) {
            case 'willAppear':
                if (__DEV__) {
                    console.log("Velgerprops", this.props);
                }
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
            if (event.id == "writeNewMessage") {
                this.props.navigator.push({
                    screen: 'glimmer.PageNewMessage', // unique ID registered with Navigation.registerScreen
                    title: "Skriv melding", // navigation bar title of the pushed screen (optional)
                    passProps: {}, // Object that will be passed as props to the pushed screen (optional)
                    animated: true, // does the push have transition animation or does it happen immediately (optional)
                });
            }
        }
    }

    componentDidMount() {

        this.setState({krets: store.getState().Krets});

        //Listen to state changes. This really needs to change at some later point.
        this.reduxUnsubscribe = store.subscribe(() => {

                var tmpKrets = store.getState().Krets;

                if (tmpKrets !== this.state.krets) {
                    this.setState({krets: tmpKrets});
                }
            }
        )

    }

    componentWillUnmount() {
        this.reduxUnsubscribe();
    }

    _renderItem = ({item}) => (

        <PersonFace key={item.person.id} person={item.person} navigator={this.props.navigator}/>

    )

    _renderItemSearch = ({item}) => (

        <PersonFace key={item.id} person={item} navigator={this.props.navigator}/>

    )

    _getDataArray() {

        var krets = Object.values(this.state.krets).sort((x, y) => {
            return x.person.name.toLowerCase().localeCompare(y.person.name.toLowerCase());
        });

        return krets;
    }

    searchTimer = null;

    _searchChanged(text) {

        const searchDelay = 500;

        clearTimeout(this.searchTimer);

        this.searchTimer = setTimeout(()=> {

            if (text.length > 0 && !this.state.performedSearches.includes(text)) {

                api.makeApiGetCall("/users/" + text.toLowerCase()).then((data) => {
                    console.log("API ok", data);

                    var tmpHits = this.state.searchHits;

                    tmpHits.push(data.data);

                    this.setState({searchHits: tmpHits});

                    console.log("new state", this.state.searchHits);

                    var tmpTerms = this.state.performedSearches;
                    tmpTerms.push(text);
                    this.setState({performedSearches: tmpTerms});


                }).catch((err) => {
                    console.log("API fuck", err);
                });
            }

        }, searchDelay);


    }

    _getSearchHeight()
    {
        return Math.ceil(this.state.searchHits.length / 4) * 95;
    }

    render() {

        return (

            <View style={pageStyles.container}>

                <View>
                    <Text style={pageStyles.selectorHeader}>Søk</Text>
                    <TextInput style={{
                        margin: 10,
                        padding: 10,
                        height: 40,
                        borderWidth: 1,
                        color: "#ECF0F1",
                        borderColor: "#ECF0F1",
                        backgroundColor: "#2C3E50"
                    }} autoCapitalize="none" multiline={false} spellCheck={false} autoFocus={false}
                               onChangeText={(text) => this._searchChanged(text)}
                    />
                    <FlatList
                        style={{height: this._getSearchHeight(), marginBottom: 10}}
                        data={this.state.searchHits}
                        renderItem={this._renderItemSearch}
                        keyExtractor={(item, index) => item.id}
                        contentContainerStyle={pageStyles.list}

                    />
                </View>
                <View>
                    <Text style={pageStyles.selectorHeader}>Krets</Text>
                    <FlatList

                        data={this._getDataArray()}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => item.person.id}
                        contentContainerStyle={pageStyles.list}

                    />
                </View>
            </View>

        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2C3E50',
        paddingLeft: 0,
        paddingTop: 15,
        paddingBottom: 30,
        paddingRight: 0,
    },
    list: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    selectorHeader: {
        marginLeft: 10,
        marginRight: 10,
        color: "#ECF0F1",
        fontSize: 30,
        fontWeight: "200",
        marginBottom: 5,
    }
});