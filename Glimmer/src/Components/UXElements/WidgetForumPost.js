
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Tile } from 'react-native-elements';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { getImagesFromForumPost } from '../../helpers';
import * as colors from '../../Styles/colorConstants';

const colorSet = [
  { featured: false, back: colors.COLOR_WHEEL_1, text: colors.COLOR_WHITE, textBack: colors.COLOR_WHITE },
  { featured: false, back: colors.COLOR_WHEEL_2, text: colors.COLOR_WHITE, textBack: colors.COLOR_WHITE },
  { featured: false, back: colors.COLOR_WHEEL_3, text: colors.COLOR_BLACK, textBack: colors.COLOR_WHITE },
  { featured: false, back: colors.COLOR_WHEEL_4, text: colors.COLOR_BLACK, textBack: colors.COLOR_WHITE },
  { featured: false, back: colors.COLOR_WHEEL_5, text: colors.COLOR_WHITE, textBack: colors.COLOR_WHITE },
];

export default class WidgetForumPost extends React.Component {
  constructor(props) {
    super(props);
    this.images = getImagesFromForumPost(this.props.post.body);
    // console.log("img", this.images);
  }

  loadPost() {
    this.props.navigator.push({
      screen: 'glimmer.PageThread',
      title: this.props.post.title,
      passProps: { post: this.props.post },
    });
  }

  render() {

    const imageSrc = (this.images.length > 0) ? { uri: this.images[0].src } : null;
    const bgColor = (this.images.length > 0) ? colors.COLOR_DARKGREY : colors.COLOR_WHITE;
    const fontColor = (this.images.length > 0) ? colors.COLOR_WHITE : colors.COLOR_BLACK;

    let colorsForMe = { featured: true, back: colors.COLOR_BLACK, text: colors.COLOR_WHITE, textBack: colors.COLOR_WHITE };

    if (this.images.length === 0) {
      const colorSetId = (this.props.post.id % colorSet.length);
      colorsForMe = colorSet[colorSetId];
    }

    return (
      <View style={pageStyles.container}>
        <Tile
          onPress={() => this.loadPost()}
          height={100}
          width={150}
          featured={colorsForMe.featured}
          imageContainerStyle={{ backgroundColor: colorsForMe.back }}
          contentContainerStyle={{ backgroundColor: colorsForMe.back }}
          containerStyle={{ backgroundColor: colorsForMe.back }}
          iconContainerStyle={{ backgroundColor: colorsForMe.back }}
         // icon={name: "ios-next", color: colors.COLOR_MIDGREY, size: 40}
          imageSrc={imageSrc}
          title={this.props.post.title}
          // caption={new Moment(this.props.post.created_at).calendar()}
          titleNumberOfLines={5}
          titleStyle={{ fontSize: 12, fontWeight: '200', color: colorsForMe.text, backgroundColor: colorsForMe.back, padding: 5 }}
          captionStyle={{ fontSize: 10, fontWeight: '200', color: colorsForMe.text }}
        />
      </View>
    );
  }
}

WidgetForumPost.propTypes = {
  post: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
};

const pageStyles = StyleSheet.create({

  container: {
    backgroundColor: colors.COLOR_WHITE,
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 5,
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
