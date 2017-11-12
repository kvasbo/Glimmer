import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {ScrollView, StyleSheet, Text} from "react-native";
import KudosListKudos from './UXElements/KudosListKudos';

class PageKudos extends React.Component {

    constructor(props) {
        super(props);
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
            <ScrollView style={pageStyles.container}>
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
