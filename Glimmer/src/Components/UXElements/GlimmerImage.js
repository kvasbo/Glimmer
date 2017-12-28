import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, Linking, View } from 'react-native';

export default class GlimmerImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showing: false };
  }


  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.setState({ showing: true });
            Linking.openURL(this.props.uri);
          }}
        >
          <Image
            resizeMode="cover"
            source={{ uri: this.props.uri }}
            style={{ height: 240, width: '100%', marginBottom: 10, marginTop: 10 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

GlimmerImage.defaultProps = {
  size: 'large',
};

GlimmerImage.propTypes = {
  uri: PropTypes.string.isRequired,
  size: PropTypes.string,
};
