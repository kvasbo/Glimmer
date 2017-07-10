/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {TouchableOpacity} from "react-native";
import * as colors from "../../Styles/colorConstants";
import Badge from "./Badge";

export default class GiKudos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {given: this.props.given, text: "Gi kudos"}
    }

    componentDidMount() {

    }

    giKudos() {

        if (this.props.type == "post") {
            arbeidsMaur.forumUpdater.giveKudosToPost(this.props.id).then(() => {

                this.setState({given: true})

            }).catch((err) => {
                console.log(err);
            })
        }
        else if (this.props.type == "comment") {
            arbeidsMaur.forumUpdater.giveKudosToComment(this.props.id).then(() => {

                this.setState({given: true})

            }).catch((err) => {
                console.log(err);
            });
        }
    }

    render() {

        if (this.state.given === true) {
            return (
                <Badge
                    text={"Kudos gitt!"}
                    textColor={colors.COLOR_WHITE}
                    color={colors.COLOR_GRAD3}
                    style={{marginRight: 5}}
                />
            )
        }
        else {

            return (
                <TouchableOpacity
                    onPress={() => this.setState({text: "Hold for kudos..."})}
                    onLongPress={() => this.giKudos()}
                >
                    <Badge
                        text={this.state.text}
                        textColor={colors.COLOR_WHITE}
                        color={colors.COLOR_GREEN}
                        style={{marginRight: 5}}
                    />


                </TouchableOpacity>
            );
        }
    }
}

GiKudos.defaultProps = {
    given: false,
}

GiKudos.propTypes = {
    given: PropTypes.bool,
    type: PropTypes.oneOf(['comment', 'post']).isRequired,
    id: PropTypes.number.isRequired
}