/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {Card, Icon} from "react-native-elements";

export default class AddCommentBlock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {text: 'Useless Placeholder'};
    }

    render() {

        var title = "Ny kommentar til "+ this.props.title;

        return (
            <View style={pageStyles.container}>
                <Icon
                    reverse
                    color='#517fa4'
                    name='comment'
                    onPress={()=>{
                        this.props.navigator.showModal({
                            screen: 'glimmer.PageNewForumPost',
                            title: title,
                            passProps: {navigator: this.props.navigator, type: "comment", id: this.props.postId}
                        });
                    }}
                />
            </View>
        )

    }

}

const pageStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginBottom: 2,
        alignContent: "flex-end",
        flexDirection: "row"
    },

});