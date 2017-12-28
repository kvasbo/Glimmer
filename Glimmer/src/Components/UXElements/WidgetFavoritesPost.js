
import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from '../../Styles/colorConstants';

export default class WidgetFavoritesPost extends React.Component {
  loadPost() {
    this.props.navigator.push({
      screen: 'glimmer.PageThread',
      title: this.props.post.title,
      passProps: { post: this.props.post },
    });
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.loadPost()}>
        <View style={pageStyles.container}>
          <Text style={pageStyles.title} numberOfLines={1} >{this.props.post.title}</Text>
          <Text style={pageStyles.unread} >{this.props.post.unread_comment_count}</Text>
          <Icon name="ios-arrow-forward" style={{ textAlign: 'right', paddingTop: 2, paddingRight: 5 }} color={colors.COLOR_LIGHTGREY} size={20} />
        </View>
      </TouchableOpacity>
    );
  }
}

WidgetFavoritesPost.propTypes = {
  post: PropTypes.object,
  navigator: PropTypes.object,
};

const pageStyles = StyleSheet.create({

  container: {
    backgroundColor: colors.COLOR_WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 32,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
  },

  title: {
    flex: 1,
  },

  unread: {
    width: 40,
    textAlign: 'center',
    paddingRight: 10,
    color: colors.COLOR_MIDGREY,
  },

});
