/**
 * Created by kvasbo on 31.05.2017.
 */

import React from "react";
import {Button, ScrollView, StyleSheet, Text, View} from "react-native";

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
            <ScrollView style={pageStyles.container}>

                <View>
                    <Text style={pageStyles.mainText}>For å bruke denne appen må du gi den tilgang til din
                        Underskogkonto.</Text>

                    <Button style={pageStyles.theButton} title="Logg inn" onPress={() => this.doTheLoginThing()}/>

                    <Text style={pageStyles.mainText}>Det gjør du ved å trykke på knappen over og gi tillatelse når
                        Underskog åpner seg i din nettleser.</Text>
                </View>

                <View>
                    <Text style={pageStyles.smallText}>Det med liten skrift:</Text>
                    <Text style={pageStyles.smallText}>Det er ikke farlig - vi stjeler ikke data og benytter ingen
                        tredjepartstjenester utover anonymisert statistikk.</Text>
                    <Text style={pageStyles.smallText}>Innlogginga skjer ved hjelp av noe som heter Oauth som gjør at
                        appen aldri får vite passordet ditt. Å lagre passord i apper er nemlig trist og uproft.</Text>
                    <Text style={pageStyles.smallText}>All kommunikasjon skjer direkte mellom din telefon og Underskog.
                        Ingen slemminger står i midten og lytter.</Text>
                </View>

            </ScrollView>
        );
    }
}

const pageStyles = StyleSheet.create({

    container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    },

    theButton: {},

    mainText: {
        paddingLeft: 30,

        paddingRight: 30, marginTop: 10,
    },

    smallText: {
        paddingLeft: 30, marginTop: 10, marginBottom: 0, paddingRight: 30, fontSize: 12, color: "#777777"
    }

});