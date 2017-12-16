/**
 * Created by kvasbo on 31.05.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import ForumTextTextile from './ForumTextTextile';
import PostMoreStuffButton from './PostMoreStuffButton';
import GiKudos from './GiKudos';
import VisKudos from './VisKudos';
import CommentMetadata from './CommentMetadata';
import Badge from './Badge';
import * as colors from '../../Styles/colorConstants';

export default class ForumComment extends React.Component {
    byMe = false;

    constructor(props) {
      super(props);

      if (this.props.data.creator_id === store.getState().AppStatus.activeUserId) {
        this.byMe = true;
      }
    }

    getKudosSection() {
      if (this.byMe) {
        let kudos = [];

        if (typeof this.props.data.kudos.from !== 'undefined') {
          kudos = this.props.data.kudos.from;
        }

        return (<VisKudos kudos={kudos} />);
      }

      let given = false;
      if (typeof (this.props.data.kudos.given) !== 'undefined' && this.props.data.kudos.given) given = true;
      return (<GiKudos id={this.props.data.id} type="comment" given={given} />);
    }

    getEditSection() {
      // Disabled for now
      if (!this.byMe) return null;

      const editWindow = 14;
      const now = new moment();
      const created = new moment(this.props.data.updated_at);

      const diff = now.diff(created, 'minutes');
      const rest = editWindow - diff;

      if (diff < editWindow) {
        return (
          <TouchableOpacity
            onPress={() => {
                     this.props.navigator.push({
                         screen: 'glimmer.PageForumCommentEdit',
                         title: 'Redigér kommentar',
                         passProps: { commentId: this.props.data.id, comment: this.props.data, bodyTextile: this.props.data.body_textile },
                         animated: true,
                     });
                 }}
          >
            <Badge text="Redigér" />
          </TouchableOpacity>
        );
      }

    }

    getMoreStuff() {
      return (
        <View style={{ marginRight: 10, marginLeft: 10 }}><PostMoreStuffButton itemId={this.props.data.id} itemType="comment" itemAuthorId={this.props.data.creator_id} /></View>
      );
    }

    render() {
      return (
        <View style={pageStyles.container}>

          <View>
            <CommentMetadata
              post={this.props.data}
              byStarter={this.props.byStarter}
              navigator={this.props.navigator}
            />
          </View>

          <View style={pageStyles.comment}>
            <ForumTextTextile webview cut={false} text={this.props.data.body_textile} navigator={this.props.navigator} />
          </View>
          <View style={{
flexDirection: 'row', margin: 10, marginTop: 5, padding: 0,
}}
          >
            {this.getKudosSection()}
            {this.getEditSection()}
            {this.getMoreStuff()}
            
          </View>
        </View>
      );
    }
}

ForumComment.defaultProps = {
  byStarter: false,
};

ForumComment.propTypes = {
  data: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
  byStarter: PropTypes.bool, // Skrevet av trådstarter
};

const pageStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.COLOR_WHITE,
    padding: 10,
    paddingBottom: 5,
    marginBottom: 2,
    marginTop: 2,
    flex: 1,
  },
  comment: {
    padding: 10,
    paddingTop: 10,
    marginRight: 10,
  },
});
