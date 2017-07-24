/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import PropTypes from "prop-types";
import {Dimensions, Image, TouchableOpacity, Linking} from "react-native";
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

        this.uri = "/images/redirect/" + this.props.id + "?size=large";

    }

    componentWillMount() {

        this._isMounted = true;

        arbeidsMaur.imageGetter.getImage(this.props.id, "large").then((data) => {
            //Check if we are mounted
            if (this._isMounted) {

                //console.log("Image read", data);

                this.setState({uri: data.data.uri});
                this.getSize(data.data);
            }

        });

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getSize(data) {

        try {

            const maxWidth = this.dim.width - 50;

            var factor = data.width / maxWidth;

            if (factor > 1) {
                var fixedWidth = Math.round(data.width / factor);
                var fixedHeight = Math.round(data.height / factor);
            }
            else {
                var fixedWidth = data.width;
                var fixedHeight = data.height;
            }

            if (this._isMounted) {
                this.setState({height: fixedHeight, width: fixedWidth})
            }
        }
        catch (err) {
            console.log(err);
        }

    }

    render() {

        if (this.state.uri === null) return null;

        return (
            <TouchableOpacity
                onPress={() => {
                    Linking.openURL(this.state.uri);
                }}>
                <Image resizeMode="contain" source={{uri: this.state.uri}}
                       style={{height: this.state.height, width: this.state.width}}/>
            </TouchableOpacity>
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