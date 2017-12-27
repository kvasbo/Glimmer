/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, ScrollView, StyleSheet, Text, View, Modal, Switch } from 'react-native';
import * as colors from '../Styles/colorConstants';

export default class PageLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { eulaAccepted: false, eulaVisible: false };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  doTheLoginThing() {
    auth.doUnderskogOauth().then(() => {
      this.props.navigator.dismissAllModals({
        animationType: 'slide-down', // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
      });

      arbeidsMaur.initData();
    });
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        this.onRefresh();
        firebase.analytics().setCurrentScreen("login");
        break;
    }
  }

  getEula() {
    return (
      <View style={[pageStyles.container, { alignItems: 'flex-start' }]}>
        <View style={pageStyles.paragraph}>
          <Text style={pageStyles.header}>Sluttbrukeravtale for Glimmer</Text>
          <Text style={pageStyles.mainText}>Ved å benytte denne appen godtar du at du må følge Underskogs medlemsavtale til punkt og prikke, inkludert reglene om hva som er tillatt å poste.</Text>
          <Text style={pageStyles.mainText}>Vi som lager appen har ikke noe ansvar for hva du måtte finne på av tøys, og står ikke ansvarlig for eventuelle feil som måtte oppstå.</Text>
          <Text style={pageStyles.mainText}>Vi lagrer ingen form for data om deg i våre systemer, og om vi en gang ved uhell skulle gjøre det vil vi slette dem så fort som mulig</Text>
          <View style={{ height: 20 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Switch value={this.state.eulaAccepted} onValueChange={() => { this.setState({ eulaAccepted: !this.state.eulaAccepted }); }} />
            <Text style={{ marginLeft: 20 }} >Jeg godtar sluttbrukeravtalen</Text>
          </View>
          <View style={{ height: 20 }} />
          <Button title="Lukk" onPress={() => { this.setState({ eulaVisible: false }); }} />
        </View>
      </View>
    );
  }

  render() {
    return (

      <View style={pageStyles.container}>
        <View style={{  }}>
            <View style={pageStyles.paragraph}>
              <Text style={pageStyles.header}>Velkommen til Glimmer</Text>
            </View>
            <View style={pageStyles.paragraph}>
              <Text style={pageStyles.mainText}>For å bruke denne appen må du gi den tilgang til din
                            Underskogkonto.
              </Text>
              <Text style={pageStyles.mainText}>Det gjør du ved å trykke på knappen og gi tillatelse når
                            Underskog åpner seg i din nettleser.
              </Text>
              <Text style={pageStyles.mainText}>Før du gjør dette må du også lese og godta sluttbrukeravtalen, som du kan se ved å trykke på knappen under.</Text>
              <View style={{ height: 20 }} />
              <Button title="Vis sluttbrukeravtale" onPress={() => this.setState({ eulaVisible: true })} />
              <Button title="Logg inn på Underskog" disabled={!this.state.eulaAccepted} onPress={() => this.doTheLoginThing()} />
            </View>
          
        </View>
        <Modal visible={this.state.eulaVisible}>
          {this.getEula()}
        </Modal>
      </View>
    );
  }
}

PageLogin.propTypes = {
  navigator: PropTypes.object.isRequired,
};

const pageStyles = StyleSheet.create({

  container: {
    backgroundColor: colors.WHITE,
    flex: 1,
    margin: 0,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  paragraph: {

    marginTop: 10,
    marginBottom: 10,
    marginLeft: 40,
    marginRight: 40,
    padding: 0,

  },

  theButton: {},

  header: {
    textAlign: 'center',
    fontSize: 24,
    color: colors.COLOR_BLACK,
    marginTop: 30,
    marginBottom: 7,
    fontWeight: '300',
  },

  mainText: {
    color: colors.COLOR_BLACK,
    textAlign: 'left',
    marginTop: 7,
    marginBottom: 7,
  },

  smallText: {
    textAlign: 'left',
    fontSize: 12,
    color: colors.COLOR_BLACK,
    marginTop: 7,
    marginBottom: 7,
  },

});
