
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
    flex: 1,
    backgroundColor: colors.COLOR_WHITE,
  },

  header: {
    width: '100%',
    padding: 10,
    height: 35,
    justifyContent: 'center',
    backgroundColor: colors.COLOR_LIGHT,
    borderTopWidth: 0,
    borderBottomWidth: 0.5,
    borderTopColor: colors.COLOR_LIGHTGREY,
    borderBottomColor: colors.COLOR_LIGHTGREY,
  },

  headerText: {
    fontWeight: '200',
  },

  contentBox: {
    paddingTop: 6,
    paddingBottom: 6,
    flex: 1,
  },

});
