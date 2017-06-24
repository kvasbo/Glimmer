/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {ScrollView, StyleSheet, Text} from "react-native";


export default class PageKretsVelger extends React.Component {

    constructor(props) {
        super(props);
        this.state={krets: global.store.getState().krets}
    }

    componentDidMount() {

        console.log(this.state);
        console.log()
        this.setState({krets: global.store.getState().krets});

        //Listen to state changes. This really needs to change at some later point.
        reduxUnsubscribe = global.store.subscribe(() => {

            console.log("Krets state get", global.store.getState());

                var tmpKrets = global.store.getState().krets;

                if(tmpKrets !== this.state.krets)
                {
                    this.setState({krets: tmpKrets});
                }
            }
        )

    }

    _getPeople()
    {
        out = [];
        for(person in this.state.krets)
        {
            console.log(this.state.krets[person]);
            var tmp = <Text>this.state.krets[person].name</Text>
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