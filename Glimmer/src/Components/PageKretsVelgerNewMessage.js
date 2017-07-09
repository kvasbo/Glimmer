import React from "react";
import {connect} from "react-redux";
import {Alert, FlatList, StyleSheet, Text, TextInput, View} from "react-native";
import PersonFace from "./UXElements/PersonFace";
import NavigatorStyles from "../Styles/NavigatorStyles";

//TODO sort by status and then name

class PageKretsVelger extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            searchHits: [],
            performedSearches: [],
            searching: false
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    static navigatorStyle = NavigatorStyles.default;

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

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
            if (event.id == "writeNewMessage") {

                if (store.getState().MessageRecipients.recipients.length === 0) {
                    Alert.alert("Ingen mottakere", "Hvem tenkte du skulle lese denne meldinga da?");
                } else {
                    this.props.navigator.push({
                        screen: 'glimmer.PageNewMessage', // unique ID registered with Navigation.registerScreen
                        title: "Send ny melding", // navigation bar title of the pushed screen (optional)
                        passProps: {}, // Object that will be passed as props to the pushed screen (optional)
                        animated: true, // does the push have transition animation or does it happen immediately (optional),
                        backButtonTitle: "Mottakere",
                    });
                }
            }
        }
    }

    _renderItem = ({item}) => (

        <PersonFace key={item.id} person={item} navigator={this.props.navigator}/>

    )

    _renderItemSearch = ({item}) => (

        <PersonFace key={item.id} person={item} navigator={this.props.navigator}/>

    )

    _getDataArray() {

        var krets = [];

        for (var i = 0; i < this.props.krets.length; i++) {
            krets.push(this.props.users[this.props.krets[i]]);
        }

        krets.sort((x, y) => {
            return x.name.toLowerCase().localeCompare(y.name.toLowerCase());
        });

        return krets;
    }

    searchTimer = null;

    _searchChanged(text) {

        const searchDelay = 500;

        clearTimeout(this.searchTimer);

        this.searchTimer = setTimeout(() => {

            if (text.length > 0 && !this.state.performedSearches.includes(text)) {

                this.setState({searching: true});

                var tmpTerms = this.state.performedSearches;
                tmpTerms.push(text);
                this.setState({performedSearches: tmpTerms});

                api.makeApiGetCall("/users/" + text.toLowerCase()).then((data) => {

                    var tmpHits = this.state.searchHits;
                    tmpHits.push(data.data);

                    this.setState({searchHits: tmpHits, searching: false});

                    console.log("new state", this.state.searchHits);

                }).catch((err) => {
                    this.setState({searching: false});
                });
            }

        }, searchDelay);

    }

    _getSearchHeight() {
        return Math.ceil(this.state.searchHits.length / 4) * 85;
    }

    render() {

        return (

            <View style={pageStyles.container}>

                <View>
                    <Text style={pageStyles.selectorHeader}>Søk blant alle</Text>
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
                        style={{height: this._getSearchHeight()}}
                        data={this.state.searchHits}
                        renderItem={this._renderItemSearch}
                        keyExtractor={(item, index) => item.id}
                        contentContainerStyle={pageStyles.list}
                        getItemLayout={(data, index) => (
                            {
                                length: 90, offset: 90 * index, index
                            }
                        )}


                    />
                </View>
                <View style={{paddingBottom: 50, marginBottom: 50}}>
                    <Text style={pageStyles.selectorHeader}>Velg i krets</Text>
                    <FlatList


                        data={this._getDataArray()}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => item.id}
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
        paddingBottom: 50,
        paddingRight: 0,
    },
    list: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
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

function mapStateToProps(state) {
    return {
        krets: state.Krets, users: state.User
    }
}

export default connect(
    mapStateToProps
)(PageKretsVelger)
