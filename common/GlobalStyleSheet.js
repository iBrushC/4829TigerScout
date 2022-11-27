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

        padding: 1*vw,
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
    }
});

const globalTextStyles = StyleSheet.create({
    primaryText: {
        // Formatting
        fontFamily: "Bebas",
        fontSize: 48,

        // Color
        color: "#FFFFFF"
    },
    secondaryText: {

    }
})

const globalConatinerStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        justifyContent: 'center',
      },
      background: {
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
      }
});

// Exports
export { globalButtonStyles, globalTextStyles, globalConatinerStyles };