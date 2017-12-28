
import React from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import PropTypes from 'prop-types';
import WidgetContainer from './WidgetContainer';
import WidgetForumPost from './WidgetForumPost';
import StreamForumPost from './StreamForumPost';
import * as colors from '../../Styles/colorConstants';

class WidgetFrontPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { numberToDisplay: 30 };
  }

  getPosts() {
    let posts = Object.values(this.props.stream); 
    posts.sort((a, b) => {
      const aM = new Moment(a.created_at);
      const bM = new Moment(b.created_at);
      return (bM.valueOf() - aM.valueOf());
    });

    posts = posts.slice(0, this.state.numberToDisplay);

    return posts.map((p) => {
      return (
        <WidgetForumPost key={p.id} navigator={this.props.navigator} post={p} />
      );
    });
  }

  render() {
    return (
      <WidgetContainer title="Siste innlegg">
        <ScrollView
          snapToInterval={32}
          decelerationRate="fast"
          snapToAlignment="start"
        >
          {this.getPosts()}
        </ScrollView>
      </WidgetContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    appStatus: state.AppStatus,
    stream: state.ForumStream,
  };
}

export default connect(
  mapStateToProps,
)(WidgetFrontPage);


WidgetFrontPage.propTypes = {
  navigator: PropTypes.object.isRequired,
};
