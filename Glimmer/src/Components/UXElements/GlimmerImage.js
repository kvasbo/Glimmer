/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {Dimensions, Image} from "react-native";

export default class GlimmerImage extends React.Component {

    constructor(props) {
        super(props);

        this.dim = Dimensions.get("window");
        this.maxWidth = this.dim.width - 50;
        this.state = {height: 0, width: 0}

    }

    componentWillMount() {

        Image.getSize(this.props.uri, (width, height) => {

            const dim = Dimensions.get("window");
            const maxWidth = this.dim.width - 50;

            var factor = width / maxWidth;

            if (factor > 1) {
                var fixedWidth = Math.round(width / factor);
                var fixedHeight = Math.round(height / factor);
            }
            else {
                var fixedWidth = width;
                var fixedHeight = height;
            }

       // console.log("dim", factor, width, height, fixedWidth, fixedHeight)

            this.setState({height: fixedHeight, width: fixedWidth})
        })

    }

    render() {

        return (
            <Image resizeMode="contain" source={{uri: this.props.uri}} style={{height: this.state.height, width: this.state.width}}/>
        );
    }
}

GlimmerImage.defaultProps = {
    width: 0
}

GlimmerImage.propTypes = {
    uri: PropTypes.string.isRequired,
    width: PropTypes.number
}