/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {ScrollView, StyleSheet, Text} from "react-native";


export default class PageKretsVelger extends React.Component {

    constructor(props) {
        super(props);
        var tmpKrets = store.getState().Krets;
        this.state = {krets: store.getState().Krets}
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

    _getPeople() {
        out = [];
        for (person in this.state.krets) {
            console.log(this.state.krets[person]);
            var tmp = <Text key={this.state.krets[person].person.id}>{this.state.krets[person].person.name}</Text>
            out.push(tmp);
        }

        return out;
    }

    render() {

        console.log("Krets", this.state.krets);
        return (
            <ScrollView style={pageStyles.container}>
                {this._getPeople()}
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
});