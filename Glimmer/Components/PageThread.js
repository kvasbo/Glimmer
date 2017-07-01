/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Icon} from "react-native-elements";

import ThreadForumPost from "./UXElements/ThreadForumPost";
import ForumComment from "./UXElements/ForumComment";
import AddCommentBlock from "./UXElements/ForumAddComment";

const commentsInPage = 30;

export default class PageThread extends React.Component {

    scrollbar = null;
    firstpost = null;

    constructor(props) {

        super(props);
        this.state = {
            loading: true,
            comments: [],
            currentPage: null,
            pageCache: {},
            numberOfPages: this.findLastPageOfComments()
        };

    }

    componentWillMount() {

        this.loadInitComments();

    }

    componentWillUnmount() {
        // this.reduxUnsubscribe();
    }

    loadInitComments() {
        this.loadCommentPage(1);
    }

    loadCommentPage(page) {

        this.setState({loading: true});

        this._gotoTop();

        //Get page
        arbeidsMaur.forumUpdater.loadCommentsForPost(this.props.post.id, page).then((data) => {

            console.log("Comments page " + page, data);

            tmpPageCache = this.state.pageCache;
            tmpPageCache[page] = data;

            this.setState({currentPage: page, pageCache: tmpPageCache, loading: false});

        });

    }

    findLastPageOfComments() {

        var cCount = parseInt(this.props.post.comment_count);

        return parseInt((Math.floor(cCount / commentsInPage) + 1));
    }

    getComments() {

        if (this.state.loading) {
            return (<View style={{marginLeft: 10, marginRight: 10, alignItems: "center"}}><ActivityIndicator/></View>)
        }

        var out = [];

        var tmpPosts = this.state.pageCache[this.state.currentPage].reverse();

        for (var i = 0; i < tmpPosts.length; i++) {
            var c = tmpPosts[i];
            out.push(<ForumComment key={c.id} data={c}/>)
        }

        return out;

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
                this.scrollbar.scrollTo({y: height + 100, animated: true});
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

        if (this.state.currentPage > 1) {
            this.loadCommentPage(this.state.currentPage - 1);
        }
    }

    //Older page
    _prevPage() {

        if (this.state.currentPage < this.state.numberOfPages) {
            this.loadCommentPage(this.state.currentPage + 1);
        }

    }

    //Oldest page
    _firstPage() {
        this.loadCommentPage(this.state.numberOfPages);
    }

    //Newest page
    _lastPage() {
        this.loadCommentPage(1);
    }

    _getSidevelger() {

        if (this.state.loading || this.state.numberOfPages === 1) return null;

        const activeColor = "#3499DB"
        const passiveColor = "#CCCCCC"
        const size = 18;

        var showPage = this.state.numberOfPages - this.state.currentPage + 1;

        return (

            <View style={pageStyles.sideVelgerView}>


                <Icon
                    reverse
                    size={size}
                    name='keyboard-arrow-left'
                    color={activeColor}
                    onPress={() => this._prevPage()}
                />

                <Icon
                    reverse
                    size={size}
                    name='keyboard-arrow-up'
                    color={activeColor}
                    onPress={() => this._gotoTop()}
                />


                <TouchableOpacity>
                    <Text style={pageStyles.pageNumberText}>{showPage}</Text>
                </TouchableOpacity>

                <Icon
                    reverse
                    size={size}
                    name='keyboard-arrow-down'
                    color={activeColor}
                    onPress={() => this._gotoBottom()}
                />

                <Icon
                    reverse
                    size={size}
                    name='keyboard-arrow-right'
                    color={activeColor}
                    onPress={() => this._nextPage()}
                />

            </View>
        )
    }

    render() {

        return (

            <ScrollView ref={component => this.scrollbar = component} style={pageStyles.container}>
                <ThreadForumPost data={this.props.post} metaData={false}
                                 cut={false}
                                 touchable={false}/>
                <View ref={component => this.firstpost = component}/>

                {this._getSidevelger()}

                {this.getComments()}

                {this._getSidevelger()}

                <AddCommentBlock postId={this.props.post.id} navigator={this.props.navigator}
                                 title={this.props.post.title}/>
                <KeyboardAvoidingView behavior="padding"/>
                <View style={{height: 20}}/>
            </ScrollView>

        );

    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECF0F1',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
    sideVelgerView: {
        flexDirection: "row",
        marginRight: 10,
        marginLeft: 10,
        justifyContent: "space-around",
        alignContent: "center",

    },
    pageNumberText: {
        fontSize: 15,
        fontWeight: "300",
        paddingTop: 18,
    }
});