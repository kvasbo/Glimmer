/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {ScrollView, StyleSheet} from "react-native";
import {Button} from "react-native-elements";


export default class PageMore extends React.Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = ({navigation}) => ({
        title: "Title",
    });

    componentDidMount() {

    }

    render() {

        return (
            <ScrollView style={pageStyles.container}>
                <Button
                    textStyle={pageStyles.buttonText}
                    style={pageStyles.button}
                    icon={{name: 'cached'}}
                    title='Krets'
                    onPress={() => {

                        this.props.navigator.showModal({
                            screen: 'glimmer.PageKretsVelger',
                            title: "Krets Test",
                        });

                        this.props.navigator.toggleDrawer();
                    }
                    }
                />
                <Button
                    textStyle={pageStyles.buttonText}
                    style={pageStyles.button}
                    icon={{name: 'cached'}}
                    title='Fora'
                    onPress={() => {

                        this.props.navigator.showModal({
                            screen: 'glimmer.PageForumList',
                            title: "Forum List Test",
                        });

                        this.props.navigator.toggleDrawer();
                    }
                    }
                />
                <Button
                    icon={{name: 'thumb-up'}}
                    style={pageStyles.button}
                    title='Min Kudos'/>
                <Button
                    icon={{name: 'thumb-up'}}
                    style={pageStyles.button}
                    title='Om Glimmer'
                    onPress={() => {

                    this.props.navigator.showModal({
                        screen: 'glimmer.PageAbout',
                        title: "Om Glimmer",
                    });

                }
                }/>


            </ScrollView>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222',
        paddingLeft: 10,
        paddingTop: 40,
        paddingBottom: 40,
        paddingRight: 10,
    },

    button: {
        marginBottom: 10,
    },

    buttonText: {}
});