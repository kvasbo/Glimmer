/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import ReversedFlatList from "react-native-reversed-flat-list";
import {StyleSheet, View, TextInput, KeyboardAvoidingView} from "react-native";
import * as colors from "../Styles/colorConstants";
import ChatBubble from "./UXElements/ChatBubble";

class PageConversation extends React.Component {

    constructor(props) {

        super(props);
        this.onSend = this.onSend.bind(this);
        this.state = {refreshing: null}
    }

    componentWillMount() {

        arbeidsMaur.messageUpdater.getMessagesWithUser(this.props.user_id, 1);

    }

    parseMessage(mess) {

        //Mark as read!
        if (mess.dismissed_at === null) {
            arbeidsMaur.messageUpdater.setMessageAsRead(mess.id);
        }

        return mess;

    }

    _getMessages() {
        //No messages, or none loaded yet
        if (typeof this.props.messages[this.props.user_id] === "undefined") return [];

        var tmpMsgs = Object.values(this.props.messages[this.props.user_id]);

        tmpMsgs.sort((x, y) => {
            return (new Date(x.sent_at) - new Date(y.sent_at));
        })

        var out = tmpMsgs.map(this.parseMessage);

        // console.log("m3ssages", out);

        return out;

    }

    _loadMoreItems() {

    }

    _renderItem(item) {
        //console.log("Item", item);
        return (
            <ChatBubble message={item.item}/>
        )
    }

    componentDidMount() {

    }

    _refresh() {

    }

    onSend(messages = []) {

        arbeidsMaur.messageUpdater.sendMessageToUser(this.props.user_id, messages[0].text).then((data) => {
            arbeidsMaur.messageUpdater.getMessagesWithUser(this.props.user_id, 1);
        })
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="height" style={pageStyles.container}>

                <ReversedFlatList
                    style={pageStyles.chatWindow}
                    data={this._getMessages()}
                    onRefresh={() => this._refresh()}
                    refreshing={this.state.refreshing}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.id}
                    onEndReached={this._loadMoreItems}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={15}
                />

                <TextInput style={pageStyles.textWindow} />

            </KeyboardAvoidingView>
        );
    }
}

/*
 <GiftedChat
 locale="nb"
 messages={this._getMessages()}
 onSend={this.onSend}
 user={{
 _id: store.getState().AppStatus.activeUserId,
 }}
 />
 */

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
        flex: 1
    },
    textWindow: {
        height: 30,
        marginLeft: 0,
        marginRight: 0,
        padding: 10,
        borderTopWidth: 1,
        fontSize: 13,
        borderTopColor: colors.COLOR_LIGHT
    }
});

PageConversation.propTypes = {
    user_id: PropTypes.number.isRequired,
    messages: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        messages: state.Message
    }
}

export default connect(
    mapStateToProps
)(PageConversation)