/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import { ScrollView, StyleSheet, AsyncStorage, View } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from '../Styles/colorConstants';

export default class PageAnnet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nsfw: undefined };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        firebase.analytics().setCurrentScreen("innstillinger");
        break;
    }
  }

  componentWillMount() {
    this.getNsfw();
  }

    writeSetting = async (key, value) => {
      await AsyncStorage.setItem(`settings_${key}`, value);
    }

    readSetting = async (key) => {
      const value = await AsyncStorage.getItem(`settings_${key}`);
      if (value !== null) {
        return value;
      }
      this.writeSetting(key, '0');
      return false;
    }

    getNsfw = async () => {
      const nsfw = await this.readSetting('hide_nsfw');
      if (nsfw === '0') this.setState({ nsfw: false });
      else this.setState({ nsfw: true });
    }

    loadGjemsel() {
      this.props.navigator.push({
        screen: 'glimmer.PageGjemsel',
        title: 'Skammekroken',
      });
    }

    toggleNsfw = async () => {
      if (this.state.nsfw === true) {
        this.setState({ nsfw: false });
        this.writeSetting('hide_nsfw', '0');
      } else {
        this.setState({ nsfw: true });
        this.writeSetting('hide_nsfw', '1');
      }
    }

    logOut = async () => {
      await global.auth.logOut();
    }

    render() {
      return (
       
        <ScrollView style={pageStyles.container}>
          <List>
            <ListItem
              key="nsfw"
              title="Skjul voksent innhold"
              hideChevron
              switchButton
              switched={this.state.nsfw}
              onSwitch={this.toggleNsfw}
              // leftIcon={{ name: 'award', type: 'feather' }}
              // onPress={() => { this.loadKudos(); }}
            />
            <ListItem
              key="skammekrok"
              title="Skammekroken"
              onPress={() => { this.loadGjemsel(); }}
            />
            <ListItem
              key="logout"
              title="Logg ut"
              hideChevron
              onPress={() => { this.logOut(); }}
            />
          </List>
        </ScrollView>
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
