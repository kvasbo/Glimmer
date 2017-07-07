/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {connect} from "react-redux";
import {StyleSheet, View} from "react-native";
import {GiftedChat} from "react-native-gifted-chat";
import * as colors from "../Styles/colorConstants";

class PageConversation extends React.Component {

    constructor(props) {

        super(props);
        this.onSend = this.onSend.bind(this);
    }

    componentWillMount() {

        arbeidsMaur.messageUpdater.getMessagesWithUser(this.props.user_id, 1);

    }

    parseMessageForGiftedChat(mess) {

        //Mark as read!
        if (mess.dismissed_at === null) {
            arbeidsMaur.messageUpdater.setMessageAsRead(mess.id);
        }

        out = {};
        out._id = mess.id;
        out.text = mess.body.replace(/<(?:.|\n)*?>/gm, '');

        out.createdAt = mess.sent_at;
        out.user = {};
        out.user._id = mess.from_id;
        out.user.name = mess.from_name;
        out.user.avatar = mess.from_image;

        return out;

    }

    _getMessages() {
        //No messages, or none loaded yet
        if (typeof this.props.messages[this.props.user_id] === "undefined") return [];

        var tmpMsgs = Object.values(this.props.messages[this.props.user_id]);

        tmpMsgs.sort((x, y) => {
            return (new Date(y.sent_at) - new Date(x.sent_at));
        })

        var out = tmpMsgs.map(this.parseMessageForGiftedChat);

        return out;

    }

    componentDidMount() {

    }

    onSend(messages = []) {

        arbeidsMaur.messageUpdater.sendMessageToUser(this.props.user_id, messages[0].text).then((data) => {
            arbeidsMaur.messageUpdater.getMessagesWithUser(this.props.user_id, 1);
        })
    }

    render() {
        return (
            <View style={pageStyles.container}>
                <GiftedChat
                    locale="nb"
                    messages={this._getMessages()}
                    onSend={this.onSend}
                    user={{
                        _id: store.getState().AppStatus.activeUserId,
                    }}
                />
            </View>
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

function mapStateToProps(state) {
    return {
        messages: state.Message
    }
}

export default connect(
    mapStateToProps
)(PageConversation)