import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filter, sumBy, cloneDeep } from 'lodash';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ThreadForumPost from './UXElements/ThreadForumPost';
import SkogsEvent from './UXElements/SkogsEvent';
import ForumComment from './UXElements/ForumComment';
import * as colors from '../Styles/colorConstants';
import LoadingScreen from './UXElements/LoadingScreen';
import { COLOR_LIGHT } from '../Styles/colorConstants';

const commentsInPage = 30;
const separatorHeight = 5;
const activeColor = colors.COLOR_DARKGREY;

class PageThread extends React.Component {
    contentHeight = 0;
   
    constructor(props) {
      super(props);

      this.unreadInfo = this.findFirstUnread();

      this.state = {
        loading: false,
        currentPage: this.unreadInfo.unreadPage,
        comments: [],
        skammekrok: [],
        gotoFirst: true,
      };
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
      this.loadCommentPage = this.loadCommentPage.bind(this);
      this.isEvent = (this.props.post.type === 'event');
    }

    onNavigatorEvent(event) {
      switch (event.id) {
        case 'willAppear':
          this.silentlyLoadCommentPage(this.state.currentPage);
          firebase.analytics().setCurrentScreen("tråd");
          break;
        case 'didAppear':
          this.updateSkammekrok();
          break;
        case 'willDisappear':
          if (this.state.currentPage === 1) arbeidsMaur.forumUpdater.markThreadAsRead(this.props.post.id, this.isEvent);
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
      if (this.state.currentPage === 1) arbeidsMaur.forumUpdater.markThreadAsRead(this.props.post.id, this.isEvent);
      await arbeidsMaur.forumUpdater.loadCommentsForPost(this.props.post.id, page, this.isEvent);
      this.setState({ loading: false });
    }

    findLastPageOfComments() {
      const cCount = parseInt(this.props.post.comment_count, 10);
      const pNumber = parseInt((Math.ceil(cCount / commentsInPage)), 10);
      return pNumber;
    }

    getCurrentPageNumber() {
      const pageNr = (this.findLastPageOfComments() - this.state.currentPage) + 1;
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

      return tmpPosts;
    }

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
        const heightOfPost = (postSizeList[this.props.post.id]) ? postSizeList[this.props.post.id].height : 0;
        const heightOfSeparators = Math.max(0, (index - 1)) * separatorHeight;

        const offset = heightOfPost + heightOfComments + heightOfSeparators;
        // console.log(heightOfComments,heightOfPost,heightOfSeparators, offset);
        
        let length = 0;
        if (index > 0) {
          const commentWeAreLookingAt = data[index];
          // console.log("we are looking at", commentWeAreLookingAt);
          length = (commentSizeList[commentWeAreLookingAt.id]) ? commentSizeList[commentWeAreLookingAt.id].height : 0;
        }
        return { length, offset, index };
      } catch (e) {
        // console.log('error in getItemLayout');
        throw new Error(`Error in getItemLayout: ${e.message}`);
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
      const goto = Math.min((this.getCommentList().length - 1), index + 1);
      const offset = this.getItemLayout(this.getCommentList(), goto);
      if ((offset.length + offset.offset) < this.contentHeight) {
        this.scrollViewRef.scrollTo({ y: offset.offset });
      } else {
        this.gotoBottom();
      }
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
      this.loadCommentPage(Math.max(this.state.currentPage - 1, 1));
    }

    // Older page
    prevPage() {
      this.loadCommentPage(Math.min(this.state.currentPage + 1, this.findLastPageOfComments()));
    }

    newestPage() {
      this.loadCommentPage(1);
    }

    oldestPage() {
      this.loadCommentPage(this.findLastPageOfComments());
    }

    enableUnreadButton() {
      if (this.unreadInfo.unreadPage !== this.state.currentPage) return false;
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
        const byStarter = (c.creator_id === this.props.post.creator_id);
        return (
          <View>
            <ForumComment
              key={c.id}
              byStarter={byStarter}
              navigator={this.props.navigator}
              data={c}
              isUnread={this.isUnread(index)}
            />
            {(index < comments.length) ? this.renderSeparator() : null }
          </View>
        );
      });
    }

    renderSeparator() {
      return (
        <View style={{ width: '100%', height: separatorHeight, backgroundColor: COLOR_LIGHT }} />
      );
    }
  
    render() {
      return (
        <View style={pageStyles.container}>
          <ScrollView
            style={{ flex: 1 }}
            ref={(ref) => { this.scrollViewRef = ref; }}
            onContentSizeChange={(w, h) => { this.contentHeight = h; }}
          >
            {this.getPost()}
            {this.getCommments()}

          </ScrollView>
          <View style={pageStyles.navBar}>
            {this.getSidevelger()}
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
