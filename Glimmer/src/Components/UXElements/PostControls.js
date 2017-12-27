import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, LayoutAnimation, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import CommentMetadata from './CommentMetadata';
import Badge from './Badge';
import * as colors from '../../Styles/colorConstants';

export default class PostControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false, following: this.props.post.following }
  }

  getExtendedView() {
    if (!this.state.expanded || this.state.loading ) return null;

    return (
      <View style={pageStyles.extendedContainer}>
        <CheckBox
          title="Følg tråd"
          checked={this.state.following}
          onPress={() => this.toggleFollowing()}
        />
      </View>
    );
  }

  async toggleFollowing() {
    if (!this.state.following) {
      result = await global.arbeidsMaur.forumUpdater.followPost(this.props.post.id);
      this.setState({ following: true });
    } else  {
      result = await global.arbeidsMaur.forumUpdater.unfollowPost(this.props.post.id);
      this.setState({ following: false });
    }
    global.arbeidsMaur.forumUpdater.loadPost(this.props.post.id);
  }

  toggleExtended() {
    LayoutAnimation.spring();
    this.setState({ expanded: !this.state.expanded });
  }
  
  getMoreControls() {
    if (!this.props.showControls) return null;
    return (
      <View>
        <TouchableOpacity onPress={() => { this.toggleExtended(); }}>
          <Icon name={this.getArrow()} style={{padding: 5}} color={colors.COLOR_MIDGREY} size={20} />
        </TouchableOpacity>
      </View>
    );
  }

  getArrow() {
    if (this.state.expanded) return 'ios-arrow-up';
    return 'ios-arrow-down';
  }

  getCommentCount() {
    if (!this.props.showCommentCount || this.props.post.comment_count === 0) return null;
    return (
      <View>
        <Badge text={this.props.post.comment_count} textColor={colors.COLOR_MIDGREY} color={colors.COLOR_LIGHT} />
      </View>
    )
  }

  render() {
    return (
      <View>
        <View style={pageStyles.container}>
          <CommentMetadata
            post={this.props.post}
            navigator={this.props.navigator}
          />
           <View>
            {this.getCommentCount()}
          </View>
          {this.getMoreControls()}
        </View>
        { this.getExtendedView() }
      </View>
    );
  }
}

PostControls.defaultProps = {
  showControls: true,
  showCommentCount: false,
};

PostControls.propTypes = {
  showControls: PropTypes.bool,
  showCommentCount: PropTypes.bool,
  navigator: PropTypes.object.isRequired,
};

const pageStyles = StyleSheet.create({

  container: {
    marginTop: 2,
    marginBottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  extendedContainer: {
    padding: 0,
    marginTop: 10,
  },

});
