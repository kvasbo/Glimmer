/**
 * Created by kvasbo on 31.05.2017.
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    FlatList
} from 'react-native';


export default class PageForumList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {filterText: "", forums: global.arbeidsMaur.forumUpdater.getForumArray()};

    }

    componentDidMount() {
       // console.log("mounted pageforumlust", this.state.forums);
    }

    getFilteredForumList()
    {
        if(this.state.text === "")
        {
            return this.state.forums;
        }
        else {
            return this.state.forums.filter((forum) => {
                return forum.title.indexOf(this.state.filterText) !== -1;
            })
        }
    }

    render() {

        return (
            <View style={{flex:1}}>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({filterText: text})}
                    value={this.state.text}
                />
                <FlatList style={pageStyles.container}
                          data={this.getFilteredForumList()}
                          renderItem={({item}) => <Text key={item.id}>{item.title}</Text>}
                >

                </FlatList>
            </View>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCCCCC',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
});