import React from "react";
import {Text, View} from "react-native";

export default class Badge extends React.Component {

    render() {

        return (
            <View style={{
                height: 23,
                borderRadius: 11,
                alignContent: "center",
                justifyContent: "center",
                padding: 5,
                paddingRight: 10,
                paddingLeft: 10,
                margin: 0,
                marginRight: 5,
                marginBottom: 5,
                backgroundColor: this.props.color
            }}>
                <Text style={{color: this.props.textColor,}}>{this.props.text}</Text>
            </View>
        );
    }

}
