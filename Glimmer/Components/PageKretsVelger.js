/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {FlatList, StyleSheet, View} from "react-native";
import PersonFace from "./UXElements/PersonFace";

//TODO sort by status and then name

export default class PageKretsVelger extends React.Component {

    constructor(props) {
        super(props);
        var tmpKrets = store.getState().Krets;
        this.state = {krets: store.getState().Krets}
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    static navigatorButtons = {
        rightButtons: [
            {
                title: 'Ferdig', // for a textual button, provide the button title (label)
                id: 'close', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
            }
        ]
    };

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
            if(event.id == "writeNewMessage") {
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
        var reduxUnsubscribe = store.subscribe(() => {

                var tmpKrets = store.getState().Krets;

                if (tmpKrets !== this.state.krets) {
                    this.setState({krets: tmpKrets});
                }
            }
        )

    }

    _renderItem = ({item}) => (

        <PersonFace key={item.person.id} person={item.person} navigator={this.props.navigator}/>

    )

    _getDataArray() {

        var krets = Object.values(this.state.krets).sort((x,y) => {
            return x.person.name.toLowerCase().localeCompare(y.person.name.toLowerCase());
        });

        return krets;
    }

    render() {

        return (

            <View style={pageStyles.container}>

                <FlatList

                    data={this._getDataArray()}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.person.id}
                    contentContainerStyle={pageStyles.list}

                />


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
    }
});