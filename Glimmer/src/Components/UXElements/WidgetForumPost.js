
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { getImagesFromForumPost } from '../../helpers';
import * as colors from '../../Styles/colorConstants';

const height = 140;
const width = 150;

const colorSet = [
  { back: colors.COLOR_WHEEL_1, text: colors.COLOR_WHITE, textBack: colors.COLOR_WHITE },
  { back: colors.COLOR_WHEEL_2, text: colors.COLOR_WHITE, textBack: colors.COLOR_WHITE },
  { back: colors.COLOR_WHEEL_3, text: colors.COLOR_BLACK, textBack: colors.COLOR_WHITE },
  { back: colors.COLOR_WHEEL_4, text: colors.COLOR_BLACK, textBack: colors.COLOR_WHITE },
  { back: colors.COLOR_WHEEL_5, text: colors.COLOR_WHITE, textBack: colors.COLOR_WHITE },
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


  getTileWithPicture() {
    const imageSrc = { uri: this.images[0].src };
    return (
      <TouchableOpacity onPress={() => this.loadPost()}>
        <View style={[pageStyles.container, { backgroundColor: colors.COLOR_BLACK }]}>
          <Image
            resizeMode="cover"
            style={{
 position: 'absolute', left: 0, top: 0, width, height,
}}
            source={imageSrc}
          />
          <View
            style={{
              position: 'absolute',
              padding: 10,
              bottom: 0,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
            <Text
              numberOfLines={3}
              style={{
 fontSize: 12, fontWeight: '300', color: colors.COLOR_WHITE, backgroundColor: colors.COLOR_BLACK, padding: 10, opacity: 0.9,
}}
            >
              {this.props.post.title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  getTileNoPicture() {
    const colorSetId = (this.props.post.id % colorSet.length);
    colorsForMe = colorSet[colorSetId];

    return (
      <View style={[pageStyles.container, { backgroundColor: colorsForMe.back }]}>
        <View
          style={{
            position: 'absolute',
            padding: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <Text
            numberOfLines={5}
            style={{
 fontSize: 12, fontWeight: '200', color: colorsForMe.text, backgroundColor: colorsForMe.back, padding: 10,
}}
          >
            {this.props.post.title}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.loadPost()}>
        {(this.images.length > 0) ? this.getTileWithPicture() : this.getTileNoPicture()}
      </TouchableOpacity>
    );
  }
}

WidgetForumPost.propTypes = {
  post: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
};

const pageStyles = StyleSheet.create({

  container: {
    backgroundColor: colors.COLOR_LIGHT,
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 5,
    alignItems: 'center',
    height,
    width,
  },

});
