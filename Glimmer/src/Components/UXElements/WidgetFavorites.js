
import React from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import PropTypes from 'prop-types';
import WidgetContainer from './WidgetContainer';
import WidgetFavoritesPost from './WidgetFavoritesPost';
import * as colors from '../../Styles/colorConstants';

class WidgetFavorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = { numberToDisplay: 60, onlyUnread: true };
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

  onLayout(event) {
    // Height of header: 35, padding of container: 12
    const padding = 12; 
    const header = 35;
    const heightOfElement = 32;
    const numberToDisplay = Math.floor((event.nativeEvent.layout.height - padding - header) / heightOfElement);
    console.log("onLayout", event.nativeEvent.layout,numberToDisplay);
  }

  render() {
    return (
      <WidgetContainer title="Uleste i tråder jeg følger">
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
    favorites: state.ForumFavorite,
  };
}

export default connect(
  mapStateToProps,
)(WidgetFavorites);


WidgetFavorites.propTypes = {

};
