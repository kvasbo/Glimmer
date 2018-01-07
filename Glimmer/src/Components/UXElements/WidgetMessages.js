import React from 'react';
import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import PropTypes from 'prop-types';
import WidgetContainer from './WidgetContainer';
import * as colors from '../../Styles/colorConstants';

class WidgetMessages extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    LayoutAnimation.easeInEaseOut();
  }

  getConversations() {

  }

  render() {
    return (
      <WidgetContainer title="Meldinger">
        {this.getConversations()}
      </WidgetContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    appStatus: state.AppStatus,
    conversations: state.Conversation,
    settings: state.Settings,
  };
}

export default connect(mapStateToProps)(WidgetMessages);

WidgetMessages.propTypes = {

};
