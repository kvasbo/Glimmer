/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Button, ScrollView, StyleSheet, Text, View} from "react-native";


export default class PageLog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {log: global.helpers.logItems}

    }

    componentDidMount() {

    }

    updateLogs() {
        this.setState({log: global.helpers.logItems});
        if (__DEV__) {
            //console.log("Logstate", this.state.log);
        }
    }

    getLogs() {

        //console.log("Logging page Getlogs");

        out = [];

        for (key in this.state.log) {
            var item = this.state.log[key];

            out.push(<View key={item.key}><Text>{item.time.toLocaleTimeString()}</Text><Text>{item.data}</Text></View>)

            console.log("Logging", item);
        }

        return out;

    }

    render() {

        return (
            <View style={pageStyles.container}>
                <Button title="Reload" onPress={() => this.updateLogs()}/>
                <ScrollView style={{padding: 20}}>
                    {this.getLogs()}
                </ScrollView>
            </View>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCCCCC',
        paddingLeft: 0,
        paddingTop: 30,
        paddingBottom: 30,
        paddingRight: 0,
    },
});