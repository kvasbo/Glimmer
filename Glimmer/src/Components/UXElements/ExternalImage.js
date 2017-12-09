/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image, Linking, TouchableOpacity } from 'react-native';

const config = require('../../../config');

export default class ExternalImage extends React.Component {
  constructor(props) {
    super(props);

    this.dim = Dimensions.get('window');
    this.maxWidth = this.dim.width - 50;
    this.state = { height: 0, width: 0, uri: null };

    this._isMounted = false;
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);

    this.uri = this.props.uri.replace('http://', 'https://');

    // Have we changed the uri? (added https)
    this.haveChanged = this.props.uri !== this.uri;
  }

  componentWillMount() {
    this._isMounted = true;

    this.getSize(this.uri);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getSize() {
    try {
      Image.getSize(this.uri, (width, height) => {
        const maxWidth = this.dim.width - 50;

        const factor = width / maxWidth;

        if (factor > 1) {
          var fixedWidth = Math.round(width / factor);
          var fixedHeight = Math.round(height / factor);
        } else {
          var fixedWidth = width;
          var fixedHeight = height;
        }

        if (this._isMounted) {
          this.setState({ height: fixedHeight, width: fixedWidth });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
                    Linking.openURL(this.props.uri);
                }}
      >
        <Image
          resizeMode="contain"
          source={{ uri: this.uri }}
          style={{ height: this.state.height, width: this.state.width }}
        />
      </TouchableOpacity>
    );
  }
}

ExternalImage.propTypes = {
  uri: PropTypes.string.isRequired,
};
