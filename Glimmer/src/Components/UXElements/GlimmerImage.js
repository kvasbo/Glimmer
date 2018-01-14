import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, Linking, View, ActionSheetIOS, Text } from 'react-native';
import ImageViewer from 'ImageViewer';

const viewHeight = 240;

export default class GlimmerImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false,
      uri: this.props.uri,
      triedPng: false,
      triedGif: false,
      triedJpg: false,
      triedJpeg: false,
      failed: false,
    };
  }

  closeViewer() {
    this.setState({
      shown: false,
    });
  }

  /**
   * Hack to handle the fact that we do not know the extension of internal files. Will try four extensions, then give up.
   * @param {*} e 
   */
  onError(e) {
    if (!this.state.triedPng) {
      this.setState({ triedPng: true, uri: this.setExtensionTo('png') });
    } else if (!this.state.triedGif) {
      this.setState({ triedPng: true, triedGif: true, uri: this.setExtensionTo('gif') });
    } else if (!this.state.triedJpg) {
      this.setState({ triedJpg: true, triedPng: true, triedGif: true, uri: this.setExtensionTo('jpg') });
    } else if (!this.state.triedJpeg) {
      this.setState({ triedJpeg: true, triedJpg: true, triedPng: true, triedGif: true, uri: this.setExtensionTo('jpeg') });
    } else {
      this.setState({ failed: true, triedJpeg: true, triedJpg: true, triedPng: true, triedGif: true });
    }
  }

  setExtensionTo(ext) {
    let file = this.state.uri;
    file = file.substr(0, file.lastIndexOf(".")) + "." + ext;
    return file;
  }

  render() {

    if (this.state.failed) {
      return (
        <View style={{ width: '100%', height: viewHeight, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white' }}>Klarte ikke vise bilde. Trist og uproft.</Text>
        </View>
      );
    }

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.setState({ shown: true });
          }}
          onLongPress={() => {
            const options = { url: this.state.uri };
            ActionSheetIOS.showShareActionSheetWithOptions(options, (error) => { console.log(error); }, (success, method) => { console.log(success, method); });
          }}
        >
          <Image
            resizeMode="cover"
            onError={e => this.onError(e)}
            source={{ uri: this.state.uri }}
            style={{
 height: viewHeight, width: '100%', marginBottom: 10, marginTop: 10,
}}
          />
        </TouchableOpacity>
        <ImageViewer
          shown={this.state.shown}
          imageUrls={[this.state.uri]}
          onClose={() => this.setState({ shown: false })}
          index={0}
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
