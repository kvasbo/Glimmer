/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Button, Modal, StyleSheet, View} from "react-native";
import WriteNewPostOrComment from "./WriteNewPostOrComment";
import PropTypes from "prop-types";
var ImagePicker = require('react-native-image-picker');

export default class AddCommentBlock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {modalVisible: false};
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    render() {

        return (


            <View style={pageStyles.container}>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {

                    }}
                >

                    <WriteNewPostOrComment type="comment" postId={this.props.postId} title="Ny kommentar" navigator={this.props.navigator}/>

                </Modal>

                <Button title="Ny kommentar" onPress={() => {
                    this.setModalVisible(true)
                }}/>

            </View>

        )

    }

}

AddCommentBlock.propTypes = {
    postId: PropTypes.number.isRequired,
    navigator: PropTypes.object.isRequired
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginBottom: 2,
        paddingTop: 8,
    }
});