/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import { ScrollView, StyleSheet, AsyncStorage, View } from 'react-native';
import SettingsList from 'react-native-settings-list';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from '../Styles/colorConstants';

export default class PageAnnet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nsfw: undefined };
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
          <SettingsList
            backgroundColor={colors.COLOR_WHITE}
            borderColor={colors.COLOR_LIGHTGREY}
            defaultItemSize={50}
          >
            <SettingsList.Item
              hasNavArrow={false}
              switchState={this.state.nsfw}
              switchOnValueChange={this.toggleNsfw}
              hasSwitch
              title="Skjul NSFW"
              icon={
                <View style={{height:30,marginLeft:10,alignSelf:'center'}}>
                  <Icon name="ios-nuclear" size={30} style={{ alignSelf: 'center', width: 30, height: 40, color: colors.COLOR_MIDGREY }} />
                </View>
              }
            />
            <SettingsList.Item
              hasNavArrow
              onPress={() => this.loadGjemsel()}
              title="Skammekroken"
              icon={
                <View style={{height:30,marginLeft:10,alignSelf:'center'}}>
                  <Icon name="ios-outlet" size={30} style={{ alignSelf: 'center', width: 30, height: 40, color: colors.COLOR_MIDGREY }} />
                </View>
              }
            />
            <SettingsList.Item
              hasNavArrow={false}
              onPress={() => this.logOut()}
              title="Logg ut"
              icon={
                <View style={{height:30,marginLeft:10,alignSelf:'center'}}>
                  <Icon name="ios-close-circle" size={30} style={{ alignSelf: 'center', width: 30, height: 40, color: colors.COLOR_MIDGREY }} />
                </View>
              }
            />
          </SettingsList>
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
