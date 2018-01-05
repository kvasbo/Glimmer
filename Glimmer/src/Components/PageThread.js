import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filter, sumBy, cloneDeep } from 'lodash';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ThreadForumPost from './UXElements/ThreadForumPost';
import SkogsEvent from './UXElements/SkogsEvent';
import ForumComment from './UXElements/ForumComment';
import * as colors from '../Styles/colorConstants';
import LoadingScreen from './UXElements/LoadingScreen';
import { COLOR_LIGHT } from '../Styles/colorConstants';

const hash = require('object-hash');

const commentsInPage = 30;
const separatorHeight = 5;
const activeColor = colors.COLOR_DARKGREY;


class PageThread extends React.Component {
    scrollbar = null;
    firstpost = null;
   

    constructor(props) {
      super(props);

      this.unreadInfo = this.findFirstUnread();
      this.initSizeIndex();
      this.state = {
        loading: false,
        currentPage: this.unreadInfo.unreadPage,
        comments: [],
        skammekrok: [],
        gotoFirst: true,
        extraData: undefined,
        randomStupidThing: Math.random(),
      };
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
      this.componentWillMount = this.componentWillMount.bind(this);
      this.componentWillUnmount = this.componentWillUnmount.bind(this);
      this.loadCommentPage = this.loadCommentPage.bind(this);
      this.renderHeader = this.renderHeader.bind(this);
      this.isEvent = (this.props.post.type === 'event');
      
      // console.log('isEvent', this.isEvent);
    }

    initSizeIndex() {
      console.log("initSizeIndex");
      this.sizeIndex = { comments: {}, post: undefined };
    }

    componentWillMount() {
      this.initSizeIndex();
      // this.loadCommentPage(1);
    }

    componentWillUnmount() {
      this.initSizeIndex();
    }

    onNavigatorEvent(event) {
      switch (event.id) {
        case 'willAppear':
          // this.silentlyLoadCommentPage(1);
          this.setState({ randomStupidThing: Math.random() });
          this.header = this.renderHeader();
          this.silentlyLoadCommentPage(this.state.currentPage);
          firebase.analytics().setCurrentScreen("tråd");
           // this.setState(this.state);
          break;
        case 'didAppear':
          this.updateSkammekrok();
          break;
        case 'willDisappear':
          if(this.state.currentPage === 1) {
            if (this.state.currentPage === 1) arbeidsMaur.forumUpdater.markThreadAsRead(this.props.post.id, this.isEvent);
          }
          break;
        case 'didDisappear':
          break;
      }
    }

    updateSkammekrok = () => {
      const skammekrok = global.arbeidsMaur.gjemsel.getKrok();
      this.setState({ skammekrok });
    }

    async silentlyLoadCommentPage(page) {
      this.setState({ loading: true });
      await arbeidsMaur.forumUpdater.loadCommentsForPost(this.props.post.id, page, this.isEvent);
      this.setState({ loading: false });     
    }

    async loadCommentPage(page) {
      this.setState({ currentPage: page, loading: true });
      this.sizeIndex.comments = {};
      if (this.state.currentPage === 1) arbeidsMaur.forumUpdater.markThreadAsRead(this.props.post.id, this.isEvent);
      await arbeidsMaur.forumUpdater.loadCommentsForPost(this.props.post.id, page, this.isEvent);
      this.setState({ loading: false });
    }

    findLastPageOfComments() {
      const cCount = parseInt(this.props.post.comment_count);
      const pNumber = parseInt((Math.ceil(cCount / commentsInPage)));
      return pNumber;
    }

    getCurrentPageNumber() {
      const pageNr = this.findLastPageOfComments() - this.state.currentPage + 1;
      if (this.state.loading) {
        return (
          <ActivityIndicator color={activeColor} size="small" />
        );
      }
      return (
        <Text numberOfLines={1} adjustsFontSizeToFit style={[pageStyles.pageNumberText, { color: activeColor }]}>{pageNr} / {this.unreadInfo.totalPages}</Text>
      );
    }

    findFirstUnread() {
      const numberOfUnread = this.props.post.unread_comment_count;
      const unreadPage = Math.ceil(numberOfUnread / commentsInPage);
      const numberOnPage = numberOfUnread % 30;
      const totalPages = Math.ceil(this.props.post.comment_count / commentsInPage);
      const out = { unreadPage, numberOnPage, totalPages };
      //console.log("findFirstUnread post", this.props.post, out);
      return out;
    }

    getCommentList() {
      let tmpPosts = filter(this.props.comments, (c) => {
        if (c.postId === this.props.post.id && c.page === this.state.currentPage) return true;
        return false;
      });

      tmpPosts.sort((x, y) => (new Date(x.created_at) - new Date(y.created_at)));

      // Skammekrok
      tmpPosts = tmpPosts.filter((c) => {
        if (this.state.skammekrok.indexOf(c.creator_id) !== -1) return false;
        return true;
      });

      // this.setState({ extraData: Math. });

      return tmpPosts;
    }

    keyExtractor(element) {
      return element.id;
    }

    /**
     * Store the size of the post itself, for scrolling to them.
     * @param {*} event 
     * @param {*} index 
     */
    /*
    postRenderedGetSize = (event) => {
      console.log("rendered post");
      const { height, width } = event.nativeEvent.layout;
      this.sizeIndex.post = { height, width };
    }
*/
    /**
     * Store the size of the comments, for scrolling to them.
     * @param {*} event 
     * @param {*} index 
     */
    /*
    commentRenderedGetSize= (event, index) => {
      console.log("rendered comment");
      const { height, width } = event.nativeEvent.layout;
      this.sizeIndex.comments[index] = { index, height, width };
    }
*/
    /**
     * Get the position of any item in the list.
     */
    getItemLayout = (data, index) => {
      try {
        const commentSizeList = global.store.getState().DimensionsComments;
        const postSizeList = global.store.getState().DimensionsPosts;
        const dataToMap = data.slice(0, index - 1);
        const commentSizes = dataToMap.map((c) => {
          if (!commentSizeList[c.id]) return { height: 0, width: 0 };
          const { height, width } = commentSizeList[c.id];
          return { height, width };
        });

        const heightOfComments = sumBy(commentSizes, 'height');
        const heightOfPost = 0; // (postSizeList[this.props.post.id]) ? postSizeList[this.props.post.id].height : 0;
        const heightOfSeparators = 0; // Math.max(0, (index - 1)) * separatorHeight;
        const offset = heightOfPost + heightOfComments + heightOfSeparators;
        
        let length = 0;
        if (index > 0) {
          const commentWeAreLookingAt = data[index];
          length = (commentSizeList[commentWeAreLookingAt.id]) ? commentSizeList[commentWeAreLookingAt.id].height : 0;
        }
        // console.log({length, offset, index});
        return { length, offset, index };
      } catch (e) {
        console.log('error in getItemLayout');
        throw new Error('Error in getItemLayout');
      }
    }

    gotoFirstUnread() {
      if (this.getCommentList().length === 0) return -1;
      const indexOfUnread = this.getCommentList().length - this.unreadInfo.numberOnPage;
      if (this.unreadInfo.unreadPage === this.state.currentPage) {
        this.gotoPost(indexOfUnread);
      } else {
        setTimeout(() => this.gotoFirstUnread(), 250);
      }
    }

    gotoPost(index) {
      const goto = Math.min((this.getCommentList().length - 1), index);
      const offset = this.getItemLayout(this.getCommentList(), index);
      this.scrollViewRef.scrollTo({ y: offset.offset });
    }

    /**
     * Scroll to topish.
     * @returns {boolean}
     * @private
     */
    gotoTop() {
      this.scrollViewRef.scrollTo({ y: 0 });
    }

    /**
     * Guess.
     * @private
     */
    gotoBottom() {
      this.scrollViewRef.scrollToEnd({ animated: true });
    }

    // Newer page
    nextPage() {
      this.sizeIndex.comments = {};
      this.loadCommentPage(Math.max(this.state.currentPage - 1, 1));
    }

    // Older page
    prevPage() {
      this.sizeIndex.comments = {};
      this.loadCommentPage(Math.min(this.state.currentPage + 1, this.findLastPageOfComments()));
    }

    newestPage() {
      this.sizeIndex.comments = {};
      this.loadCommentPage(1);
    }

    oldestPage() {
      this.sizeIndex.comments = {};
      this.loadCommentPage(this.findLastPageOfComments());
    }

    enableUnreadButton() {
      if (this.unreadInfo.unreadPage !== this.state.currentPage) return false;
      // if (this.getComments().length === 0 || Object.values(this.sizeIndex.comments).length === 0) return false;
      // if (this.getComments().length !== Object.values(this.sizeIndex.comments).length) return false;
      return true;
    }

    getUnreadButtonColor() {
      if (this.enableUnreadButton()) return activeColor;
      return colors.COLOR_LIGHTGREY;
    }

    getSidevelger() {
      const size = 30;

      return (
        <View style={pageStyles.sideVelgerView}>
          <TouchableOpacity onPress={() => this.gotoTop()}>
            <View style={pageStyles.iconButton}>
              <Icon
                size={size}
                name="ios-arrow-up"
                color={activeColor}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity disabled={!this.enableUnreadButton()} onPress={() => this.gotoFirstUnread()}>
            <View style={pageStyles.iconButton}>
              <Icon
                size={size}
                name="ios-eye-outline"
                color={this.getUnreadButtonColor()}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.gotoBottom()}>
            <View style={pageStyles.iconButton}>
              <Icon
                size={size}
                name="ios-arrow-down"
                color={activeColor}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.props.navigator.push({
              screen: 'glimmer.PageNewForumComment',
              title: 'Ny kommentar',
              passProps: { postId: this.props.post.id, isEvent: this.isEvent },
              animated: true,
            });
          }}
          >
            <View style={pageStyles.iconButton}>
              <Icon
                size={size}
                name="ios-create-outline"
                color={activeColor}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
                }}
          >
            <View style={pageStyles.iconButton}>
              {this.getCurrentPageNumber()}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onLongPress={() => this.oldestPage()} onPress={() => this.prevPage()}>
            <View style={pageStyles.iconButton}>
              <Icon
                size={size}
                name="ios-arrow-back"
                color={activeColor}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onLongPress={() => this.newestPage()} onPress={() => this.nextPage()}>
            <View style={pageStyles.iconButton}>
              <Icon
                size={size}
                name="ios-arrow-forward"
                color={activeColor}
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    /**
     * Figure out if a comment is unread or not based on calculated info and its index.
     * @param {*} index 
     */
    isUnread(index) {
      const indexOfUnread = commentsInPage - this.unreadInfo.numberOnPage;
      if (this.state.currentPage < this.unreadInfo.unreadPage) return true;
      if (this.state.currentPage === this.unreadInfo.unreadPage && index >= indexOfUnread) return true;
      return false;
    }

    getPost() {
      if (this.isEvent) {
        return (
          <SkogsEvent data={this.props.post} navigator={this.props.navigator} />
        );
      }

      return (
        <ThreadForumPost data={this.props.post} navigator={this.props.navigator} />
      );
    }

    getCommments = () => {
      const comments = this.getCommentList();

      return comments.map((c, index) => {
       // console.log(c, index);
        const byStarter = (c.creator_id === this.props.post.creator_id);
        return (
          <ForumComment
            key={c.id}
            byStarter={byStarter}
            navigator={this.props.navigator}
            data={c}
            isUnread={this.isUnread(index)}
          />
        );
      });
    }

    renderSeparator() {
      return (
        <View style={{ width: '100%', height: separatorHeight, backgroundColor: COLOR_LIGHT }} />
      );
    }

    renderHeader() {
      console.log('render post called');
      return this.getPost();
    }

    renderItem(item) {
      const c = item.item;
      const byStarter = (c.creator_id === this.props.post.creator_id);
      return (
        <ForumComment
          key={c.id}
          byStarter={byStarter}
          navigator={this.props.navigator}
          data={c}
          isUnread={this.isUnread(item.index)}
        />
      );
    }

    render() {
      return (
        <View style={pageStyles.container}>
          <ScrollView
            style={{ flex: 1 }}
            ref={(ref) => { this.scrollViewRef = ref; }}
          >
            {this.renderHeader()}
            {this.getCommments()}

          </ScrollView>
          <View style={pageStyles.navBar}>
            {this.getSidevelger()}
          </View>
        </View>
      );
    }
}

/*
 <FlatList
              data={this.getCommentList()}
              extraData={this.state}
              ref={(ref) => { this.flatListRef = ref; }}
              keyExtractor={this.keyExtractor}
              initialNumToRender={commentsInPage}
              renderItem={(item) => this.renderItem(item)}
              ItemSeparatorComponent={() => this.renderSeparator()}
              ListHeaderComponent={() => this.renderHeader()}
              getItemLayout={this.getItemLayout}
              overScrollMode="never"
              scrollsToTop={true}
            />
            */

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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    margin: 0,
    backgroundColor: colors.COLOR_WHITE,
  },
  navBar: {
    height: 40,
    padding: 0,
    margin: 0,
    paddingTop: 0,
    borderTopColor: colors.COLOR_GRAD2,
    borderTopWidth: 1,
    justifyContent: 'center',
  },
  pageNumberText: {
    fontWeight: '300',
  },
  iconButton: {
    padding: 0,
    height: 35,
    width: 50,
    margin: 0,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

PageThread.propTypes = {
  navigator: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    appStatus: state.AppStatus,
    comments: state.ForumPostComment,
  };
}

export default connect(mapStateToProps)(PageThread);
