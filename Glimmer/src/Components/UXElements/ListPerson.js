/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import * as colors from '../../Styles/colorConstants';

export default class ListPerson extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, person: null };
  }

  async componentWillMount() {
    const person = await global.arbeidsMaur.userUpdater.getUserInfo(this.props.userId);
    this.setState({ loading: false, person });
  }

  getItem() {
    if (this.state.loading) {
      return (<ListItem
        key={this.props.userId}
        title="Laster..."
        hideChevron
        onPress={() => this.props.onPress(this.props.userId)}
      />);
    }

    return (
      <ListItem
        roundAvatar
        avatar={{ uri: this.state.person.image }}
        key={this.props.userId}
        title={this.state.person.name}
        hideChevron
        onPress={() => this.props.onPress(this.props.userId)}
      />
    );
  }

  render() {
    return this.getItem();
  }
}

ListPerson.propTypes = {
  userId: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
};

const pageStyles = StyleSheet.create({

  container: {
    backgroundColor: colors.COLOR_WHITE,
  },

});
