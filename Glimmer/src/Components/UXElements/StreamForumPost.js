import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommentMetadata from './CommentMetadata';
import ForumTextTextile from './ForumTextTextile';
import PostControls from './PostControls';
import * as colors from '../../Styles/colorConstants';

const DomParser = require('xmldom').DOMParser;

export default class StreamForumPost extends React.Component {
    images = [];
    byMe = false;

    constructor(props) {
      super(props);
      this.state = { showText: false };

      try {
        if (this.props.data.creator_id === store.getState().AppStatus.activeUserId) {
          this.byMe = true;
        }
      } catch (err) {
        console.log('error parsing', this.props);
      }

      this.images = this.getImages();
    }


    getTime() {
      return helpers.getCalendarTime(this.props.data.created_at);
    }

    getImages() {
      const imgOut = [];

      try {
        let body = '<html></html>';

        if (typeof (this.props.data.body) !== 'undefined') {
          body = this.props.data.body;
        }

        const doc = new DomParser().parseFromString(body, 'text/html');

        const images = doc.getElementsByTagName('img');

        for (let i = 0; i <= 1; i++) {
          if (typeof (images[i]) !== 'undefined') {
            for (const attr in images[i].attributes) {
              if (images[i].attributes[attr].name === 'src') {
                const uri = `https:${images[i].attributes[attr].value}`;
                const image = {
                  src: uri, id: null, width: null, height: null,
                };
                imgOut.push(image);
              }
            }
          } else {
            break;
          }
        }
      } catch (err) {
        console.log(err);
      }

      return imgOut;
    }

    getHeader() {
      if (this.images.length === 0) {
        return (
          <View style={pageStyles.title}>
            <Text style={pageStyles.titleText}>{this.props.data.title}</Text>
          </View>
        );
      } else {
        return (
          <View style={pageStyles.image}>
            <Image style={{ flex: 1 }} source={{ uri: this.images[0].src }} />
            <Text style={pageStyles.textOnImage}>{this.props.data.title}</Text>
          </View>
        )
      }
    }

    render() {
      return (

        <View style={pageStyles.container}>
          <TouchableOpacity
            onPress={() => this.props.navigator.push({
                        screen: 'glimmer.PageThread',
                        title: this.props.data.title,
                        passProps: { post: this.props.data },
                    })}
          >
            <View>
              <View>
                {this.getHeader()}
              </View>
              <View style={{ margin: 5, marginLeft: 6, marginBottom: 0, marginRight: 6 }}>
                <PostControls post={this.props.data} showControls={false} showCommentCount navigator={this.props.navigator} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
}

StreamForumPost.propTypes = {
  data: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
};

const pageStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.COLOR_WHITE,
    padding: 0,
    paddingBottom: 10,
    marginTop: 7,
    flex: 1,
  },
  title: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 8,
    paddingBottom: 0,
    backgroundColor: colors.COLOR_WHITE,
  },
  titleText: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    textAlign: 'left',
    fontSize: 25,
    fontWeight: '300',
    color: colors.COLOR_BLACK,
  },
  creatorInfo: {
    margin: 0,
    marginLeft: 15,
    marginRight: 15,
    color: colors.COLOR_MIDGREY,
  },
  image: {
    marginTop: 0,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 0,
    height: 110,
  },
  textOnImage: {
    position: 'absolute',
    width: '100%',
    color: colors.COLOR_WHITE,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    fontSize: 25,
    fontWeight: '300',
    padding: 8,
    paddingLeft: 15,
  },
  metaDataBox: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 5,
  },
  metaData: {
    flex: 1,
    justifyContent: 'space-between',
    margin: 0,
  },
});
