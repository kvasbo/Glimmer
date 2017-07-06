/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {ScrollView, StyleSheet} from "react-native";
import WriteNewPostOrComment from "./UXElements/WriteNewPostOrComment"
import * as colors from "../Styles/colorConstants";

export default class PageNewForumPost extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <ScrollView style={pageStyles.container}>
                <WriteNewPostOrComment type="post" forumId={1} title="Ny kommentar" navigator={this.props.navigator}/>
            </ScrollView>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.COLOR_LIGHTGREY,
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
});