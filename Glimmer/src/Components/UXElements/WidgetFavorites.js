import React from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import PropTypes from 'prop-types';
import WidgetContainer from './WidgetContainer';
import WidgetFavoritesPost from './WidgetFavoritesPost';
import * as colors from '../../Styles/colorConstants';

class WidgetFavorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = { numberToDisplay: 0, onlyUnread: true };
  }

  componentWillMount() {
    this.setState({ numberToDisplay: arbeidsMaur.settings.getSettings().frontPageFavorites });
  }

  getPosts() {
    let posts = Object.values(this.props.favorites);  
    if (this.state.onlyUnread) {
      posts = posts.filter((p) => {
        return (p.unread_comment_count > 0); 
      });
    }

    posts.sort((a, b) => {
      const aM = new Moment(a.updated_at);
      const bM = new Moment(b.updated_at);
      return (bM.valueOf() - aM.valueOf());
    });

    posts = posts.slice(0, this.state.numberToDisplay);

    return posts.map((p) => {
      return (
        <WidgetFavoritesPost key={p.id} navigator={this.props.navigator} post={p} />
      );
    });
  }

  render() {
    return (
      <WidgetContainer title="Uleste i tråder jeg følger">  
        {this.getPosts()}
      </WidgetContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    appStatus: state.AppStatus,
    favorites: state.ForumFavorite,
  };
}

export default connect(
  mapStateToProps,
)(WidgetFavorites);


WidgetFavorites.propTypes = {

};
