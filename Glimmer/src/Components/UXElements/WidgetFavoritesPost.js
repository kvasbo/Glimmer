
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
          <View style={pageStyles.title}>
            <Text numberOfLines={1}>{this.props.post.title}</Text>
            <Text style={pageStyles.time} numberOfLines={1}>{new Moment(this.props.post.updated_at).calendar()}</Text>
          </View>
          <Text style={pageStyles.unread} >{this.props.post.unread_comment_count}</Text>
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
    padding: 7,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'flex-start',
  },

  title: {
    flex: 1,
  },

  time: {
    color: colors.COLOR_MIDGREY,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '200',
  },

  unread: {
    textAlign: 'right',
    paddingRight: 10,
    paddingLeft: 20,
    color: colors.COLOR_MIDGREY,
  },

});
