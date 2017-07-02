/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Alert, StyleSheet, TouchableOpacity, Text} from "react-native";
import {Badge} from "react-native-elements";

export default class GiKudos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {given: this.props.given}
    }

    componentDidMount() {

    }

    giKudos() {

        if (this.props.type == "post") {
            arbeidsMaur.forumUpdater.giveKudosToPost(this.props.id).then(() => {

                this.setState({given: true})
                console.log("Kudos gitt!");

            }).catch((err) => {
                console.log(err);
            })
        }
        else if (this.props.type == "comment") {
            arbeidsMaur.forumUpdater.giveKudosToComment(this.props.id).then(() => {

                this.setState({given: true})
                console.log("Kudos gitt!");

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
                    containerStyle={{backgroundColor: 'green', marginRight: 5}}
                />
            )
        }
        else {

            return (
                <TouchableOpacity
                    onPress={() => Alert.alert("Vådekudos?", "Hold inne knappen i et lite sekund for å gi kudos.")}
                    onLongPress={() => this.giKudos()}
                >
                    <Badge
                        value={"Gi kudos"}
                        textStyle={{color: 'white'}}
                        containerStyle={{backgroundColor: 'green', marginRight: 5}}
                    />

                </TouchableOpacity>
            );
        }
    }
}

const pageStyles = StyleSheet.create({

    container: {},

});