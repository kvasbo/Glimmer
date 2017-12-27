import React from 'react';
import { connect } from 'react-redux';
import handleDeeplink from '../deepLink';
import Moment from 'moment';
import { ScrollView, StyleSheet } from 'react-native';
import WidgetFrontPage from './UXElements/WidgetFrontPage';
import WidgetFavorites from './UXElements/WidgetFavorites';
import * as colors from '../Styles/colorConstants';

class PageStart extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    console.log("PageStart", event);
    if (event.type === 'DeepLink') {
      handleDeeplink(this.props.navigator, event.link);
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
