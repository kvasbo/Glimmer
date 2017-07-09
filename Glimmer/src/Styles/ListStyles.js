import * as colors from "./colorConstants"

import {StyleSheet} from 'react-native'

module.exports = StyleSheet.create({

    whiteBox: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        marginTop: 1,
        marginBottom: 1
    },


    textBlock: {
        padding: 10,
        paddingLeft: 15,
        flex: 8,

    },

    imageBlock: {
        padding: 10,
        paddingTop: 17,
        flex: 1,
    },

    iconBlock: {
        padding: 10,
        paddingRight: 0,
        flex: 1,
    },


    listTitle: {
        fontSize: 16,
        fontWeight: "300",
        marginBottom: 3,
    },

    listTitleHighlight: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 3,
        color: colors.COLOR_HIGHLIGHT,
    },

    listSubtitle: {
        fontSize: 13,
        fontWeight: "300",
        color: colors.COLOR_DARKGREY,
        marginBottom: 2,
    },

    divider : {
        backgroundColor: colors.COLOR_LIGHTGREY
    }

})