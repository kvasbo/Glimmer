import React from 'react';
import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import PropTypes from 'prop-types';
import WidgetContainer from './WidgetContainer';
import WidgetFavoritesPost from './WidgetFavoritesPost';
import * as colors from '../../Styles/colorConstants';

const pagesToLoadAtStart = 3;
const maxTotalPages = 20;

class WidgetFavorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = { onlyUnread: true, lastPage: pagesToLoadAtStart };
  }

  async componentWillMount() {
    LayoutAnimation.easeInEaseOut();
   // this.getMorePages(1, pagesToLoadAtStart);
  }

  async getMorePages(from, number) {
    await global.arbeidsMaur.forumUpdater.addFavorites(from, number);
    this.setState({ lastPage: (from + (number - 1)) });
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

    posts = posts.slice(0, this.props.settings.frontPageFavorites);

    if (posts.length < this.props.settings.frontPageFavorites && this.state.lastPage < maxTotalPages) {
      this.getMorePages(this.state.lastPage, 1);
    }

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
    settings: state.Settings,
  };
}

export default connect(
  mapStateToProps,
)(WidgetFavorites);


WidgetFavorites.propTypes = {

};
