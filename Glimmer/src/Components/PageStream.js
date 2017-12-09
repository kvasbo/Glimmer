/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, StyleSheet, AsyncStorage } from 'react-native';
import LoadingScreen from './UXElements/LoadingScreen';
import StreamForumPost from './UXElements/StreamForumPost';
import * as colors from '../Styles/colorConstants';

class PageStream extends React.Component {
    reduxUnsubscribe = null;

    constructor(props) {
      super(props);
      this.state = { loading: false, refreshing: false, hide_nsfw: false, skammekrok: [] };
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
      this._onRefresh = this._onRefresh.bind(this);
    }

    componentWillMount() {
      this.getNsfw();
      this.updateSkammekrok();
    }

    updateSkammekrok = () => {
      const skammekrok = global.arbeidsMaur.gjemsel.getKrok();
      this.setState({ skammekrok });
    }

    readSetting = async (key) => {
      const value = await AsyncStorage.getItem(`settings_${key}`);
      if (value !== null) {
        return value;
      }
      return false;
    }

    getNsfw = async () => {
      const nsfw = await this.readSetting('hide_nsfw');
      if (nsfw === '1') this.setState({ hide_nsfw: true });
    }

    onNavigatorEvent(event) {
      switch (event.id) {
        case 'willAppear':
          this._silentRefresh();
          break;
      }

      if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
        if (event.id == 'newForumPost') { // this is the same id field from the static navigatorButtons definition
          this.props.navigator.push({
            screen: 'glimmer.PageForumList', // unique ID registered with Navigation.registerScreen
            title: 'Velg forum', // navigation bar title of the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
          });
        }
      }
    }

    static navigatorButtons = {
      rightButtons: [
        {
          icon: require('../../icons/plus.png'),
          id: 'newForumPost', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
        },
      ],
    };

    _renderItem(item) {
      return (

        <StreamForumPost navigator={this.props.navigator} data={item.item} />
      );
    }

    _silentRefresh() {
      if (!this.state.refreshing) global.arbeidsMaur.forumUpdater.loadFirstStream(1);
    }

    _onRefresh() {
      this.setState({ refreshing: true });
      global.arbeidsMaur.forumUpdater.loadFirstStream(1).then((data) => {
        this.setState({ refreshing: false });
      });
    }

    _loadMoreItems() {
      global.arbeidsMaur.forumUpdater.addPagesToStream(1);
    }

    getData() {
      let out = Object.values(this.props.posts);

      if (this.state.hide_nsfw) {
        out = out.filter((p) => {
          if (p.title.toLowerCase().indexOf('vagina') !== -1 || p.title.toLowerCase().indexOf('nsfw') !== -1) return false;
          return true;
        });
      }

      // Skammekrok
      out = out.filter((p) => {
        if (this.state.skammekrok.indexOf(p.creator_id) !== -1) return false;
        return true;
      });

      out.sort((x, y) => (new Date(y.created_at) - new Date(x.created_at)));

      return out;
    }

    render() {
      const data = this.getData();

      if (data.length === 0 || this.state.loading) {
        return <LoadingScreen text="Laster forsiden" />;
      }

      return (
        <FlatList
          style={pageStyles.container}
          data={data}
          renderItem={item => this._renderItem(item)}
          keyExtractor={item => item.id}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          initialNumToRender={3}
          onEndReached={this._loadMoreItems}
          onEndReachedThreshold={0.5}
        />
      );
    }
}

PageStream.propTypes = {
  navigator: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
};

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.COLOR_LIGHT,
    padding: 0,
    margin: 0,
  },
});

function mapStateToProps(state) {
  return {
    posts: state.ForumStream,
  };
}

export default connect(mapStateToProps)(PageStream);
