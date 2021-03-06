import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Dimensions, Linking, Platform, StyleSheet, Text, View, WebView } from 'react-native';
import textile from 'textile-js';
import HTMLView from 'react-native-htmlview';
import GlimmerImage from './GlimmerImage';
import * as colors from '../../Styles/colorConstants';
import { REGEX_EXTERNAL_IMAGE, REGEX_LINK_THREAD, REGEX_TEXTILE_INTERNAL_IMAGE, REGEX_VALID_URL } from '../../constants';

const baseImageUrl = 'https://images.underskog.no/versions/650/XXXXX.jpeg';

export default class ForumTextTextile extends React.Component {
  constructor(props) {
    super(props);
    this.dim = Dimensions.get('window');
  //  this.parsed = this.parseText();
  }

  styles = StyleSheet.create({
    paragraph: {
      marginTop: 3,
      marginBottom: 3,
      marginLeft: this.props.textPadding,
      marginRight: this.props.textPadding,
    },

    bq: {
      marginTop: 3,
      marginBottom: 3,
      marginLeft: 5,
      paddingLeft: 5,
      borderLeftWidth: 5,
      borderLeftColor: colors.COLOR_MIDGREY,
    },
  });

  parseText() {
    let text = this.props.text;

    // Newline før og etter bilde
    text = text.replace(REGEX_TEXTILE_INTERNAL_IMAGE, match => `\n${match}\n`);
    text = text.replace(REGEX_EXTERNAL_IMAGE, match => `\n${match}\n`);

    // Splitte ved newline
    let textArray = text.split(/\r?\n/);

    // Fjern tomme avsnitt
    textArray = textArray.filter(x => x !== '');

    // Mappe og bytte ut bilder etc. 
    const outArray = textArray.map((n) => {

      let tmp = n;
      if (REGEX_TEXTILE_INTERNAL_IMAGE.test(tmp)) {
        // Bytte ut underskogs-bildekode
        tmp = tmp.replace(REGEX_TEXTILE_INTERNAL_IMAGE, (match) => {
          const arr = match.split(' ');
          const nr = arr[1].substring(0, arr[1].length - 1);
          const url = baseImageUrl.replace('XXXXX', nr);
          return url;
        });

        return { type: 'img', data: tmp, internal: true };
      } else if (REGEX_EXTERNAL_IMAGE.test(tmp)) {
        tmp = tmp.substring(1, tmp.length - 1);
        return { type: 'img', data: tmp, internal: false };
      } else if (tmp.indexOf('> ') === 0) {
        return { type: 'bq', data: tmp.substring(2) };
      } else if (tmp.indexOf('bq. ') === 0) {
        return { type: 'bq', data: tmp.substring(3) };
      } else {
        return { type: 'txt', data: tmp };
      }
    });

    const mergedArray = [];

    for (let i = 0; i < outArray.length; i++) {
      if (typeof (outArray[i + 1]) !== 'undefined' && outArray[i].type == 'txt' && outArray[i + 1].type == 'txt') {
        outArray[i + 1].data = `${outArray[i].data}\n${outArray[i + 1].data}`;
      } else {
        mergedArray.push(outArray[i]);
      }
    }

    for (let i = 0; i < mergedArray.length; i++) {
      if (mergedArray[i].type === 'txt') {
        mergedArray[i].data = textile.parse(mergedArray[i].data);
      }
    }

    // console.log('outArray', outArray, 'merged array', mergedArray);

    return mergedArray;
  }

  _handleLink(url) {
    console.log('Url pressed', url);

    if (url.includes('images.underskog.no')) {
      console.log('Bildelenke');
      Linking.openURL(url);
    } else if (url.includes('underskog.no/medlem/')) {
      Alert.alert('Dette er litt flaut...', 'Lenker internt på Underskog er ikke implementert ennå');
      console.log('brukerlenke');
    } else if (url.includes('underskog.no/samtale/')) {
      Alert.alert('Dette er litt flaut...', 'Lenker internt på Underskog er ikke implementert ennå');
      console.log('samtalelenke');
    } else if (url.includes('http') && url.includes('://')) {
      Linking.openURL(url);
    } else {
      Alert.alert('Jøsses.', 'Dette er en lenketype Glimmer ikke kjenner igjen. Send gjerne @kvasbo en melding om hva du trykka på!');
      console.log('samtalelenke');
    }
  }

  // renderNode(node, index, siblings, parent, defaultRenderer) {
  renderNode(node, index, siblings, parent, defaultRenderer) {
    const Dim = Dimensions.get('window');
    const maxWidth = Dim.width - 50;

    try {
      if (node.name == 'img') {
        if (REGEX_VALID_URL.test(node.attribs.src)) {
          defaultRenderer(node, parent);
        } else {
          return null;
        }
      }
      if (node.name === 'iframe') {
        const a = node.attribs;
        const frameW = Number(node.attribs.width);
        const frameH = Number(node.attribs.height);
        const factor = frameW / maxWidth;

        if (factor > 1) {
          var width = Math.round(frameW / factor);
          var height = Math.round(frameH / factor);
        } else {
          var width = frameW;
          var height = frameH;
        }

        const iframeHtml = `<html><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /><iframe style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="${height}px" width="${width}px" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen src="${a.src}"></iframe></html>`;
        // console.log(frameW, frameH, width, height, factor, iframeHtml);
        return (
          <View key={index} style={{ width, height, backgroundColor: colors.COLOR_DARKGREY }}>
            <WebView style={{ width, height, backgroundColor: colors.COLOR_BLACK }} source={{ html: iframeHtml }} />
          </View>
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  _handleLink(url) {
    console.log('Url pressed', url);

    if (url.includes('images.underskog.no')) {
      console.log('Bildelenke');
      Linking.openURL(url);
    } else if (url.includes('underskog.no/medlem/')) {
      Alert.alert('Dette er litt flaut...', 'Lenker internt på Underskog er ikke implementert ennå');
      console.log('brukerlenke');
    } else if (url.search(REGEX_LINK_THREAD) !== -1) {
      let id = null;

      url.replace(/[0-9]+/, (match) => {
        id = match;
      });

      arbeidsMaur.forumGetter.getPost(id).then((data) => {
        console.log('post', data);

        this.props.navigator.push({
          screen: 'glimmer.PageThread',
          title: data.title,
          passProps: { post: data },
        });
      }).catch((err) => {
        console.log(err);
      });
    } else if (url.includes('http') && url.includes('://')) {
      Linking.openURL(url);
    } else {
      Alert.alert('Jøsses.', 'Dette er en lenketype Glimmer ikke kjenner igjen. Send gjerne @kvasbo en melding om hva du trykka på!');
      console.log('samtalelenke');
    }
  }

  getContent() {
    const outArray = [];
    const parsed = this.parseText();

    parsed.forEach((node, key) => {
      if (node.type === 'txt') {
        outArray.push(<HTMLView
          style={this.styles.paragraph}
          key={key}
          NodeComponent={Text}
          TextComponent={Text}
          textComponentProps={{ selectable: true }}
          nodeComponentProps={{ selectable: false }}
          RootComponent={View}
          value={node.data}
          stylesheet={this.styles}
          renderNode={this.renderNode}
          onLinkPress={url => this._handleLink(url)}
          onError={err => console.log('HTMLViuw error', err)}
        />);
      } else if (node.type === 'bq') {
        outArray.push(<HTMLView
          style={this.styles.bq}
          key={key}
          NodeComponent={Text}
          TextComponent={Text}
          RootComponent={View}
          value={node.data}
          stylesheet={this.styles}
          renderNode={this.renderNode}
          onLinkPress={url => this._handleLink(url)}
          onError={err => console.log(err)}
        />);
      } else if (node.type === 'img') {
        outArray.push(<GlimmerImage style={this.styles.paragraph} key={key} internal={node.internal} uri={node.data} />);
      } else {
        // Unknown node
        console.log('Unknown node', node);
      }
    });

    return outArray;
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        {this.getContent()}
      </View>
    );
  }
}

ForumTextTextile.defaultProps = {
  textPadding: 15,
};

ForumTextTextile.propTypes = {
  text: PropTypes.string.isRequired,
  navigator: PropTypes.object.isRequired,
  textPadding: PropTypes.number,
};
