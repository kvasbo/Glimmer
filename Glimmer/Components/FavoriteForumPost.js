/**
 * Created by kvasbo on 31.05.2017.
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Text
} from 'react-native';

import {Card, Icon, Badge, Divider, ListItem} from 'react-native-elements'

var s = require('./Styles');

export default class FavoriteForumPost extends React.Component {

    images = [];
    post = {};

    constructor(props) {

        super(props);
        this.state = {};

        // this.images = this.getImages();

        if (__DEV__) {
            //console.log("StreamForumPost",this.props, post);
        }
    }

    componentDidMount() {

    }

    getTime(time) {
        return new moment(this.props.data.created_at).calendar();
    }


    getMetadataSection() {
        if (this.props.metaData === false) {
            return null;
        }
        else {
            return (
                <View>
                    <Divider/>

                    <View style={{flexDirection: "row", marginTop: 10}}>

                        <MetaDataFirstPost showThreadButton={this.props.showThreadButton}
                                           navigator={this.props.navigator} post={this.props.data}/>

                    </View>
                </View>
            )
        }
    }

    render() {

        return (

            <Card title={this.props.data.title}>


            </Card>
        );
    }

}

class Tag
    extends Component {

    render() {
        return (
            <View><Text>{this.props.tag}</Text></View>
        )
    }
}

class ViewUser extends Component {


}