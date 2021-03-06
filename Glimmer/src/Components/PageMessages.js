/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Divider from './UXElements/Divider';
import * as colors from '../Styles/colorConstants';

// Get common list styles
const listStyles = require('../Styles/ListStyles');

class PageMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = { conversations: [], refreshing: false };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this._onRefresh = this._onRefresh.bind(this);
  }

  updateUnreadCount() {
    const convos = this.props.conversations;

    let unread = null;

    for (key in convos) {
      if (convos[key].user_id !== 0 && convos[key].unread > 0) {
        unread += convos[key].unread;
      }
    }

    this.props.navigator.setTabBadge({
      badge: unread,
    });
  }

  static navigatorButtons = {
    rightButtons: [
      {
        icon: require('../../icons/plus.png'),
        id: 'newMessage', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
      },
    ],
  };

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        arbeidsMaur.messageUpdater.updateMessageThreads(1);
        firebase.analytics().setCurrentScreen('meldinger');
        this.updateUnreadCount();
        global.bgFetch.doBackgroundFetchStuff();
        break;
    }

    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'newMessage') { // this is the same id field from the static navigatorButtons definition
        this.props.navigator.push({
          screen: 'glimmer.PageKretsVelger', // unique ID registered with Navigation.registerScreen
          title: 'Velg mottakere', // navigation bar title of the pushed screen (optional)
          passProps: { mode: 'multiple', context: 'message' }, // Object that will be passed as props to the pushed screen (optional)
          animated: true, // does the push have transition animation or does it happen immediately (optional)
          backButtonTitle: 'Samtaler',
          navigatorButtons: {
            rightButtons: [
              {
                icon: require('../../icons/compose.png'),
                id: 'writeNewMessage', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
              },
            ],
          },
        });
      }
    }
  }

  componentWillMount() {
    arbeidsMaur.messageUpdater.updateMessageThreads(1);

    this.updateUnreadCount();
  }

  _onRefresh() {
    this.setState({ refreshing: true });

    arbeidsMaur.messageUpdater.updateMessageThreads(1).then(() => {
      this.setState({ refreshing: false });
    });
  }

  _renderItem(item) {
    return (<Conversation data={item.item} navigator={this.props.navigator} />);
  }

  _getUnread() {
    for (key in this.props.conversations) {
      // console.log('convo', this.props.conversations[key]);
    }
  }

  _getConversations() {
    const tmp = Object.values(this.props.conversations);

    tmp.sort((x, y) => (new Date(y.last_message_time) - new Date(x.last_message_time)));

    return tmp;
  }

  render() {
    this.updateUnreadCount();

    return (
      <FlatList
        style={pageStyles.container}
        data={this._getConversations()}
        renderItem={item => this._renderItem(item)}
        keyExtractor={item => item.user_id}
        onRefresh={this._onRefresh}
        refreshing={this.state.refreshing}
        initialNumToRender={15}
      />
    );
  }
}

class Conversation extends React.Component {
  constructor(props) {
    super(props);
  }

  getTime() {
    return global.helpers.getCalendarTime(this.props.data.last_message_time);
  }

  getMessageCount() {
    let uleste = 'uleste';
    if (this.props.data.unread == 1) uleste = 'ulest';

    const out = `${this.props.data.count} meldinger, ${this.props.data.unread} ${uleste}`;
    return out;
  }

  titleStyle() {
    if (this.props.data.unread == 0) {
      return listStyles.listTitle;
    }

    return listStyles.listTitleHighlight;
  }

  getImageUrl() {
    return this.props.data.user_image;
  }

  getImage() {
    const url = this.getImageUrl();

    if (url === 'https://underskog.no/assets/images/noicon_48.png') {
      return (<Image
        style={{ width: 40, height: 40, borderRadius: 20 }}
        source={require('../../icons/default_avatar.png')}
      />);
    }

    return <Image style={{ width: 40, height: 40, borderRadius: 20 }} source={{ uri: url }} />;
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.props.navigator.push({
                        screen: 'glimmer.PageConversation',
                        title: `Samtale med ${this.props.data.user}`,
                        passProps: { user_id: this.props.data.user_id },
                    })}
        >
          <View style={listStyles.whiteBox}>
            <View style={listStyles.imageBlock}>
              {this.getImage()}
            </View>
            <View style={listStyles.textBlock}>
              <Text style={this.titleStyle()}>{this.props.data.user}</Text>
              <Text style={listStyles.listSubtitle}>{this.getTime()}</Text>
              <Text style={listStyles.listSubtitle}>{this.getMessageCount()}</Text>

            </View>
            <View style={listStyles.iconBlock}>
              <Icon name="ios-arrow-forward" style={{ textAlign: 'right' }} color={colors.COLOR_LIGHTGREY} size={30} />
            </View>

          </View>
        </TouchableOpacity>
        <Divider />
      </View>
    );
  }
}

Conversation.propTypes = {
  data: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
};

PageMessages.propTypes = {
  navigator: PropTypes.object.isRequired,
  conversations: PropTypes.object.isRequired,
};

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

function mapStateToProps(state) {
  return {
    conversations: state.Conversation,
  };
}

export default connect(mapStateToProps)(PageMessages);
