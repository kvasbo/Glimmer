
import React from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import PropTypes from 'prop-types';
import WidgetContainer from './WidgetContainer';
import { View, StyleSheet, Text } from 'react-native';
import * as colors from '../../Styles/colorConstants';

class WidgetFrontPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <WidgetContainer title="Forsiden">

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

};

const pageStyles = StyleSheet.create({

  container: {
    backgroundColor: colors.COLOR_WHITE,
  },

});
