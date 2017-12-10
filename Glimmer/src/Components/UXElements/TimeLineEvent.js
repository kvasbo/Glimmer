import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import * as colors from '../../Styles/colorConstants';

export default class TimeLineEvent extends React.Component {
  constructor(props) {
    super(props);
  }

  getType() {
    if (this.props.item.type === 'kudos') {
      return "kudos";
    } else if (this.props.item.type === 'comment') {
      return "kommentar i tråd du følger";
    } else if (this.props.item.type === 'stream') {
      return "ny post på forsiden";
    } else if (this.props.item.type === 'message') {
      return "ny melding";
    }
    return "???";
  }

  getTitle() {
    if (this.props.item.type === 'kudos') {
      return this.props.item.item.creatorName;
    } else if (this.props.item.type === 'comment') {
      return this.props.item.item.title;
    } else if (this.props.item.type === 'stream') {
      return this.props.item.item.title;
    } else if (this.props.item.type === 'message') {
      console.log('item', this.props.item);
      return "melding";
    }
  }

  render() {
    return (
      <View style={pageStyles.container}>
        <Text style={pageStyles.type}>{this.getType()}</Text>
        <Text>{this.getTitle()}</Text>
      </View>
    );
  }
}

TimeLineEvent.propTypes = {
  item: PropTypes.object.isRequired,
};

const pageStyles = StyleSheet.create({

  container: {
    backgroundColor: colors.COLOR_WHITE,
    padding: 4,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
  },

  type: {
    fontWeight: '100',
    fontSize: 10,
    color: colors.COLOR_GRAD1,
  },

});
