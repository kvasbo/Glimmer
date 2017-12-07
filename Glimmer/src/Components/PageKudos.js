import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {View, ScrollView, StyleSheet, Text, RefreshControl} from "react-native";
import KudosListKudos from './UXElements/KudosListKudos';

class PageKudos extends React.Component {

    constructor(props) {
      super(props);
      this.state = { refreshing: false }
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
      switch (event.id) {
        case 'willAppear':
          this.onRefresh();
          break;
      }
    }

    async onRefresh() {
      this.setState({refreshing: true});
      await global.arbeidsMaur.kudos.getKudos(1);
      this.setState({refreshing: false});
    }

    componentDidMount() {

    }

    getKudos() {
      const kudos = Object.values(this.props.kudos);
      kudos.sort((a,b) => {
        if (a.createdAt.isBefore(b.createdAt)) return 1;
        return -1;
      })
      return kudos.map((k) => {
        return (<KudosListKudos key={k.uniqueId} kudos={k} />);
      });
    }

    getFooter() {
      if(Object.values(this.props.kudos).length > 0) {
        return (
          <Text style={{ marginLeft: 0, marginRight: 0, textAlign: 'center', paddingTop: 10, color: '#CCCCCC'}}>Sånn, nok onani for i dag.</Text>

        );
      }
    }

    render() {
        return (
            <ScrollView
              style={pageStyles.container}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
            >
              {this.getKudos()}
              {this.getFooter()}
            </ScrollView>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
        paddingBottom: 50,
        margin: 0,
    },
});

PageKudos.propTypes = {
  kudos: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    kudos: state.Kudos,
  };
}

export default connect(
  mapStateToProps,
)(PageKudos);
