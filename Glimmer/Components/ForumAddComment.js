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
import {Card, Icon, Badge, Divider} from 'react-native-elements'

export default class AddCommentBlock extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = { text: 'Useless Placeholder' };
    }

    render () {

        return (
            <Card>
                <Icon
                    reverse
                    color='#517fa4'
                    name='comment' />
            </Card>
        )

    }

}

/*

 <TextInput
 style={{height: 40, borderColor: 'gray', borderWidth: 1}}
 onChangeText={(text) => this.setState({text})}
 value={this.state.text}
 />

 */