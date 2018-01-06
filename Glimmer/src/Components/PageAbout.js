import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import * as colors from '../Styles/colorConstants';
import textStyles from '../Styles/TextStyles';

export default class PageAbout extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        firebase.analytics().setCurrentScreen('about');
        break;
    }
  }

  render() {
    return (
      <ScrollView style={pageStyles.container}>
        <Text style={textStyles.paragraph}>
          Glimmer er et hobbyprosjekt som kvasbo driver med på fritida.
          Det vil derfor variere hvor ofte ting oppdateres, og hva som gjøres bestemmes helt av hva som virker moro.
          SLAen for denne appen kan dermed oppsummeres med "Trist og uproft, sees på Underskog".
        </Text>
        <Text style={textStyles.paragraph}>
          Å lage software er også jobben min, så graden av tiltakslyst vil variere med arbeidsbelastning, vær, etc.
        </Text>
        <Text style={textStyles.paragraph}>
          Har du tilbakemelding? Send meg en melding på Underskog da vel!
        </Text>
        <Text style={textStyles.paragraph}>
          Hvis du er nerd nok til å lure; appen lages med følgende hovedverktøy: React Native, Redux, Firebase.
        </Text>
      </ScrollView>
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
