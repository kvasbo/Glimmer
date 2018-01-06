/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import WriteNewPostOrComment from './UXElements/WriteNewPostOrComment';

export default class PageForumCommentEdit extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        firebase.analytics().setCurrentScreen('kommentar_endre');
        break;
    }
  }

  render() {
    if (this.props.postId === null) {
      return <Text>Intet forum valgt, noe er galt</Text>;
    }


    return (
      <WriteNewPostOrComment type="comment" edit comment={this.props.comment} existingText={this.props.bodyTextile} commentId={this.props.commentId} navigator={this.props.navigator} />
    );
  }
}

PageForumCommentEdit.propTypes = {
  navigator: PropTypes.object.isRequired,
  commentId: PropTypes.number.isRequired,
  bodyTextile: PropTypes.string.isRequired,
};
