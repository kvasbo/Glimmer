
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
        paddingRight: 13,
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
        color: "#E74C3C",
    },

    listSubtitle: {
        fontSize: 13,
        fontWeight: "300",
        color: "#444444",
        marginBottom: 2,
    },

    divider : {
        backgroundColor: '#CCCCCC'
    }

})