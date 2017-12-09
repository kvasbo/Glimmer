/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {ScrollView, StyleSheet, AsyncStorage} from "react-native";
import SettingsList from 'react-native-settings-list';

export default class PageAnnet extends React.Component {

    constructor(props) {
        super(props);
        this.state = { nsfw: undefined }
    }

    componentWillMount() {
        this.getNsfw();
    }

    writeSetting = async (key, value) => {
        await AsyncStorage.setItem(`settings_${key}`, value);
    }

    readSetting = async (key) => {
        const value = await AsyncStorage.getItem(`settings_${key}`);
        if (value !== null) {
            return value;
        } else {
            this.writeSetting(key, '0');
            return false;
        }
    }

    getNsfw = async () => {
        const nsfw = await this.readSetting('hide_nsfw');
        if (nsfw === "0") this.setState({ nsfw:false })
        this.setState({ nsfw: true });
    }

    toggleNsfw = async () => {
        if(this.state.nsfw === true) {
            this.setState({ nsfw: false });
            this.writeSetting("hide_nsfw", "0");
        } else {
            this.setState({ nsfw: true });
            this.writeSetting("hide_nsfw", "1");
        }
    }

    logOut = async () => {
        await global.auth.logOut();
    }

    render() {

        return (
            <ScrollView style={pageStyles.container}>
                <SettingsList>
                    <SettingsList.Item
                            hasNavArrow={false}
                            switchState={this.state.nsfw}
                            switchOnValueChange={this.toggleNsfw}
                            hasSwitch={true}
                            title='Skjul NSFW'/>
                        <SettingsList.Item
                            hasNavArrow={false}
                            onPress={() => this.logOut()}
                            title='Logg ut'/>
                </SettingsList>
            </ScrollView>
        );
    }
}

const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCCCCC',
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 30,
        paddingRight: 0,
    },
});