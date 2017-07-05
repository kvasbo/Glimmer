/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {StyleSheet} from "react-native";
import {GiftedChat} from "react-native-gifted-chat";
import * as colors from "../Styles/colorConstants"

export default class PageConversation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {messages: []};
        this.onSend = this.onSend.bind(this);
        this.parseMessageForGiftedChat = this.parseMessageForGiftedChat.bind(this);
    }

    componentWillMount() {

        arbeidsMaur.messageUpdater.getMessagesWithUser(this.props.user.id).then((result) => {

            var msg = [];

            for (message in result) {
                var m = this.parseMessageForGiftedChat(result[message]);
                msg.push(m);
            }

            this.setState({messages: msg});

        })
    }

    parseMessageForGiftedChat(mess) {

        //Mark as read!
        if (mess.dismissed_at === null) {
            arbeidsMaur.messageUpdater.setMessageAsRead(mess.id);
        }

        var userInfo = mess.from;

        out = {};
        out._id = mess.id;
        out.text = mess.body.replace(/<(?:.|\n)*?>/gm, '');
        ;
        out.createdAt = mess.sent_at;
        out.user = {};
        out.user._id = userInfo.id;
        out.user.name = userInfo.name;
        out.user.avatar = userInfo.image_url;

        return out;

    }

    componentDidMount() {

    }

    onSend(messages = []) {

        arbeidsMaur.messageUpdater.sendMessageToUser(this.props.user.id, messages[0].text).then((data) => {
            console.log(data);
        })

        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
    }

    render() {
        return (
            <GiftedChat
                locale="nb"
                messages={this.state.messages}
                onSend={this.onSend}
                user={{
                    _id: auth.currentUser.id,
                }}
            />
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