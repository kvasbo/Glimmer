
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import * as colors from '../../Styles/colorConstants';

export default class Empty extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={pageStyles.container} />
    );
  }
}

Empty.propTypes = {

};

const pageStyles = StyleSheet.create({

  container: {
    backgroundColor: colors.COLOR_WHITE,
  },

});
