/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {View} from "react-native";
import * as colors from "../../src/Styles/colorConstants"

export default class Divider extends React.Component {

    render() {

        return (
            <View style={{height: 1, marginRight: 0, marginLeft: 0, backgroundColor: colors.COLOR_LIGHT}}></View>
        );
    }

}

