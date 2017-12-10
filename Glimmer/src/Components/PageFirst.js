import React from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import PropTypes from 'prop-types';
import { CheckBox } from 'react-native-elements'
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import Timeline from 'react-native-timeline-listview';
import TimeLineEvent from './UXElements/TimeLineEvent';
import * as colors from '../Styles/colorConstants';

class PageFirst extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visKudos: global.arbeidsMaur.settings.getSettings().activityShowKudos };
    this.renderDetail = this.renderDetail.bind(this);
    this.eventPressed = this.eventPressed.bind(this);
  }

  getData() {
    const now = new Moment();
    const kudos = Object.values(this.props.kudos).filter((k) => {
      return (now.diff(k.createdAt, 'days') < 1);
    });

    const outKudos = kudos.map((k) => {
      return (
        {
          time: k.createdAt.format('HH:mm'),
          type: 'kudos',
          moment: k.createdAt,
          item: k,
          icon: require('../../icons/award.png'),
        }
      );
    });

    const messages = Object.values(this.props.messages).filter((m) => {
      return (now.diff(m.last_message_time, 'days') < 1);
    });

    const outMessages = messages.map((m) => {
      const t = new Moment(m.last_message_time);
      return (
        {
          time: t.format('HH:mm'),
          type: 'message',
          moment: t,
          item: m,
        }
      );
    });

    const stream = Object.values(this.props.stream).filter((m) => {
      return (now.diff(m.created_at, 'days') < 1);
    });

    const outStream = stream.map((m) => {
      const t = new Moment(m.created_at);
      return (
        {
          time: t.format('HH:mm'),
          type: 'stream',
          moment: t,
          item: m,
        }
      );
    });

    const comments = Object.values(this.props.favorites).filter((m) => {
      return (now.diff(m.updated_at, 'days') < 1);
    });

    const outComments = comments.map((m) => {
      const t = new Moment(m.updated_at);
      return (
        {
          time: t.format('HH:mm'),
          type: 'comment',
          moment: t,
          item: m,
        }
      );
    });

    let out = [].concat(outMessages).concat(outStream).concat(outComments);
    
    if (this.state.visKudos) out = out.concat().concat(outKudos);

    out.sort((a, b) => {
      if (b.moment.isBefore(a.moment)) return -1;
      return 1;
    });

    return out;
  }

  eventPressed(event) {
    console.log('event pressed', event);
    if (event.type === 'stream' || event.type === 'comment') {
      this.props.navigator.push({
        screen: 'glimmer.PageThread',
        title: event.item.title,
        passProps: { post: event.item },
      });
    } else if (event.type === 'message') {

    }
   
  }

  toggleKudos() {
    const nySetting = !this.state.visKudos;
    this.setState({ visKudos: nySetting });
    global.arbeidsMaur.settings.setActivityKudos(nySetting);
  }

  renderDetail(rowData, sectionId, rowId) {
    return <TimeLineEvent item={rowData} />
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Timeline
          style={pageStyles.container}
          data={this.getData()}
          innerCircle={'icon'}
          renderDetail={this.renderDetail}
          separator={false}
          lineColor={colors.COLOR_HIGHLIGHT}
          circleSize={20}
          circleColor={colors.COLOR_WHITE}
          timeContainerStyle={{ minWidth: 52, marginTop: 0 }}
          onEventPress={this.eventPressed}
        />
        <CheckBox
          title="Vis kudos"
          checked={this.state.visKudos}
          onPress={() => this.toggleKudos()}
        />
      </View>
    );
  }
}

PageFirst.propTypes = {
  
};

function mapStateToProps(state) {
  return {
    appStatus: state.AppStatus,
    kudos: state.Kudos,
    messages: state.Conversation,
    stream: state.ForumStream,
    favorites: state.ForumFavorite,
  };
}

export default connect(
  mapStateToProps,
)(PageFirst);

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.COLOR_LIGHT,
    paddingLeft: 10,
    paddingTop: 20,
    paddingBottom: 10,
    paddingRight: 10,
  },
});
