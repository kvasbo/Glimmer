/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReversedFlatList from 'react-native-reversed-flat-list';
import { KeyboardAvoidingView, StyleSheet, TextInput, View } from 'react-native';
import * as colors from '../Styles/colorConstants';
import ChatBubble from './UXElements/ChatBubble';

class PageConversation extends React.Component {
    flatList = null;
    reloadTimer = null;

    constructor(props) {
      super(props);
      this.onSend = this.onSend.bind(this);
      this.state = { refreshing: null, text: null, lastPage: 1 };
      this.loadMoreItems = this.loadMoreItems.bind(this);
    }

    componentWillMount() {
      arbeidsMaur.messageUpdater.getMessagesWithUser(this.props.user_id, 1);
    }

    componentDidMount() {
      this.reloadTimer = setInterval(() => { arbeidsMaur.messageUpdater.getMessagesWithUser(this.props.user_id, 1); }, 5000);
    }

    componentWillUnmount() {
      clearInterval(this.reloadTimer);
    }

    getMessages() {
      // No messages, or none loaded yet
      if (typeof this.props.messages[this.props.user_id] === 'undefined') return [];
      const tmpMsgs = Object.values(this.props.messages[this.props.user_id]);
      tmpMsgs.sort((x, y) => (new Date(x.sent_at) - new Date(y.sent_at)));
      const out = tmpMsgs.map(parseMessage);
      return out;
    }

    loadMoreItems(distance) {
      const nextPage = this.state.lastPage + 1;
      arbeidsMaur.messageUpdater.getMessagesWithUser(this.props.user_id, nextPage).then(() => {
        this.setState({ lastPage: nextPage });
      });
    }

    renderItem(item) {
      return (
        <ChatBubble message={item.item} />
      );
    }

    refresh() {

    }

    setRef(item) {
      this.flatList = item;
    }

    onSend() {
      if (this.state.text !== null && this.state.text !== '') {
        const sendText = this.state.text;
        this.setState({ text: '' });

        arbeidsMaur.messageUpdater.sendMessageToUser(this.props.user_id, sendText).then((data) => {
          arbeidsMaur.messageUpdater.getMessagesWithUser(this.props.user_id, 1);

          if (this.flatList !== null) this.flatList.scrollToEnd();
        }).catch((err) => { console.log(err); });
      }
    }

    render() {
      return (
        <View style={pageStyles.container}>

          <KeyboardAvoidingView keyboardVerticalOffset={helpers.getPlatformDependentVars().keyboardAvoidingOffset} behavior="padding" style={{ flex: 1 }}>

            <ReversedFlatList
              style={pageStyles.chatWindow}
              data={this.getMessages()}
              onRefresh={() => this.refresh()}
              refreshing={this.state.refreshing}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => item.id}
              onEndReached={this.loadMoreItems}
              onEndReachedThreshold={0.5}
              initialNumToRender={15}
              ref={item => this.setRef(item)}
            />

            <TextInput
              style={pageStyles.textWindow}
              multiline={false}
              autoFocus={true}
              autoCapitalize="sentences"
              onSubmitEditing={() => this.onSend()}
              returnKeyType="send"
              placeholderTextColor={colors.COLOR_LIGHTGREY}
              placeholder="..."
              value={this.state.text}
              onChangeText={text => this.setState({ text })}
            />

          </KeyboardAvoidingView>
        </View>
      );
    }
}

function parseMessage(mess) {
  // Mark as read!
  if (mess.dismissed_at === null) {
    global.arbeidsMaur.messageUpdater.setMessageAsRead(mess.id);
  }
  return mess;
}


const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.COLOR_WHITE,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
  },
  chatWindow: {
    flex: 1,
  },
  textWindow: {
    height: 40,
    marginLeft: 0,
    marginRight: 0,
    padding: 10,
    borderTopWidth: 2,
    fontSize: 14,
    marginBottom: 10,
    borderTopColor: colors.COLOR_LIGHT,
  },
});

PageConversation.propTypes = {
  user_id: PropTypes.number.isRequired,
  messages: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    messages: state.Message,
  };
}

export default connect(mapStateToProps)(PageConversation);
