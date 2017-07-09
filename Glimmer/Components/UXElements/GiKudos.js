/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Alert, StyleSheet, TouchableOpacity, TouchableHighlight, Text, View} from "react-native";
//import {Badge} from "react-native-elements";
import * as colors from "../../src/Styles/colorConstants"
import Badge from "./Badge";

export default class GiKudos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {given: this.props.given, text: "Gi kudos"}
    }

    componentDidMount() {

    }

    giKudos() {

        if (this.props.type == "post") {
            arbeidsMaur.forumUpdater.giveKudosToPost(this.props.id).then(() => {

                this.setState({given: true})

            }).catch((err) => {
                console.log(err);
            })
        }
        else if (this.props.type == "comment") {
            arbeidsMaur.forumUpdater.giveKudosToComment(this.props.id).then(() => {

                this.setState({given: true})

            }).catch((err) => {
                console.log(err);
            });
        }
    }

    render() {

        if (this.state.given === true) {
            return (
                <Badge
                    text={"Kudos gitt!"}
                    textColor={colors.COLOR_WHITE}
                    color={colors.COLOR_GRAD3}
                    style={{marginRight: 5}}
                />
            )
        }
        else {

            return (
                <TouchableOpacity
                    onPress={() => this.setState({text: "Hold for kudos..."})}
                    onLongPress={() => this.giKudos()}
                >
                    <Badge
                        text={this.state.text}
                        textColor={colors.COLOR_WHITE}
                        color={colors.COLOR_GREEN}
                        style={{marginRight: 5}}
                    />


                </TouchableOpacity>
            );
        }
    }
}

const pageStyles = StyleSheet.create({

    container: {},

});