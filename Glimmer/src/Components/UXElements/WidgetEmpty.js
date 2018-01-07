import React from 'react';
import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import PropTypes from 'prop-types';
import WidgetContainer from './WidgetContainer';
import * as colors from '../../Styles/colorConstants';

class WidgetEmpty extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    LayoutAnimation.easeInEaseOut();
  }

  getWidget() {

  }

  render() {
    return (
      <WidgetContainer title="Tom Widget">
        {this.getWidget()}
      </WidgetContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    appStatus: state.AppStatus,
    settings: state.Settings,
  };
}

export default connect(mapStateToProps)(WidgetEmpty);

WidgetEmpty.propTypes = {

};
