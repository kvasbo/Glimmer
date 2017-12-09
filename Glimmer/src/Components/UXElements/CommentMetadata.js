/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as colors from '../../Styles/colorConstants';

export default class CommentMetadata extends React.Component {
  constructor(props) {
    super(props);
  }

  getTime() {
    return helpers.getCalendarTime(this.props.time);
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
          source={{ uri: this.props.image }}
        />
      );
    }

    render() {
      const forumText = (typeof this.props.forum === 'undefined') ? '' : this.props.forum;

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
            <Text style={[{ color, fontSize: 12 }]}>{this.props.name} {this.getTime()}</Text>
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
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  forum: PropTypes.string,
  showImage: PropTypes.bool,
  byStarter: PropTypes.bool, // Av trådstarter
};

