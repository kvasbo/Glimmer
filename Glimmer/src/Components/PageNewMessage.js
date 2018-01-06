/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import PersonFace from './UXElements/PersonFace';
import { clearMessageRecipients } from '../Redux/actions';
import InputStyles from '../Styles/InputStyles';
import * as colors from '../Styles/colorConstants';

export default class PageNewMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: null, receivers: [], buttonsActive: true };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        firebase.analytics().setCurrentScreen('melding_ny');
        break;
    }
  }

  componentDidMount() {
    this.setState({ receivers: store.getState().MessageRecipients.recipients });

    // Listen to state changes. This really needs to change at some later point.
    this.reduxUnsubscribe = store.subscribe(() => {
      const tmpRec = store.getState().MessageRecipients.recipients;

      if (tmpRec !== this.state.receivers) {
        this.setState({ receivers: tmpRec });
      }
    });
  }

  getReceivers() {
    const out = [];

    const users = store.getState().User;

    if (this.state.receivers.length === 0) {
      return (
        <Text style={{ margin: 10, color: 'white' }}>Ingen mottakere valgt. Skal du sende til ingen du da?</Text>);
    }

    for (const key in this.state.receivers) {
      const userId = this.state.receivers[key];

      // We have the user info!

      if (typeof (users[userId]) !== 'undefined') {
        out.push(<PersonFace key={key} person={users[userId]} active navigator={this.props.navigator} />);
      }
    }

    return out;
  }

  sendMessage() {
    if (this.state.text != '' && this.state.receivers.length > 0) {
      const sending = [];

      this.setState({ buttonsActive: false });

      for (const key in this.state.receivers) {
        sending.push(arbeidsMaur.messageUpdater.sendMessageToUser(this.state.receivers[key], this.state.text));
      }

      Promise.all(sending).then(() => {
        this.props.navigator.popToRoot();
      }).catch((err) => {
        Alert.alert('Svarte!', 'Dette gikk ikke :( Se i meldingslista hvilke som ble sendt, jeg aner ikke.');
      });
    } else {
      Alert.alert('Hoppsann', 'Ingen mottakere, eller tom melding.');
    }
  }

  _cancelMessage() {
    store.dispatch(clearMessageRecipients());
    this.props.navigator.popToRoot();
  }

  componentWillUnmount() {
    this.reduxUnsubscribe();
  }

  _onTextChange(text) {
    this.setState({ text });
  }

  render() {
    return (

      <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={64} style={pageStyles.container}>

        <View style={pageStyles.mottakere}>
          <ScrollView>

            <View style={pageStyles.faceList}>
              {this.getReceivers()}
            </View>

          </ScrollView>
        </View>

        <View style={{ flex: 1 }}>

          <TextInput
            textAlignVertical="top"
            autoCapitalize="sentences"
            multiline
            style={[InputStyles.textBox, { flex: 1 }]}
            onChangeText={text => this._onTextChange(text)}
            value={this.state.text}
            placeholder="Si noe koselig"
            placeholderTextColor={colors.COLOR_LIGHTGREY}
          />


        </View>

        <View style={{
                    height: 50,
                    padding: 3,
                    marginTop: 0,
                    marginBottom: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }}
        >

          <Button
            disabled={!this.state.buttonsActive}
            title="Avbryt"
            onPress={() => {
                        Alert.alert(
'Avbryt', 'Vil du avbryte? Meldingen går tapt.', [
                                {
                                    text: 'Nei',
onPress: () => {
                                },
                                },
                                { text: 'Ja', onPress: () => this._cancelMessage() },
                            ],
                            { cancelable: false },
);
                    }}
          />

          <Button
            title="Send"
            onPress={() => {
                        this.sendMessage();
                    }}
          />

        </View>


      </KeyboardAvoidingView>
    );
  }
}

PageNewMessage.propTypes = {
  navigator: PropTypes.object.isRequired,
};

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.COLOR_LIGHT,
    paddingLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
  },
  faceList: {
    margin: 0,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mottakere: {
    margin: 0,
    backgroundColor: colors.COLOR_DARKGREY,
    height: 100,
  },

});
