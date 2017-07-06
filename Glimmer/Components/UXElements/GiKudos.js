/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Alert, StyleSheet, TouchableOpacity, TouchableHighlight, Text, View} from "react-native";
import {Badge} from "react-native-elements";
import * as colors from "../../Styles/colorConstants"

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
                    value={"Kudos gitt!"}
                    textStyle={{color: 'white'}}
                    containerStyle={{backgroundColor: colors.COLOR_GRAD3, marginRight: 5}}
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
                        value={this.state.text}
                        textStyle={{color: 'white'}}
                        containerStyle={{backgroundColor: colors.COLOR_GREEN, marginRight: 5}}
                    />


                </TouchableOpacity>
            );
        }
    }
}

const pageStyles = StyleSheet.create({

    container: {},

});