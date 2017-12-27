
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
  }

  componentDidMount() {

  }

  render() {
    return (
      <WidgetContainer title="Tråder jeg følger">

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
