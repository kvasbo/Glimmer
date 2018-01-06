/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Button, Text, AlertIOS, ActionSheetIOS } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from '../../Styles/colorConstants';


export default class PostMoreStuffButton extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  reportItem() {
    AlertIOS.prompt(
      'Rapportér innlegg',
      'Dersom du ønsker det kan du skrive en begrunnelse her. OBS: Rapporter sendt herfra går foreløpig til @kvasbo, ikke til gartnerne.',
      [
        {
          text: 'Avbryt',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Rapportér',
          onPress: (rapport) => {
            const message = `Rapport fra Glimmer.\r\nType: ${this.props.itemType}\r\nId: ${this.props.itemId}\r\nMelding: ${rapport}`;
            global.arbeidsMaur.messageUpdater.sendMessageToUser(1699, message);
          },
        },
      ],
    );
  }

  blockAuthor() {
    AlertIOS.alert(
      'Blokkér forfatter',
      'Du vil ikke se flere innlegg fra denne personen før du eventuelt fjerner hen fra skammekroken.',
      [
        {
          text: 'Avbryt',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Skammekrok',
          onPress: () => {
            global.arbeidsMaur.gjemsel.addToKrok(this.props.itemAuthorId);
          },
        },
      ],
    );
  }

  showSheet() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Rapporter', 'Blokker forfatter', 'Lukk'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          this.reportItem();
        } else if (buttonIndex === 1) {
          this.blockAuthor();
        }
      },
    );
  }

  render() {
    return (
      <View>
        <Icon name="ios-more" size={20} onPress={() => { this.showSheet(); }} />
      </View>
    );
  }
}

PostMoreStuffButton.propTypes = {
  itemType: PropTypes.string.isRequired,
  itemId: PropTypes.number.isRequired,
  itemAuthorId: PropTypes.number.isRequired,
};

const pageStyles = StyleSheet.create({
  modal: {
    backgroundColor: colors.COLOR_LIGHT,
    flex: 1,
    margin: 0,
    padding: 30,
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
