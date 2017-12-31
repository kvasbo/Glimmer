/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import { ScrollView, StyleSheet, AsyncStorage, View, Text } from 'react-native';
import { List, ListItem, Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from '../Styles/colorConstants';

export default class PageAnnet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nsfw: undefined, frontPageFavorites: undefined, frontPageNewPosts: undefined };
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
    this.setState({ frontPageFavorites: arbeidsMaur.settings.getSettings().frontPageFavorites, frontPageNewPosts: arbeidsMaur.settings.getSettings().frontPageNewPosts });
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

    changeFrontPageFavorites(value) {
      arbeidsMaur.settings.setFrontPageFavorites(value);
      this.setState({ frontPageFavorites: value });
    }

    changeFrontPageNewPosts(value) {
      arbeidsMaur.settings.setFrontPageNewPosts(value);
      this.setState({ frontPageNewPosts: value });
    }

    logOut = async () => {
      await global.auth.logOut();
    }

    render() {
      const favoritesWord = (this.state.frontPageFavorites === 1) ? 'favoritt' : 'favoritter';
      const newPostsWord = (this.state.frontPageNewPosts === 1) ? 'nytt' : 'nye';

      return (
        <ScrollView style={pageStyles.container}>
          <List>
            <ListItem
              key="frontpageFavorites"
              title={`Vis ${this.state.frontPageFavorites} ${favoritesWord} på forsiden`}
              hideChevron
              subtitle={
                <Slider
                  minimumValue={0}
                  maximumValue={20}
                  style={{ marginLeft: 10, marginRight: 10 }}
                  value={this.state.frontPageFavorites}
                  onValueChange={v => this.changeFrontPageFavorites(v)}
                  thumbTintColor={colors.COLOR_GRAD1}
                  step={1}
                />
              }
            />
            <ListItem
              key="frontpageNew"
              title={`Vis ${this.state.frontPageNewPosts} ${newPostsWord} innlegg på forsiden`}
              hideChevron
              subtitle={
                <Slider
                  minimumValue={0}
                  maximumValue={20}
                  style={{ marginLeft: 10, marginRight: 10 }}
                  value={this.state.frontPageNewPosts}
                  onValueChange={v => this.changeFrontPageNewPosts(v)}
                  thumbTintColor={colors.COLOR_GRAD1}
                  step={1}
                />
              }
            />
          </List>
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
          </List>
          <List>
            <ListItem
              key="about"
              title="Om Glimmer"
              // leftIcon={{ name: 'ios-information-circle', type: 'ionicon' }}
              onPress={() => { this.loadAbout(); }}
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
