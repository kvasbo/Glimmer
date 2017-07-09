/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
//import {Badge} from "react-native-elements";
import * as colors from "../../Styles/colorConstants";
import Badge from "./Badge";

export default class VisKudos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {showList: false}
    }

    componentDidMount() {

    }

    getKudosCount() {
        return this.props.kudos.length;
    }

    getKudosList() {

        let out = [];

        for (key in this.props.kudos) {

            out.push(<Badge
                    text={this.props.kudos[key].name}
                    key={this.props.kudos[key].id}
                    textColor={colors.COLOR_DARKGREY}
                    color={colors.COLOR_LIGHT}
                    style={{marginRight: 5, marginBottom: 5}}
                />
            )

        }

        return out;

    }

    render() {

        if (this.state.showList === true) {
            return (
                <View style={pageStyles.container}>
                    {this.getKudosList()}
                </View>
            )
        }
        else {
            return (
                <TouchableOpacity onLongPress={() => this.setState({showList: true})}>
                    <View style={pageStyles.container}>
                        <Badge
                            text={this.getKudosCount() + " kudos"}
                            textColor={colors.COLOR_DARKGREY}
                            color={colors.COLOR_LIGHT}
                            style={{marginRight: 5, marginBottom: 5}}
                        />
                    </View>
                </TouchableOpacity>
            );
        }
    }
}

const pageStyles = StyleSheet.create({

    container: { flexDirection: "row", flexWrap: "wrap"},

    badgeStyle: {marginRight: 5, marginBottom: 5}

});