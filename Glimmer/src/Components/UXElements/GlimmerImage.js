import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, Linking, View, ActionSheetIOS } from 'react-native';
import ImageViewer from 'ImageViewer';

export default class GlimmerImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false,
      curIndex: 0,
    };
  }

  imgsArr = [
    this.props.uri,
  ];

  closeViewer() {
    this.setState({
      shown: false,
      curIndex: 0,
    });
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.setState({ shown: true });
            // Linking.openURL(this.props.uri);
          }}
          onLongPress={() => {
            const options = { url: this.props.uri };
            ActionSheetIOS.showShareActionSheetWithOptions(options, (error) => { console.log(error); }, (success, method) => { console.log(success, method); });
          }}
        >
          <Image
            resizeMode="cover"
            source={{ uri: this.props.uri }}
            style={{
 height: 240, width: '100%', marginBottom: 10, marginTop: 10,
}}
          />
        </TouchableOpacity>
        <ImageViewer
          shown={this.state.shown}
          imageUrls={this.imgsArr}
          onClose={this.closeViewer.bind(this)}
          index={this.state.curIndex}
        />
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
