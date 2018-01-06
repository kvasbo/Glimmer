
import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { View, StyleSheet, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import openMap from 'react-native-open-maps';
import * as colors from '../../Styles/colorConstants';

export default class EventData extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  getMapLink() {
    if (this.props.event.venue.location.lat && this.props.event.venue.location.lon) {
      return <Icon name="ios-map" size={25} color={colors.COLOR_GRAD1} onPress={() => this.openMap()} />;
    }
  }

  openMap() {
    openMap({ latitude: this.props.event.venue.location.lat, longitude: this.props.event.venue.location.lon });
  }

  render() {
    return (
      <View style={pageStyles.container}>
        <Text>Sted:</Text>
        <Text>{this.props.event.venue.title}, {this.props.event.venue.address} {this.getMapLink()}</Text>
        <Text>Tid:</Text>
        <Text>{new Moment(this.props.event.time).calendar()}</Text>
      </View>
    );
  }
}

EventData.propTypes = {
  event: PropTypes.object.isRequired,
};

const pageStyles = StyleSheet.create({

  container: {
    backgroundColor: colors.COLOR_WHITE,
    flex: 1,
  },

});
