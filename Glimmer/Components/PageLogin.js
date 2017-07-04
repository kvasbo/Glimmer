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
                    <Text style={pageStyles.header}>Velkommen til Glimmer</Text>
                </View>

                <View style={pageStyles.paragraph}>
                    <Button title="Gi tilgang" onPress={() => this.doTheLoginThing()}/>
                </View>

                <View style={pageStyles.paragraph}>

                    <Text style={pageStyles.mainText}>For å bruke denne appen må du gi den tilgang til din
                        Underskogkonto.</Text>

                    <Text style={pageStyles.mainText}>Det gjør du ved å trykke på knappen over og gi tillatelse når
                        Underskog åpner seg i din nettleser.</Text>


                    <Text style={pageStyles.smallText}>Dette er ikke farlig - vi stjeler ikke data og benytter ingen
                        tredjepartstjenester til å lagre personlige data. Faktisk forlater ingen personlige data noensinne telefonen din.</Text>
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
        backgroundColor: '#ECF0F1',
        flex: 1,
        margin: 0,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-around",
        paddingTop: 80,
        paddingBottom: 80
    },

    paragraph: {

        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        padding: 0,
        width: 280,

    },

    theButton: {},

    header: {
        textAlign: "center",
        fontSize: 26,
        color: "#2C3E50",
        marginTop: 30,
        marginBottom: 7,
        fontWeight: "300"
    },

    mainText: {
        color: "#2C3E50",
        textAlign: "left",
        marginTop: 7,
        marginBottom: 7,
    },

    smallText: {
        textAlign: "left",
        fontSize: 13, color: "#555555",
        marginTop: 7,
        marginBottom: 7,
    }

});