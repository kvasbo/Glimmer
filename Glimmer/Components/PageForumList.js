/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";

export default class PageForumList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {filterText: "", forums: []};
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    static navigatorStyle = {
        navBarHidden: true,
    };

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                this.setState({filterText: "", forums: global.arbeidsMaur.forumUpdater.getForumArray()});
                break;
            case 'didAppear':
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                break;
        }
    }

    getFilteredForumList() {
        if (this.state.text === "") {
            return this.state.forums;
        }
        else {
            return this.state.forums.filter((forum) => {
                return forum.title.toLocaleLowerCase().indexOf(this.state.filterText.toLocaleLowerCase()) !== -1;
            })
        }
    }

    render() {

        return (
            <View style={{flex: 1}}>

                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({filterText: text})}
                    value={this.state.text}
                />

                <FlatList style={pageStyles.container}
                          data={this.getFilteredForumList()}
                          renderItem={({item}) => <Forum key={item.id} forum={item}></Forum>}
                >

                </FlatList>
            </View>
        );
    }
}

class Forum extends React.Component {

    styles = new StyleSheet.create({

        forumContainer: {
            height: 20,
            margin: 5,
            padding: 5,

        },

        forumText: {
            color: "#FFFFFF",
        }

    });

    render() {

        return (
            <TouchableOpacity>
                <View style={this.styles.forumContainer}>
                    <Text style={this.styles.forumText}>{this.props.forum.title}</Text>
                </View>
            </TouchableOpacity>
        )

    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333333',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
});
