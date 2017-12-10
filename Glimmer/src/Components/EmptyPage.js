import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import * as colors from '../Styles/colorConstants';

export default class EmptyPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <ScrollView style={pageStyles.container} />
    );
  }
}

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.COLOR_LIGHT,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 30,
    paddingRight: 0,
  },
});
