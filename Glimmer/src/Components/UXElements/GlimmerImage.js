/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {Dimensions, Image} from "react-native";
const config = require("../../../config");

export default class GlimmerImage extends React.Component {

    constructor(props) {
        super(props);

        this.dim = Dimensions.get("window");
        this.maxWidth = this.dim.width - 50;
        this.state = {height: 0, width: 0, uri: null}

        this._isMounted = false;
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);


    }

    componentWillMount() {

        this._isMounted = true;

        arbeidsMaur.imageGetter.getImage(this.props.id, "large").then((data) => {
            //Check if we are mounted
            if (this._isMounted) {
                this.setState({uri: data});
                this.getSize();
            }

        });

    }

    componentWillUnmount()
    {
        this._isMounted = false;
    }

    getSize() {

        Image.getSize(this.state.uri, (width, height) => {

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
            if (this._isMounted) {
                this.setState({height: fixedHeight, width: fixedWidth})
            }

        })
    }

    render() {

        if (this.state.uri === null) return null;

        return (
            <Image resizeMode="contain" source={{uri: this.state.uri}}
                   style={{height: this.state.height, width: this.state.width}}/>
        );
    }
}

GlimmerImage.defaultProps = {
    size: "large"
}

GlimmerImage.propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.string
}