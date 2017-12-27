
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import * as colors from '../../Styles/colorConstants';

export default class WidgetContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={pageStyles.container}>
        <View><Text>{this.props.title}</Text></View>
        {this.props.children}
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

});
