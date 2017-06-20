/**
 * Created by kvasbo on 31.05.2017.
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    AsyncStorage,
    TouchableOpacity
} from 'react-native';
import {Card, Icon, Badge, Divider} from 'react-native-elements'
import ForumText from "./ForumText";

export default class PageMessages extends React.Component {

    constructor(props) {
        super(props);

        this.state = {messages: []};

        this.readFromCache();

        this.getMessageThreads();

    }

    static navigationOptions = ({navigation}) => ({
        title: "Meldingstråder",
    });

    componentDidMount() {

    }

    readFromCache() {
        AsyncStorage.getItem('@Cache:Conversations', (err, result) => {
            if (!err && result !== null) {
                var resultP = JSON.parse(result);
                //console.log(resultP);
                this.setState({conversations: resultP.data})
            }
        });
    }

    getMessageThreads() {

        var uri = "/messages/conversations";

        auth.makeApiGetCall(uri).then((data) => {

            try {
                AsyncStorage.setItem('@Cache:Conversations', JSON.stringify(data));
            } catch (error) {
                // Error saving data
            }

            this.setState({conversations: data.data});

        })

    }

    getMessages() {

        var out = [];

        for (conversation in this.state.conversations) {
            out.push(<Conversation key={this.state.conversations[conversation].user.name}
                                   data={this.state.conversations[conversation]}
                                   navigator={this.props.navigator}
            />);
        }

        return out;
    }


    render() {

        return (
            <ScrollView style={pageStyles.container}>
                {this.getMessages()}
            </ScrollView>
        );
    }
}

class Conversation extends React.Component {

    iSentTheLastOne = false;

    constructor(props){

        super(props);

        if(this.props.data.last_message.from.name === global.loggedInUserName) //from global scope
        {
            this.iSentTheLastOne = true;
        }

    }

    getTime()
    {

        return new moment(this.props.data.last_message.sent_at).calendar();

    }

    getMessageCount()
    {
        return (
            <Text>{this.props.data.message_count} meldinger, {this.props.data.unread_count} uleste.</Text>
        )
    }

    getAvsender()
    {
        if(this.iSentTheLastOne)
        {
            return (<Text>(siste melding sendt av deg)</Text>)
        }
        else {
            return (<Text>(siste melding sendt av {this.props.data.user.name})</Text>)
        }
    }


    render() {

      //  console.log(this.props.data);

        return (
            <TouchableOpacity
                onPress={ () => this.props.navigator.push({
                    screen: 'glimmer.PageConversation',
                    title: 'Chat med '+this.props.data.user.name,
                    passProps: {user:this.props.data.user}
                })}
            >
                <Card title={this.props.data.user.name}>
                    <Text>{this.getTime()}</Text>
                    {this.getAvsender()}
                    {this.getMessageCount()}
                    <ForumText text={this.props.data.last_message.body} cut={false} images={true}/>
                </Card>
            </TouchableOpacity>
        )

    }

}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCCCCC',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
});