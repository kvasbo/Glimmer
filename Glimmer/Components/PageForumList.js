/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";

export default class PageForumList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {filterText: "", loading: true, forums: store.getState().ForumList.forums};
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    static navigatorStyle = {
        navBarHidden: true,
    };

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                this.setState({filterText: "", forums: store.getState().ForumList.forums});
                break;
            case 'didAppear':
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                break;
        }
    }

    componentDidMount() {

    }

    getFilteredForumList() {

        var arr = this.state.forums.sort((x,y)=>{
            return x.title.trim().localeCompare(y.title.trim());
        });

        if (this.state.filterText === "") {
            return arr;
        }
        else {

            return arr.filter((forum) => {
                return forum.title.toLocaleLowerCase().indexOf(this.state.filterText.toLocaleLowerCase()) !== -1;
            })

        }
    }

    render() {

        return (
            <View style={{flex: 1, paddingTop: 30}}>

                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, padding: 5, paddingLeft: 10, paddingRight: 10}}
                    onChangeText={(text) => this.setState({filterText: text})}
                    value={this.state.text}
                />

                <FlatList style={pageStyles.container}
                          data={this.getFilteredForumList()}
                          keyExtractor={(item, index) => item.id}
                          renderItem={({item}) => <Forum forum={item}></Forum>}
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

        //console.log(this.props);

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
