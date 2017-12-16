/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import GlimmerAvatar from './GlimmerAvatar';
import * as colors from '../../Styles/colorConstants';

export default class CommentMetadata extends React.Component {
  constructor(props) {
    super(props);
  }

  getTime() {
    return helpers.getCalendarTime(this.props.post.created_at);
  }

    styles = StyleSheet.create({
      element: {
        margin: 0,
        marginRight: 6,
      },
    })

    getForumTitle() {
      if (typeof this.props.forum === 'undefined') return null;


      return (
        <Text style={[this.styles.element, { color: colors.COLOR_MIDGREY, fontSize: 12 }]}>{this.props.forum}</Text>
      );
    }

    getPicture() {
      if (!this.props.showImage) return null;

      return (
        <Image
          style={[this.styles.element, { width: 24, height: 24, borderRadius: 12 }]}
          source={{ uri: this.props.post.creator_image }}
        />
      );
    }

    render() {
      const forumText = (typeof this.props.post.forum_title === 'undefined') ? '' : this.props.post.forum_title;
      const color = (this.props.byStarter) ? colors.COLOR_GRAD2 : colors.COLOR_MIDGREY;

      return (
        <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginLeft: 10,
                marginRight: 10,
                flex: 1,
            }}
        >
          {this.getPicture()}
          <View style={{ flexDirection: 'column' }}>
            <Text style={[{ color, fontSize: 12 }]}>{this.props.post.creator_name} {this.getTime()}</Text>
            {this.getForumTitle()}
          </View>

        </View>
      );
    }
}

CommentMetadata.defaultProps = {
  showImage: true,
  byStarter: false,
};

CommentMetadata.propTypes = {
  post: PropTypes.object.isRequired,
  showImage: PropTypes.bool,
  byStarter: PropTypes.bool, // Av trådstarter
};

