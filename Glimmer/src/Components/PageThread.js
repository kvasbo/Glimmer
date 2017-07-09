/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ThreadForumPost from "./UXElements/ThreadForumPost";
import ForumComment from "./UXElements/ForumComment";
import * as colors from "../Styles/colorConstants";
import {setForumPostCommentActivePage} from "../Redux/actions";

const commentsInPage = 30;

class PageThread extends React.Component {

    scrollbar = null;
    firstpost = null;

    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            currentPage: 1,
        };

        this.numberOfPages = this.findLastPageOfComments(),

            this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                if (this.state.currentPage !== null) {
                    this.loadCommentPage(1);
                }
                break;
            case 'didAppear':
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                break;
        }
    }

    loadCommentPage(page) {

        this.setState({currentPage: page});
        store.dispatch(setForumPostCommentActivePage(this.props.post.id, page));

    }

    findLastPageOfComments() {

        let cCount = parseInt(this.props.post.comment_count);

        let pNumber = parseInt((Math.ceil(cCount / commentsInPage)));

        return pNumber
    }

    /**
     * Scroll to topish.
     * @returns {boolean}
     * @private
     */
    _gotoTop() {

        if (this.firstpost === null || this.scrollbar === null) return false;

        this.firstpost.measure((fx, fy, width, height, px, py) => {

            //Scroll to top if initiated
            if (this.scrollbar !== null) {
                this.scrollbar.scrollTo({y: 0, animated: true});
            }

        });
    }

    /**
     * Guess.
     * @private
     */
    _gotoBottom() {
        this.scrollbar.scrollToEnd({animated: true});
    }

    //Newer page
    _nextPage() {

        this.loadCommentPage(Math.max(this.state.currentPage - 1, 1));
    }

    //Older page
    _prevPage() {

        this.loadCommentPage(Math.min(this.state.currentPage + 1, this.findLastPageOfComments()));

    }

    _newestPage() {
        this.loadCommentPage(1);

    }

    _oldestPage() {
        this.loadCommentPage(this.findLastPageOfComments());
    }

    _getSidevelger() {

        if (this.state.loading) return null;

        const activeColor = colors.COLOR_GRAD1
        const passiveColor = colors.COLOR_DARKGREY
        const size = 30;

        var leftColor = activeColor;
        var rightColor = activeColor;

        var showPage = "";

        if (typeof this.props.comments[this.props.post.id] !== "undefined") showPage = this.props.comments[this.props.post.id].activePage;

        return (

            <View style={pageStyles.sideVelgerView}>


                <Icon
                    size={size}
                    name='ios-arrow-up'
                    color={activeColor}
                    onPress={() => this._gotoTop()}
                />

                <Icon
                    size={size}
                    name='ios-arrow-down'
                    color={activeColor}
                    onPress={() => this._gotoBottom()}
                />

                <Icon
                    size={size}
                    name='ios-create-outline'
                    color={activeColor}
                    onPress={() => {

                        this.props.navigator.push({
                            screen: 'glimmer.PageNewForumComment', // unique ID registered with Navigation.registerScreen
                            title: "Ny kommentar", // navigation bar title of the pushed screen (optional)
                            passProps: {postId: this.props.post.id}, // Object that will be passed as props to the pushed screen (optional)
                            animated: true, // does the push have transition animation or does it happen immediately (optional),
                        });

                    }}
                />

                <TouchableOpacity onPress={() => {
                }}>
                    <Text style={pageStyles.pageNumberText}>{showPage}</Text>
                </TouchableOpacity>

                <Icon
                    size={size}
                    name='ios-arrow-back'
                    color={leftColor}
                    onPress={() => this._prevPage()}
                    onLongPress={() => this._oldestPage()}
                />

                <Icon
                    size={size}
                    name='ios-arrow-forward'
                    color={rightColor}
                    onPress={() => this._nextPage()}
                    onLongPress={() => this._newestPage()}
                />

            </View>
        )
    }

    getComments() {

        //Vi har ikke data
        if (typeof this.props.comments[this.props.post.id] === "undefined" || typeof this.props.comments[this.props.post.id].page[this.state.currentPage] === "undefined") {
            return (
                <View style={{marginLeft: 10, marginRight: 10, alignItems: "center"}}><ActivityIndicator/></View>
            )
        }

        const cData = this.props.comments[this.props.post.id];

        if (typeof this.state.currentPage === "undefined" || typeof cData.page[this.state.currentPage] === "undefined") {
            return (
                <View style={{marginLeft: 10, marginRight: 10, alignItems: "center"}}><ActivityIndicator/></View>
            )
        }

        const ourPage = cData.page[this.state.currentPage];

        if (ourPage.loading === true) {
            return (
                <View style={{marginLeft: 10, marginRight: 10, alignItems: "center"}}><ActivityIndicator/></View>
            )
        }

        ourPage.comments.sort((x, y) => {
            return (new Date(x.created_at) - new Date(y.created_at));
        });

        var out = [];
        for (let i = 0; i < ourPage.comments.length; i++) {
            out.push(<ForumComment key={ourPage.comments[i].id} data={ourPage.comments[i]}/>)
        }

        return out;

    }

    render() {

        return (


            <View style={pageStyles.container}>
                <ScrollView ref={component => this.scrollbar = component} style={{flex: 1}}>

                    <ThreadForumPost data={this.props.post} metaData={false}
                                     cut={false}
                                     touchable={false}/>
                    <View ref={component => this.firstpost = component}/>

                    {this.getComments()}

                </ScrollView>

                <View style={pageStyles.navBar}>

                    {this._getSidevelger()}

                </View>

            </View>

        );

    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.COLOR_LIGHT,
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
    sideVelgerView: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignContent: "center",
        alignItems: "center",
    },
    navBar: {
        height: 13,
        margin: 0,
        paddingTop: 5,
    },
    pageNumberText: {
        fontSize: 15,
        fontWeight: "300",
        color: colors.COLOR_GRAD1
    }
});

PageThread.propTypes = {
    navigator: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        comments: state.ForumPostComment
    }
}

export default connect(
    mapStateToProps
)(PageThread)