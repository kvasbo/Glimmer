import React from 'react';
import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import PropTypes from 'prop-types';
import WidgetContainer from './WidgetContainer';
import * as colors from '../../Styles/colorConstants';

class WidgetKudos extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    LayoutAnimation.easeInEaseOut();
  }

  getKudi() {
    let kudos = Object.values(this.props.kudos);
    kudos.sort((a, b) => {
      return b.createdAt.valueOf() - a.createdAt.valueOf();
    });
    console.log(kudos);
  }

  render() {
    return (
      <WidgetContainer title="Siste kudos">
        {this.getKudi()}
      </WidgetContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    appStatus: state.AppStatus,
    kudos: state.Kudos,
    settings: state.Settings,
  };
}

export default connect(mapStateToProps)(WidgetKudos);

WidgetKudos.propTypes = {

};
