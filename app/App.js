// Library imports
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

// Block imports
import Homescreen from './blocks/screens/Homescreen';
import ScoutTeam from './blocks/screens/ScoutTeam';
import LocalData from './blocks/screens/LocalData';
import CloudData from './blocks/screens/CloudData';
import TeamAnalytics from './blocks/screens/TeamAnalytics';
import Settings from './blocks/screens/Settings';

// Component imports
import { ColorScheme as CS } from './common/ColorScheme';
import { fU, vh } from './common/Constants';

// Navigation setup (https://reactnavigation.org/docs very useful)
const Stack = createNativeStackNavigator();

// Main function
const App = () => {
    // Set up fonts
    const [loadedFonts] = useFonts({
        "Bebas": require("./assets/fonts/Bebas/BebasNeue-Regular.ttf"),

        "GeoSans": require("./assets/fonts/GeoSans/GeosansLight.ttf"),
        "GeoSans Italic": require("./assets/fonts/GeoSans/GeosansLight-Oblique.ttf"),

        "Gobold": require("./assets/fonts/Gobold/GoboldRegular.otf"),
        "Gobold Italic": require("./assets/fonts/Gobold/GoboldRegularItalic.otf"),
        "Gobold Bold": require("./assets/fonts/Gobold/GoboldBold.otf"),
        "Gobold Bold Italic": require("./assets/fonts/Gobold/GoboldBoldItalic.otf"),

        "LGC": require("./assets/fonts/LouiseGeorgeCafe/LouisGeorgeCafe.ttf"),
        "LGC Italic": require("./assets/fonts/LouiseGeorgeCafe/LouisGeorgeCafeItalic.ttf"),
        "LGC Light": require("./assets/fonts/LouiseGeorgeCafe/LouisGeorgeCafeLight.ttf"),
        "LGC Light Italic": require("./assets/fonts/LouiseGeorgeCafe/LouisGeorgeCafeLightItalic.ttf"),
        "LGC Bold": require("./assets/fonts/LouiseGeorgeCafe/LouisGeorgeCafeBold.ttf"),
        "LGC Bold Italic": require("./assets/fonts/LouiseGeorgeCafe/LouisGeorgeCafeBoldItalic.ttf"),
    });

    // Wait until the fonts are loaded then hide the splash screen
    const onLayoutRootView = React.useCallback(async () => {
        if (loadedFonts) {
          await SplashScreen.hideAsync();
        }
    }, [loadedFonts]);
    
    // Close if the fonts can't load
    if (!loadedFonts) {
        return null;
    }

    const headerStyles = {
        headerStyle: styles.headerStyle, 
        headerTitleStyle: styles.headerTitleStyle,
        headerBackTitleStyle: styles.headerBackTitleStyle,
        headerTintColor: `${CS.light2}99`,
    }

    // Stack navigator setup
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* Lots of header options, will eventually use them to build custom header */}
                {/* Home screen */}
                <Stack.Screen name="Home" options={{title: "Home", headerShown: false}}> 
                    {(props) => <Homescreen {...props}/>}
                </Stack.Screen>

                {/* Scouting screen */}
                <Stack.Screen name="ScoutTeam" options={{title: "Scout Team", ...headerStyles}}>
                    {(props) => <ScoutTeam {...props}/>}
                </Stack.Screen>

                {/* Local data screen */}
                <Stack.Screen name="LocalData" options={{title: "Local Data", ...headerStyles}}>
                    {(props) => <LocalData {...props}/>}
                </Stack.Screen>

                {/* Cloud data screen */}
                <Stack.Screen name="CloudData" options={{title: "Cloud Data", ...headerStyles}}>
                    {(props) => <CloudData {...props}/>}
                </Stack.Screen>

                {/* Team analytic screen */}
                <Stack.Screen name="TeamAnalytics" options={({route}) => ({title: `Team ${route.params.teamNumber}`, ...headerStyles})}>
                    {(props) => <TeamAnalytics {...props}/>}
                </Stack.Screen>

                {/* Settings screen */}
                <Stack.Screen name="Settings" options={{title: "Settings", ...headerStyles}}>
                    {(props) => <Settings {...props}/>}
                </Stack.Screen>

            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: CS.header,
        height: 20*vh
    },
    headerTitleStyle: {
        fontFamily: "Bebas",
        fontSize: 24 * fU,
        color: CS.light2
    },
    headerBackTitleStyle: {
        // Doesnt work ??
    }
});

// Exports
export default App;