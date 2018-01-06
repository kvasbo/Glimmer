/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import WriteNewPostOrComment from './UXElements/WriteNewPostOrComment';

export default class PageNewForumPost extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        firebase.analytics().setCurrentScreen('forumpost_ny');
        break;
    }
  }

  componentDidMount() {

  }

  render() {
    if (this.forumId === null) {
      return <Text>Intet forum valgt, noe er galt</Text>;
    }

    return (
      <WriteNewPostOrComment type="post" navigator={this.props.navigator} />
    );
  }
}

PageNewForumPost.propTypes = {
  navigator: PropTypes.object.isRequired,
};
