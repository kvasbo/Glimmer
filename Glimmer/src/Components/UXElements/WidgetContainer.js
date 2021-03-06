import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import * as colors from '../../Styles/colorConstants';

export default class WidgetContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={pageStyles.container}>
        <View style={pageStyles.header}><Text style={pageStyles.headerText}>{this.props.title}</Text></View>
        <View style={pageStyles.contentBox}>{this.props.children}</View>
      </View>
    );
  }
}

WidgetContainer.propTypes = {
  title: PropTypes.string.isRequired,
};

const pageStyles = StyleSheet.create({

  container: {
    backgroundColor: colors.COLOR_WHITE,
  },

  header: {
    width: '100%',
    padding: 10,
    marginTop: 5,
    marginBottom: 0,
    justifyContent: 'center',
  },

  headerText: {
    fontWeight: '200',
    fontSize: 20,
  },

  contentBox: {
    paddingTop: 0,
    paddingBottom: 6,
  },

});
