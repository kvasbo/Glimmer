import React from 'react';
import { ScrollView, StyleSheet, Text, View, AlertIOS } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import ListPerson from './UXElements/ListPerson';

export default class PageGjemsel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { krok: [] };
    this.removeFromKrok = this.removeFromKrok.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        firebase.analytics().setCurrentScreen('gjemsel');
        break;
    }
  }

  componentWillMount() {
    this.updateKrok();
  }

  getList = () => {
    const out = this.state.krok.map(p => <ListPerson key={p} userId={p} onPress={this.removeFromKrok} />);
    return out;
  }

  updateKrok = () => {
    const krok = global.arbeidsMaur.gjemsel.getKrok();
    console.log('updateKrok', krok);
    this.setState({ krok });
  }

  removeFromKrok = (id) => {
    AlertIOS.alert(
      'Fjern blokkering',
      'Du vil begynne å se tingene du ikke ville se igjen. Ditt valg!',
      [
        {
          text: 'Avbryt',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        }, {
          text: 'Jeg vil se!',
          onPress: () => {
            this.doRemove(id);
          },
        },
      ],
    );
  }

  doRemove = async (id) => {
    await global.arbeidsMaur.gjemsel.removeFromKrok(id);
    this.updateKrok();
  }

  render() {
    return (
      <ScrollView style={pageStyles.container}>
        <List>
          {this.getList()}
        </List>
        <View style={{ paddingTop: 30 }}>
          <Text style={pageStyles.paragraf}>Dette er siden der de du ikke vil se i skogen er listet opp.</Text>
          <Text style={pageStyles.paragraf}>Merk: Denne listen synkroniseres ikke mellom enheter - fordi jeg (@kvasbo) ikke vil ha tilgang til å se dette. Av samme grunn er den heller ikke synkronisert med eventuell bruk av Gjemsel i Underskog.</Text>
          <Text style={pageStyles.paragraf}>For å legge til noen i lista, trykk på ... ved et innlegg de har laget og velg "blokkér".</Text>
          <Text style={pageStyles.paragraf}>For å fjerne, trykk på et navn.</Text>
        </View>
      </ScrollView>
    );
  }
}

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 30,
    paddingRight: 0,
  },
  paragraf: {
    margin: 5,
    marginLeft: 20,
    marginRight: 20,
  },
});
