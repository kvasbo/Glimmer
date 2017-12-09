/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoadingScreen from './UXElements/LoadingScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from '../Styles/colorConstants';
import Divider from './UXElements/Divider';

// Get common list styles
const listStyles = require('../Styles/ListStyles');

class PageUnread extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      refreshing: false,
      silentLoading: false,
    };

    this._isMounted = false;

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        this._silentRefresh();
        break;
    }
  }

  _silentRefresh() {
    this.setState({ silentLoading: true });

    if (!this.state.loading) {
      global.arbeidsMaur.forumUpdater.loadFirstUnread().then(() => {
        if (this._isMounted) {
          this.setState({ silentLoading: false });
        }
      });
    }
  }

  _refresh() {
    this.setState({ refreshing: true });
    global.arbeidsMaur.forumUpdater.loadFirstUnread().then((data) => {
      if (this._isMounted) {
        this.setState({ refreshing: false });
      }
    });
  }

  getData() {
    const out = Object.values(this.props.favorites);

    out.sort((x, y) => (new Date(y.updated_at) - new Date(x.updated_at)));

    return out;
  }

  getSubtitle(data) {
    let outString = helpers.getCalendarTime(data.updated_at);

    if (data.unread_comment_count === 1) {
      outString += ', én ulest kommentar';
    } else if (data.unread_comment_count > 1) {
      outString += `, ${data.unread_comment_count} uleste kommentarer`;
    }

    return outString;
  }

    _renderItem = ({ item }) => (

      <TouchableOpacity onPress={() =>
            this.props.navigator.push({
                screen: 'glimmer.PageThread',
                title: item.title,
                passProps: { post: item },
            })
        }
      >
        <View>

          <View style={[listStyles.whiteBox, { justifyContent: 'space-between' }]}>
            <View style={listStyles.textBlock}>
              <Text style={[listStyles.listTitle, { fontWeight: '600' }]}>{item.title}</Text>
              <Text style={listStyles.listSubtitle}>{this.getSubtitle(item)}</Text>
            </View>
            <View style={listStyles.iconBlock}>
              <Icon name="ios-arrow-forward" style={{ textAlign: 'right' }} color={colors.COLOR_LIGHTGREY} size={30} />
            </View>
          </View>


          <Divider />
        </View>
      </TouchableOpacity>
    )

    _getHeader() {
      return (<Divider />);
    }

    _getFooter() {
      return (
        <Text style={{
 margin: 0, textAlign: 'center', padding: 15, color: colors.COLOR_LIGHTGREY,
}}
        >Les noen tråder
                for å se flere uleste.
        </Text>);
    }

    render() {
      const data = this.getData();

      if (this.state.loading === true) {
        return <LoadingScreen text="Laster tråder med uleste innlegg" />;
      }


      return (

        <FlatList
          style={pageStyles.container}
          data={data}
          onRefresh={() => this._refresh()}
          refreshing={this.state.refreshing}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.id}
          initialNumToRender={15}
          ListHeaderComponent={this._getHeader}
          ListFooterComponent={this._getFooter}
          scrollsToTop
        />
      );
    }
}

PageUnread.propTypes = {
  favorites: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
};

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.COLOR_WHITE,
    paddingLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingRight: 0,

  },

});

function mapStateToProps(state) {
  return {
    favorites: state.ForumUnread,
  };
}

export default connect(mapStateToProps)(PageUnread);
