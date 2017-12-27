import React from 'react';
import { connect } from 'react-redux';
import handleDeeplink from '../deepLink';
import Moment from 'moment';
import { ScrollView, StyleSheet } from 'react-native';
import WidgetFrontPage from './UXElements/WidgetFrontPage';
import WidgetFavorites from './UXElements/WidgetFavorites';
import * as colors from '../Styles/colorConstants';

class PageStart extends React.Component {
  static navigatorButtons = {
    rightButtons: [
      {
        icon: require('../../icons/plus.png'),
        id: 'tjafs',
      },
    ],
  }

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        firebase.analytics().setCurrentScreen("start");
        break;
    }
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'tjafs') { // this is the same id field from the static navigatorButtons definition
        this.props.navigator.push({
          screen: 'glimmer.PageAnnet', // unique ID registered with Navigation.registerScreen
          title: 'Røkla', // navigation bar title of the pushed screen (optional)
          animated: true, // does the push have transition animation or does it happen immediately (optional)
        });
      }
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <ScrollView style={pageStyles.container}>
        <WidgetFavorites />
        <WidgetFrontPage />
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
    paddingBottom: 30,
    paddingRight: 0,
  },
});
