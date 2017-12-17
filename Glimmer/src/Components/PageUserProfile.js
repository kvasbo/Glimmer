import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Image, View, ActivityIndicator, Text, Dimensions, WebView } from 'react-native';
import MyWebView from 'react-native-webview-autoheight';
import * as colors from '../Styles/colorConstants';

const imageWidth = Dimensions.get('window').width;
const customStyle = '<style>* {max-width: 100%;} body {font-family: sans-serif;}</style>';

class PageUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, user: undefined }
  }

  async componentWillMount() {
    const user = await global.arbeidsMaur.userUpdater.getUserRawData(this.props.userId);
    console.log('user', user);
    this.setState({ user, loading: false });
    this.props.navigator.setTitle({ title: user.name });
  }

  getImage() {
    const url = createLargeImageUrl(this.state.user.image_url);
    return (<Image source={{ uri: url }} style={{ height: imageWidth, width: imageWidth }} />);
  }

  getRealName() {
    if (this.state.user.realname === '') return null;
    return (
      <Text style={{ fontSize: 20 }} >{this.state.user.realname}</Text>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><ActivityIndicator size="large" /></View>
      );
    }

    return (
      <ScrollView style={pageStyles.container}>
        {this.getImage()}
        <View style={pageStyles.userInfoPiece}>
          <Text style={{ fontSize: 28 }} >{this.state.user.name}</Text>
          {this.getRealName()}
        </View>
        <View style={{paddingTop: 10, paddingBottom: 10 }}>
          <MyWebView
            source={{html: customStyle + fixHtml(this.state.user.description)}}
            startInLoadingState
            onError={(error) => console.log(error)}
            renderError={(error) => console.log(error)}
            style={{ width: imageWidth - 20, height: 200 }}
          />
        </View>
      </ScrollView>
    );
  }
}

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.COLOR_WHITE,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 30,
    paddingRight: 0,
  },
  userInfoPiece: {
    padding: 10,
  }
});

function createLargeImageUrl(img){
  if(img.indexOf(".gif") !== -1) return img;
  return img.replace("48s", "650").replace(".png", ".jpeg").replace(".jpg", "jpeg"); 
}

function fixHtml(html) {
  return html.replace("http://", "https://");
}

function mapStateToProps(state) {
  return {
    krets: state.Krets,
  };
}

export default connect(mapStateToProps)(PageUserProfile);