import React from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import { ScrollView, StyleSheet, LayoutAnimation } from 'react-native';
import handleDeeplink from '../deepLink';
import WidgetFrontPage from './UXElements/WidgetFrontPage';
import WidgetFavorites from './UXElements/WidgetFavorites';
import * as colors from '../Styles/colorConstants';

class PageStart extends React.Component {
  static navigatorButtons = {
    rightButtons: [
      {
        icon: require('../../icons/more.png'),
        id: 'settings',
      },
    ],
  }

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillMount() {
    global.arbeidsMaur.forumUpdater.addFavorites(1, 3);
  }

  async onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        firebase.analytics().setCurrentScreen("start");
        LayoutAnimation.spring();
        await global.arbeidsMaur.forumUpdater.addFavorites(1, 3);
        LayoutAnimation.spring();
        global.arbeidsMaur.forumUpdater.addStream(1, 3);
        break;
    }
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'settings') { // this is the same id field from the static navigatorButtons definition
        this.props.navigator.push({
          screen: 'glimmer.PageSettings', // unique ID registered with Navigation.registerScreen
          title: 'Innstillinger', // navigation bar title of the pushed screen (optional)
          animated: true, // does the push have transition animation or does it happen immediately (optional)
        });
      }
    }
  }

  componentDidMount() {

  }

  getFavoritesWidget() {
    if (this.props.settings.frontPageFavorites === 0) return null;
    return (<WidgetFavorites navigator={this.props.navigator} />);
  }

  getFrontPageWidget() {
    if (this.props.settings.frontPageNewPosts === 0) return null;
    return (<WidgetFrontPage navigator={this.props.navigator} />);
  }

  render() {
    return (
      <ScrollView style={pageStyles.container}>
        {this.getFavoritesWidget()}
        {this.getFrontPageWidget()}
      </ScrollView>
    );
  }
}

PageStart.propTypes = {
  
};

function mapStateToProps(state) {
  return {
    appStatus: state.AppStatus,
    kudos: state.Kudos,
    messages: state.Conversation,
    stream: state.ForumStream,
    favorites: state.ForumFavorite,
    settings: state.Settings,
  };
}

export default connect(
  mapStateToProps,
)(PageStart);

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.COLOR_WHITE,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
  },
});
