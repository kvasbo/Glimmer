/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ThreadForumPost from "./UXElements/ThreadForumPost";
import ForumComment from "./UXElements/ForumComment";
import * as colors from "../Styles/colorConstants";
import LoadingScreen from "./UXElements/LoadingScreen";

const commentsInPage = 30;

class PageThread extends React.Component {

    scrollbar = null;
    firstpost = null;

    constructor(props) {

        super(props);
        this.state = {
            loading: true,
            currentPage: 1,
            comments: []
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

        this._isMounted = false;
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.loadCommentPage = this.loadCommentPage.bind(this);

    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                this.loadCommentPage(1);
                arbeidsMaur.forumUpdater.markThreadAsRead(this.props.post.id);
                break;
            case 'didAppear':
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                break;
        }
    }

    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadCommentPage(page) {

        this.setState({currentPage: page, loading: true});

        arbeidsMaur.forumUpdater.loadCommentsForPost(this.props.post.id, page).then((data) => {

            if (this._isMounted) {
                this.setState({comments: data, loading: false});
            }
        });

    }

    findLastPageOfComments() {

        let cCount = parseInt(this.props.post.comment_count);

        let pNumber = parseInt((Math.ceil(cCount / commentsInPage)));

        return pNumber
    }

    getCurrentPageNumber() {
        return this.findLastPageOfComments() - this.state.currentPage + 1;
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

        const activeColor = colors.COLOR_GRAD1
        const size = 30;

        return (

            <View style={pageStyles.sideVelgerView}>

                <TouchableOpacity onPress={() => this._gotoTop()}>
                    <View style={pageStyles.iconButton}>
                        <Icon
                            size={size}
                            name='ios-arrow-up'
                            color={activeColor}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this._gotoBottom()}>
                    <View style={pageStyles.iconButton}>
                        <Icon
                            size={size}
                            name='ios-arrow-down'
                            color={activeColor}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {

                    this.props.navigator.push({
                        screen: 'glimmer.PageNewForumComment', // unique ID registered with Navigation.registerScreen
                        title: "Ny kommentar", // navigation bar title of the pushed screen (optional)
                        passProps: {postId: this.props.post.id}, // Object that will be passed as props to the pushed screen (optional)
                        animated: true, // does the push have transition animation or does it happen immediately (optional),
                    });

                }}>
                    <View style={pageStyles.iconButton}>
                        <Icon
                            size={size}
                            name='ios-create-outline'
                            color={activeColor}
                        />
                    </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => {
                }}>
                    <View style={pageStyles.iconButton}>
                        <Text style={pageStyles.pageNumberText}>{this.getCurrentPageNumber()}</Text>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity onLongPress={() => this._oldestPage()} onPress={() => this._prevPage()}>
                    <View style={pageStyles.iconButton}>
                        <Icon
                            size={size}
                            name='ios-arrow-back'
                            color={activeColor}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onLongPress={() => this._newestPage()} onPress={() => this._nextPage()}>
                    <View style={pageStyles.iconButton}>
                        <Icon
                            size={size}
                            name='ios-arrow-forward'
                            color={activeColor}
                        />
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    getComments() {

        if (this.state.loading) {
            var loadText = "Laster side " + this.getCurrentPageNumber();
            return (<LoadingScreen text={loadText}/>);
        }

        var tmpPosts = this.state.comments;

        tmpPosts.sort((x, y) => {
            return (new Date(x.created_at) - new Date(y.created_at));
        });

        var out = [];
        for (let i = 0; i < tmpPosts.length; i++) {

            let byStarter = false;
            if (tmpPosts[i].creator_id === this.props.post.creator_id) byStarter = true;

            out.push(<ForumComment key={tmpPosts[i].id} byStarter={byStarter} navigator={this.props.navigator}
                                   data={tmpPosts[i]}/>);
        }

        return out;

    }

    render() {

        return (


            <View style={pageStyles.container}>

                <View style={{flex: 1}}>
                    <ScrollView ref={component => this.scrollbar = component} style={{flex: 1}}>

                        <ThreadForumPost data={this.props.post} navigator={this.props.navigator} metaData={false}
                                         cut={false}/>
                        <View ref={component => this.firstpost = component}/>

                        {this.getComments()}

                    </ScrollView>
                </View>

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
        paddingBottom: 0,
        paddingRight: 0,
    },
    sideVelgerView: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignContent: "center",
        alignItems: "center",
        margin: 0,
    },
    navBar: {
        height: 40,
        padding: 0,
        margin: 0,
        paddingTop: 0,
        borderTopColor: colors.COLOR_GRAD2,
        borderTopWidth: 1,
        justifyContent: "center",
    },
    pageNumberText: {
        fontSize: 15,
        fontWeight: "300",
        color: colors.COLOR_GRAD1
    },
    iconButton: {
        padding: 0,
        height: 35,
        width: 50,
        margin: 0,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    }
});

PageThread.propTypes = {
    navigator: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
}

export default PageThread;
