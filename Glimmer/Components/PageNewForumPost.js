/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {ScrollView, StyleSheet, Text} from "react-native";
import WriteNewPostOrComment from "./UXElements/WriteNewPostOrComment"
import * as colors from "../Styles/colorConstants";

export default class PageNewForumPost extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        if(this.forumId === null)
        {
            return <Text>Intet forum valgt, noe er galt</Text>
        }
        else {
            return (
                <ScrollView style={pageStyles.container}>
                    <WriteNewPostOrComment type="post" navigator={this.props.navigator}/>
                </ScrollView>
            );
        }


    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.COLOR_LIGHT,
        padding: 0,
        margin: 0,
    },
});