/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import WriteNewPostOrComment from './UXElements/WriteNewPostOrComment';

export default class PageNewForumComment extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        firebase.analytics().setCurrentScreen("kommentar_ny");
        break;
    }
  }

  render() {
    if (this.props.postId === null) {
      return <Text>Intet forum valgt, noe er galt</Text>;
    }

    return (
      <WriteNewPostOrComment type="comment" postId={this.props.postId} navigator={this.props.navigator} />
    );
  }
}

PageNewForumComment.propTypes = {
  navigator: PropTypes.object.isRequired,
  postId: PropTypes.number.isRequired,
};
