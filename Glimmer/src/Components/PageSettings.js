import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, AsyncStorage, View, Text, Alert } from 'react-native';
import { List, ListItem, Slider } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from '../Styles/colorConstants';

class PageSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showPermissonWarning: false, settings: this.props.settings, nsfw: undefined, frontPageFavorites: undefined, frontPageNewPosts: undefined };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        firebase.analytics().setCurrentScreen('innstillinger');
        break;
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
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

    toggleWidgetMeldinger = async () => {
      if (this.props.settings.frontPageMessages === true) {
        await arbeidsMaur.settings.setFrontPageMessages(false);
      } else {
        await arbeidsMaur.settings.setFrontPageMessages(true);
      }
      this.updateState();
    }


    toggleWidgetKudos = async () => {
      if (this.props.settings.frontPageKudos === true) {
        await arbeidsMaur.settings.setFrontPageKudos(false);
      } else {
        await arbeidsMaur.settings.setFrontPageKudos(true);
      }
      this.updateState();
    }

    toggleNotifyMessages = async () => {

      const allowed = await global.firebase.messaging().requestPermissions();
      if (!allowed.allowed) {
        Alert.alert('Tullekopp.', 'Du sa nei til å motta notifikasjoner da du ble spurt. Fiks dette i Innstillinger på telefonen for å få slå på denne her. ...og ikke la det skje igjen!');
        return false;
      }

      if (this.props.settings.notifyMessages === true) {
        await arbeidsMaur.settings.setNotifyMessages(false);
      } else {
        await arbeidsMaur.settings.setNotifyMessages(true);
      }
      global.bgFetch.doBackgroundFetchStuff();
      this.updateState();
      return true;
    }

    toggleNotifyMessagesIgnoreRabbit = async () => {
      if (this.props.settings.notifyMessagesIgnoreRabbit === true) {
        await arbeidsMaur.settings.setNotifyMessagesIgnoreRabbit(false);
      } else {
        await arbeidsMaur.settings.setNotifyMessagesIgnoreRabbit(true);
      }
      global.bgFetch.doBackgroundFetchStuff();
      this.updateState();
    }

    updateState() {
      this.setState({ settings: this.props.settings });
    }

    loadAbout() {
      this.props.navigator.push({
        screen: 'glimmer.PageAbout',
        title: 'Om Glimmer',
      });
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

/*
<ListItem
              key="forsideKudos"
              title="Kudos på forsida"
              hideChevron
              switchButton
              switched={this.state.settings.frontPageKudos}
              onSwitch={this.toggleWidgetKudos}
            />
            <ListItem
              key="forsideMeldinger"
              title="Meldinger på forsida"
              hideChevron
              switchButton
              switched={this.state.settings.frontPageMessages}
              onSwitch={this.toggleWidgetMeldinger}
            />
*/

    render() {
      const favoritesWord = (this.state.frontPageFavorites === 1) ? 'ulest' : 'uleste';
      const newPostsWord = (this.state.frontPageNewPosts === 1) ? 'nytt' : 'nye';

      return (
        <ScrollView style={pageStyles.container}>
          <List>
          
            <ListItem
              key="frontpageFavorites"
              title={`Vis ${this.state.frontPageFavorites} ${favoritesWord} på forsida`}
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
              title={`Vis ${this.state.frontPageNewPosts} ${newPostsWord} innlegg på forsida`}
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
              key="notifyMessages"
              title="Merk ikon ved uleste meldinger"
              hideChevron
              switchButton
              switched={this.state.settings.notifyMessages}
              onSwitch={this.toggleNotifyMessages}
            />
            <ListItem
              key="notifyMessagesIgnoreRabbit"
              title="...men ignorer Systemkaninen"
              subtitle="Den masekråka"
              hideChevron
              switchButton
              switchDisabled={!this.state.settings.notifyMessages}
              switched={this.state.settings.notifyMessagesIgnoreRabbit}
              onSwitch={this.toggleNotifyMessagesIgnoreRabbit}
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

function mapStateToProps(state) {
  return {
    settings: state.Settings,
  };
}

export default connect(mapStateToProps)(PageSettings);
