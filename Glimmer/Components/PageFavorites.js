/**
 * Created by kvasbo on 31.05.2017.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    FlatList,
    Text,
    View,
} from 'react-native';
import LoadingScreen from "./LoadingScreen"
import {Icon, Divider} from 'react-native-elements'

export default class PageFavorites extends React.Component {

    constructor(props) {
        super(props);
        this.state = {posts: [], loading: true, refreshing: false};
        this.createPostList = this.createPostList.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.updatePostsFromStore = this.updatePostsFromStore.bind(this);
    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                this.updatePostsFromStore();
                break;
            case 'didAppear':
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                break;
        }
    }

    static navigatorStyle = {
        drawUnderTabBar: true,
        statusBarBlur: false,
        drawUnderStatusBar: true,
        drawUnderNavBar: true,
        navBarBlur: true,
        navBarHidden: false,
    };

    static navigationOptions = {
        // title: 'Strøm',
    };

    componentDidMount() {
        this.updatePostsFromStore();
    }

    updatePostsFromStore() {
        var posts = global.arbeidsMaur.forumUpdater.getFavorites();

        if (posts.length > 0) {
            this.setState({posts: posts, loading: false});
        }
        else {
            setTimeout(this.updatePostsFromStore, 200);
        }
    }

    componentDidMount() {

    }

    createPostList() {
        out = [];

        for (post in this.state.posts) {

            out.push(
                <FavoriteForumPost showThreadButton={true} navigator={this.props.navigator}
                                   key={this.state.posts[post].id}
                                   cut={true} images={false} data={this.state.posts[post].bulletin}/>
            );

        }
        return out;
    }

    _onRefresh() {
        /* this.setState({refreshing: true});
         global.arbeidsMaur.forumUpdater.getFrontPagePosts().then((data) => {
         this.setState({refreshing: false});
         });*/
    }

    getSubtitle(data) {
        var date = new moment(data.updated_at).calendar()
        return date;
    }

    _renderItem = ({item}) => (

        <View>
            <TouchableOpacity onPress={() =>
                this.props.navigator.push({
                    screen: 'glimmer.PageThread',
                    title: item.bulletin.title,
                    passProps: {post: item.bulletin}
                })
            }>
                <View style={pageStyles.favoriteElement}>
                    <View style={pageStyles.favoriteText}>
                        <Text style={pageStyles.favoriteTitle}>{item.bulletin.title}</Text>
                        <Text style={pageStyles.favoriteSubtitle}>{this.getSubtitle(item.bulletin)}</Text>
                    </View>
                    <View style={pageStyles.favoriteIcon}>
                        <Icon name="keyboard-arrow-right" color="#AAAAAA" size={30} />
                    </View>
                </View>

            </TouchableOpacity>
            <Divider style={{ backgroundColor: '#CCCCCC' }} />
        </View>

    )

    _keyExtractor = (item, index) => item.bulletin.id;

    _loadMoreItems(distance)
    {
        console.log("reachec end", distance)
    }

    render() {

        //console.log(this.state.posts);

        if (this.state.loading) {
            return <LoadingScreen text="Laster trådene dine..."/>
        }
        else {

            return (

                <FlatList
                    style={pageStyles.container}
                    data={this.state.posts}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    onEndReached={this._loadMoreItems}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={30}
                />

            );
        }
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#FFFFFF',
        paddingLeft: 0,
        marginTop: 70,
        marginBottom: 50,
        paddingRight: 0,

    },

    favoriteElement: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },

    favoriteText: {
        padding: 10,
        paddingLeft: 15,
        flex: 8,
    },

    favoriteIcon: {
        padding: 10,
        paddingRight: 13,
        flex: 1,
    },

    favoriteTitle: {
        fontSize: 16,
        fontWeight: "300",
        marginBottom: 3,
    },

    favoriteSubtitle: {
        fontSize: 13,
        fontWeight: "300",
        color: "#444444"
    }

});