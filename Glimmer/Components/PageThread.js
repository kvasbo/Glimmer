/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ThreadForumPost from "./UXElements/ThreadForumPost";
import ForumComment from "./UXElements/ForumComment";
import * as colors from "../Styles/colorConstants";
import {setForumPostCommentActivePage} from "../Redux/actions";

const commentsInPage = 30;

export default class PageThread extends React.Component {

    scrollbar = null;
    firstpost = null;

    constructor(props) {

        super(props);
        this.state = {
            loading: true,
            comments: [],
            currentPage: 1,
            pageCache: {},
            numberOfPages: this.findLastPageOfComments(),
            pagePickerModalVisible: false,
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                if (this.state.currentPage !== null) {
                    this.loadCommentPage(this.state.currentPage);
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

    componentWillMount() {

        //Listen to state changes. This really needs to change at some later point.
        this.reduxUnsubscribe = store.subscribe(() => {

                try {

                    //We have data for this page
                    if (typeof(store.getState().ForumPostComment[this.props.post.id]) !== "undefined") {

                        if (typeof(store.getState().ForumPostComment[this.props.post.id].currentPage !== this.state.currentPage)) {
                            this.setState({
                                currentPage: store.getState().ForumPostComment[this.props.post.id].activePage,
                            })
                        }

                        //And for this page!
                        if (typeof(store.getState().ForumPostComment[this.props.post.id].page[this.state.currentPage]) !== "undefined") {

                            var tmpComments = store.getState().ForumPostComment[this.props.post.id].page[this.state.currentPage].comments;

                            if (tmpComments !== this.state.comments) {
                                this.setState({loading: false, comments: tmpComments});
                            }

                        }
                    }

                }
                catch
                    (err) {
                    console.log(err);
                }
            }
        )
        ;
    }

    componentWillUnmount() {
        this.reduxUnsubscribe();
    }

    loadCommentPage(page) {

        //

        store.dispatch(setForumPostCommentActivePage(this.props.post.id, page));

    }

    findLastPageOfComments() {

        let cCount = parseInt(this.props.post.comment_count);

        let pNumber = parseInt((Math.ceil(cCount / commentsInPage)));

        return pNumber
    }

    getComments() {

        if (this.state.loading) {
            return (
                <View style={{marginLeft: 10, marginRight: 10, alignItems: "center"}}><ActivityIndicator/></View>)
        }

        var out = [];

        var tmpComments = Object.values(this.state.comments);

        tmpComments.sort((x, y) => {
            return (new Date(x.created_at) - new Date(y.created_at));
        });

        for (let i = 0; i < tmpComments.length; i++) {
            out.push(<ForumComment key={tmpComments[i].id} data={tmpComments[i]}/>)
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
        this.setState({loading: true});
        this.loadCommentPage(Math.max(this.state.currentPage - 1, 1));
    }

//Older page
    _prevPage() {
        this.setState({loading: true});
        this.loadCommentPage(Math.min(this.state.currentPage + 1, this.findLastPageOfComments()));

    }

    _newestPage() {
        this.loadCommentPage(1);


    }

    _oldestPage() {
        this.setState({loading: true});
        this.loadCommentPage(this.findLastPageOfComments());
    }

    _getSidevelger() {

        if (this.state.loading) return null;

        const activeColor = colors.COLOR_GRAD1
        const passiveColor = colors.COLOR_DARKGREY
        const size = 30;

        var leftColor = activeColor;
        var rightColor = activeColor;

        // if (this.state.currentPage === 1) rightColor = passiveColor;
        // if (this.state.currentPage === this.state.numberOfPages) leftColor = passiveColor;

        var showPage = this.state.numberOfPages - this.state.currentPage + 1;

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

const
    pageStyles = StyleSheet.create({
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