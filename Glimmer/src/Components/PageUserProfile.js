import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import * as colors from '../Styles/colorConstants';

export default class PageUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, user: undefined }
  }

  async componentWillMount() {
    const user = await global.arbeidsMaur.userUpdater.getUserInfo(this.props.userId);
    this.setState({ user, loading: false });
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
    backgroundColor: colors.COLOR_WHITE,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 30,
    paddingRight: 0,
  },
});
