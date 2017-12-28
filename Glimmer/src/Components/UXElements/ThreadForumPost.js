/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import KudosAndCommentsAndStuff from './KudosAndCommentsAndStuff';
import ForumTextTextile from './ForumTextTextile';
import PostControls from './PostControls';
import CommentMetadata from './CommentMetadata';
import * as colors from '../../Styles/colorConstants';

export default class ThreadForumPost extends React.Component {
    byMe = false;

    constructor(props) {
      super(props);
      this.state = {};

      try {
        if (this.props.data.creator_id === store.getState().AppStatus.activeUserId) {
          this.byMe = true;
        }
      } catch (err) {
        console.log('error parsing', this.props);
      }
    }

    componentDidMount() {

    }

    getTime() {
      return helpers.getCalendarTime(this.props.data.created_at);
    }

    render() {
      return (

        <View style={pageStyles.container}>
          <View style={pageStyles.creatorInfo}>
            <PostControls post={this.props.data} navigator={this.props.navigator} />
          </View>
          <View style={pageStyles.thePost}>
            <ForumTextTextile
              cut={false}
              text={this.props.data.body_textile}
              navigator={this.props.navigator}
              images
              style={{ marginBottom: 10 }}
            />
          </View>
          <View style={pageStyles.metaData}>
            <View style={{ flexDirection: 'row' }}>
              <KudosAndCommentsAndStuff
                showCommentBadge={false}
                navigator={this.props.navigator}
                post={this.props.data}
                byMe={this.byMe}
              />
            </View>
          </View>

        </View>
      );
    }
}

ThreadForumPost.propTypes = {
  data: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
};

const pageStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.COLOR_WHITE,
    padding: 0,
    marginBottom: 2,
    borderBottomWidth: 5,
    borderBottomColor: colors.COLOR_GRAD2,

  },
  creatorInfo: {
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 15,
  },
  thePost: {
    marginTop: 0,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  metaData: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },

});
