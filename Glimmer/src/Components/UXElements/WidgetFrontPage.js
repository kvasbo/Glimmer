import React from 'react';
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
  }

  getPosts() {
    let posts = Object.values(this.props.stream); 
    posts.sort((a, b) => {
      const aM = new Moment(a.created_at);
      const bM = new Moment(b.created_at);
      return (bM.valueOf() - aM.valueOf());
    });

    posts = posts.slice(0, this.props.settings.frontPageNewPosts);

    return posts.map((p) => {
      return (
        <WidgetForumPost key={p.id} navigator={this.props.navigator} post={p} />
      );
    });
  }

  render() {
    return (
      <WidgetContainer title="Siste innlegg">
        {this.getPosts()}
      </WidgetContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    appStatus: state.AppStatus,
    stream: state.ForumStream,
    settings: state.Settings,
  };
}

export default connect(
  mapStateToProps,
)(WidgetFrontPage);


WidgetFrontPage.propTypes = {
  navigator: PropTypes.object.isRequired,
};
