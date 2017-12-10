/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, ListItem } from 'react-native-elements';

export default class PageAnnet extends React.Component {
  constructor(props) {
    super(props);
  }

  loadKudos() {
    this.props.navigator.push({
      screen: 'glimmer.PageKudos',
      title: 'Kudos',
    });
  }

  loadSettings() {
    this.props.navigator.push({
      screen: 'glimmer.PageSettings',
      title: 'Innstillinger',
    });
  }

  loadAbout() {
    this.props.navigator.push({
      screen: 'glimmer.PageAbout',
      title: 'Om Glimmer',
    });
  }

  componentDidMount() {

  }

  render() {
    return (
      <List>
        <ListItem
          key="kudos"
          title="Kudos"
          onPress={() => { this.loadKudos(); }}
        />
        <ListItem
          key="settings"
          title="Innstillinger"
          onPress={() => { this.loadSettings(); }}
        />
        <ListItem
          key="about"
          title="Om Glimmer"
          onPress={() => { this.loadAbout(); }}
        />
      </List>
    );
  }
}
