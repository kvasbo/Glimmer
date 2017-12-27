
import React from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import PropTypes from 'prop-types';
import WidgetContainer from './WidgetContainer';
import { View, StyleSheet, Text } from 'react-native';
import * as colors from '../../Styles/colorConstants';

class WidgetFavorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = { numberToDisplay: 5 };
  }

  getPosts() {
    let posts = Object.values(this.props.favorites); 
    posts.sort((a, b) => {
      const aM = new Moment(a.updated_at);
      const bM = new Moment(b.updated_at);
      return (bM.valueOf() - aM.valueOf());
    });

    posts = posts.slice(0, this.state.numberToDisplay);

    console.log(posts);

    return posts.map((p) => {
      return (
        <Text key={p.id} navigator={this.props.navigator} data={p}>{p.title}</Text>
      );
    });
  }

  render() {
    return (
      <WidgetContainer title="Tråder jeg følger">
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

const pageStyles = StyleSheet.create({

  container: {
    backgroundColor: colors.COLOR_WHITE,
  },

});
