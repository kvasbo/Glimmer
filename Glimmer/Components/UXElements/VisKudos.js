/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Badge} from "react-native-elements";
import * as colors from "../../Styles/colorConstants"

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
                    value={this.props.kudos[key].name}
                    key={this.props.kudos[key].id}
                    textStyle={{color: colors.COLOR_DARKGREY}}
                    containerStyle={pageStyles.badgeStyle}
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
                            value={this.getKudosCount() + " kudos"}
                            textStyle={{color: colors.COLOR_DARKGREY}}
                            containerStyle={pageStyles.badgeStyle}
                        />
                    </View>
                </TouchableOpacity>
            );
        }
    }
}

const pageStyles = StyleSheet.create({

    container: { flexDirection: "row", flexWrap: "wrap"},

    badgeStyle: {backgroundColor: colors.COLOR_LIGHT, marginRight: 5, marginBottom: 5}

});