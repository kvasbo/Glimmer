/**
 * Created by kvasbo on 31.05.2017.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TextInput
} from 'react-native';


export default class AddCommentBlock extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = { text: 'Useless Placeholder' };
    }

    render () {

        return (
            <View>
                <Text>Add comment</Text>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                />
            </View>
        )

    }

}