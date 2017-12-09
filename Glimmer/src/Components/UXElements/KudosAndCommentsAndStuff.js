import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
// import {Badge} from "react-native-elements";
import GiKudos from './GiKudos';
import VisKudos from './VisKudos';
import * as colors from '../../Styles/colorConstants';
import Badge from './Badge';

export default class KudosAndCommentsAndStuff extends React.Component {
  constructor(props) {
    super(props);
  }

  // Switch kudos section based on who created the post
  getKudosSection() {
    if (this.props.byMe) {
      let kudos = [];

      if (typeof this.props.post.kudos.from !== 'undefined') {
        kudos = this.props.post.kudos.from;
      }

      return (<VisKudos kudos={kudos} />);
    }

    let given = false;
    if (typeof (this.props.post.kudos.given) !== 'undefined' && this.props.post.kudos.given) {
      given = true;
    }
    return (<GiKudos id={this.props.post.id} type="post" given={given} />);
  }

  getCommentThing() {
    // If disabled, hide. Cause that's what you do.
    if (!this.props.showCommentBadge) return false;

    let comColor = colors.COLOR_ORANGE;

    if (this.props.post.comment_count === 0) {
      comColor = colors.COLOR_LIGHTGREY;
    }

    let comText = 'kommentar';

    if (this.props.post.comment_count !== 1) {
      comText = 'kommentarer';
    }

    return (
      <TouchableOpacity
        onPress={() => this.props.navigator.push({
                    screen: 'glimmer.PageThread',
                    title: this.props.post.title,
                    passProps: { post: this.props.post },
                })}
      >
        <Badge
          text={`${this.props.post.comment_count} ${comText}`}
          color={comColor}
          textColor={colors.COLOR_WHITE}
        />
      </TouchableOpacity>
    );
  }

  render() {
    return (

      <View style={{ flexDirection: 'row' }}>

        {this.getKudosSection()}

        {this.getCommentThing()}

      </View>
    );
  }
}

KudosAndCommentsAndStuff.defaultProps = {
  byMe: false,
};


KudosAndCommentsAndStuff.propTypes = {
  post: PropTypes.object.isRequired,
  showCommentBadge: PropTypes.bool,
  byMe: PropTypes.bool,
  navigator: PropTypes.object.isRequired,
};
