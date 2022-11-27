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
import Settings from './blocks/screens/Settings';

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
                <Stack.Screen name="ScoutTeam" options={{title: "Scout Team"}}>
                    {(props) => <ScoutTeam {...props}/>}
                </Stack.Screen>

                {/* Scouting screen */}
                <Stack.Screen name="LocalData" options={{title: "Local Data"}}>
                    {(props) => <LocalData {...props}/>}
                </Stack.Screen>

                {/* Scouting screen */}
                <Stack.Screen name="CloudData" options={{title: "Cloud Data"}}>
                    {(props) => <CloudData {...props}/>}
                </Stack.Screen>

                {/* Scouting screen */}
                <Stack.Screen name="Settings" options={{title: "Settings"}}>
                    {(props) => <Settings {...props}/>}
                </Stack.Screen>

            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Exports
export default App;