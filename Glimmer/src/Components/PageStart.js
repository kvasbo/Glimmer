import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, LayoutAnimation } from 'react-native';
import WidgetFrontPage from './UXElements/WidgetFrontPage';
import WidgetFavorites from './UXElements/WidgetFavorites';
import WidgetKudos from './UXElements/WidgetKudos';
import WidgetMessages from './UXElements/WidgetMessages';
import * as colors from '../Styles/colorConstants';

class PageStart extends React.Component {
  static navigatorButtons = {
    rightButtons: [
      {
        icon: require('../../icons/settings.png'),
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
        firebase.analytics().setCurrentScreen('start');
        LayoutAnimation.easeInEaseOut();
        await global.arbeidsMaur.forumUpdater.addFavorites(1, 1);
        LayoutAnimation.easeInEaseOut();
        global.arbeidsMaur.forumUpdater.addStream(1, 1);
        break;
    }
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'settings') {
        this.props.navigator.push({
          screen: 'glimmer.PageSettings',
          title: 'Innstillinger',
          animated: true,
        });
      }
    }
  }

  componentDidMount() {

  }

  getMessageWidget() {
    if (!this.props.settings.frontPageMessages) return null;
    return (<WidgetMessages navigator={this.props.navigator} />);
  }

  getKudosWidget() {
    if (!this.props.settings.frontPageKudos) return null;
    return (<WidgetKudos navigator={this.props.navigator} />);
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
        {/*this.getMessageWidget()*/}
        {/*this.getKudosWidget()*/}
        {this.getFrontPageWidget()}
        {this.getFavoritesWidget()}
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

export default connect(mapStateToProps)(PageStart);

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
