import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, LayoutAnimation } from 'react-native';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import CommentMetadata from './CommentMetadata';
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

  getArrow() {
    if (this.state.expanded) return 'ios-arrow-up';
    return 'ios-arrow-down';
  }

  render() {
    return (
      <View>
        <View style={pageStyles.container}>
          <CommentMetadata
            image={this.props.post.creator_image}
            name={this.props.post.creator_name}
            time={this.props.post.created_at}
            forum={this.props.post.forum_title}
          />
          <View>
            <Icon name={this.getArrow()} size={20} onPress={() => { this.toggleExtended(); }} />
          </View>
        </View>
        { this.getExtendedView() }
      </View>
    );
  }
}

PostControls.propTypes = {

};

const pageStyles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  extendedContainer: {
    padding: 0,
    marginTop: 10,
  },

});
