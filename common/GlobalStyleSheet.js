import { StyleSheet } from 'react-native';

import { vh, vw } from './Constants';

// Global stylesheet for frequently used styles like backgrounds, buttons, text, etc.. Also provides a base for other styles to build on


const globalButtonStyles = StyleSheet.create({
    primaryButton: {
        // Spacing and positioning
        width: "90%",

        padding: 2*vw,
        margin: 1*vh,

        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 2*vw,

        // Color
        backgroundColor: "#E17512",
        shadowColor: "#BF6410",
        shadowOpacity: 0.33,
        shadowRadius: 22,
    },
    secondaryButton: {
        // Spacing and positioning
        width: "90%",

        padding: 2*vw,
        margin: 1*vh,

        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 2*vw,

        // Color
        backgroundColor: "#D07E32",
        shadowColor: "#BF6410",
        shadowOpacity: 0.33,
        shadowRadius: 7,
    },
    topCounterButton: {
        // Spacing and positioning
        width: "80%",

        padding: 2*vw,
        margin: 1*vh,

        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 2*vw,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,

        // Color
        backgroundColor: "#D07E32",
        shadowColor: "#BF6410",
        shadowOpacity: 0.33,
        shadowRadius: 7,
    },
    bottomCounterButton: {
        // Spacing and positioning
        width: "80%",

        padding: 2*vw,
        margin: 1*vh,

        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 2*vw,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,

        // Color
        backgroundColor: "#D07E32",
        shadowColor: "#BF6410",
        shadowOpacity: 0.33,
        shadowRadius: 7,
    },
    matchKeyButton: {
        // Spacing and positioning
        width: "90%",

        padding: 2*vw,
        margin: 1*vh,

        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 2*vw,

        // Color
        backgroundColor: "#EAE7E4",
        shadowColor: "#AE8848",
        shadowOpacity: 0.33,
        shadowRadius: 7,
    },
});

const globalInputStyles = StyleSheet.create({
    numberInput: {
        // Spacing and positioning
        alignSelf: "center", 
        margin: 10,
        borderRadius: 9, 
        borderWidth: 3, 

        // Color
        backgroundColor: "#3D4A4D", 
        borderColor: "white",
    },
    dropdownInput: {
        // Spacing and positioning
        alignSelf: "center", 
        borderRadius: 9, 
        borderWidth: 3, 

        // Color
        backgroundColor: "#3D4A4D", 
        borderColor: "white",
    }
});

const globalTextStyles = StyleSheet.create({
    primaryText: {
        // Formatting
        fontFamily: "Bebas",
        fontSize: 48,

        // Color
        color: "#FFFFFFFF"
    },
    secondaryText: {
        // Formatting
        fontFamily: "Bebas",
        fontSize: 36,

        // Color
        color: "#FFFFFF50"
    },
    labelText: {
        // Formatting
        fontFamily: "LGC", 
        fontSize: 18,
        letterSpacing: -1,

        // Color
        color: "#FFFFFF",
    },
    matchKeyText: {
        // Formatting
        fontFamily: "LGC", 
        fontSize: 18,
        letterSpacing: 1,

        // Color
        color: "#3E4743",
    }
})

const globalConatinerStyles = StyleSheet.create({
    // General containers
    centerContainer: {
        flex: 1,
        backgroundColor: "#1E1E1E",
        justifyContent: "center",
    },
    topContainer: {
        flex: 1,
        backgroundColor: "#1E1E1E",
    },
    fullscreenBackground: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
    },
    viewBackground: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
    },

    // Layout
    columnContainer: {
        flex: 1,
        flexDirection: "column"
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row"
    },
});

// Exports
export { globalButtonStyles, globalInputStyles, globalTextStyles, globalConatinerStyles };