/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Button, Image, ScrollView, StyleSheet, Text, View} from "react-native";

export default class PageLogin extends React.Component {

    constructor(props) {
        super(props);
        console.log("Pagelogin loading");
    }

    componentDidMount() {
        console.log("login screen", this.props);
    }

    doTheLoginThing() {
        auth.doUnderskogOauth().then(() => {

            this.props.navigator.dismissAllModals({
                animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
            });

            arbeidsMaur.initData();

        });
    }

    render() {

        return (
            <View style={pageStyles.container}>

                <View style={pageStyles.paragraph}>
                    <Image source={require("../icons/stol.png")} style={{width: 150, height: 150}}/>
                </View>

                <View style={pageStyles.paragraph}>

                    <Text style={pageStyles.mainText}>For å bruke denne appen må du gi den tilgang til din
                        Underskogkonto.</Text>

                </View>

                <View style={pageStyles.paragraph}>
                    <Button title="Gi tilgang til Underskog" onPress={() => this.doTheLoginThing()}/>
                </View>

                <View style={pageStyles.paragraph}>
                    <Text style={pageStyles.mainText}>Det gjør du ved å trykke på knappen over og gi tillatelse når
                        Underskog åpner seg i din nettleser.</Text>
                </View>

                <View style={pageStyles.paragraph}>

                    <Text style={pageStyles.smallText}>Dette er ikke farlig - vi stjeler ikke data og benytter ingen
                        tredjepartstjenester til å lagre personlige data.</Text>
                    <Text style={pageStyles.smallText}>Innlogginga skjer ved hjelp av noe som heter Oauth som gjør at
                        appen aldri får vite passordet ditt. Du kan når som helst inndra tilgangen på
                        Underskog.no</Text>
                </View>

            </View>
        );
    }
}

const pageStyles = StyleSheet.create({

    container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        margin: 0,
        alignItems: "center"

    },

    paragraph: {

        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },

    theButton: {},

    mainText: {
        textAlign: "left"
    },

    smallText: {
        textAlign: "left",
        fontSize: 12, color: "#777777"
    }

});