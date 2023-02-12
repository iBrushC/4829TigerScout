// Library imports
import * as React from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Literally just to get cool background lmao

// Component imports
import { fU, vh, vw } from '../../common/Constants';
import { ColorScheme as CS } from '../../common/ColorScheme';
import { globalButtonStyles, globalTextStyles, globalContainerStyles } from '../../common/GlobalStyleSheet';
import { TTButton } from '../components/ButtonComponents';
import { TTGradient } from '../components/ExtraComponents';
import { initializeFirebaseFromSettings } from '../../common/CloudStorage';

// Main function
const Homescreen = ({route, navigation}) => {
    // Prevents the app from erroring out when firebase is first used
    React.useEffect(() => {
        initializeFirebaseFromSettings();
    },[])

    // !! TODO MAKE EVERY SINGLE FONT SIZE IN REFERENCE TO VH / VW

    return (
        <View style={{...globalContainerStyles.centerContainer, justifyContent: "space-evenly"}}>
            {/* Background */}
            <TTGradient/>

            {/* Spacer */}
            {Platform.OS === 'ios' && <View style={{margin: 1.2*vh}}/>}

            {/* Clout Header */}
            <Text style={{
                alignSelf: "center",

                color: `${CS.light1}30`,
                fontFamily: "LGC Light",
                letterSpacing: 0.5*vw
            }}>
                <Text style={{fontFamily: "LGC Bold"}}>TigerScout</Text> powered by <Text style={{fontFamily: "LGC Bold"}}>4829</Text>
            </Text>
            
            {/* Scout */}
            <TTButton 
                text="Scout Team"
                buttonStyle={[
                    globalButtonStyles.primaryButton,
                    {   
                        borderRadius: 2 * vw,
                        height: 50 * vh,
                    }
                ]}
                textStyle={[
                    globalTextStyles.primaryText,
                    {
                        fontSize: 60 * fU,
                        color: CS.light1
                    }
                ]}
                onPress= {() => navigation.navigate("ScoutTeam", {})}
            />

            {/* Local Data */}
            <TTButton 
                text="Local Data"
                buttonStyle={[
                    globalButtonStyles.secondaryButton,
                    {   
                        borderRadius: 2 * vw,
                        height: 10 * vh,
                    }
                ]}
                textStyle={[
                    globalTextStyles.primaryText,
                    {
                        fontSize: 42 * fU,
                        color: CS.light1
                    }
                ]}
                onPress= {() => navigation.navigate("LocalData", {})}
            />

            {/* Cloud Data */}
            <TTButton 
                text="Cloud Data"
                buttonStyle={[
                    globalButtonStyles.secondaryButton,
                    {   
                        borderRadius: 2 * vw,
                        height: 10 * vh,
                    }
                ]}
                textStyle={[
                    globalTextStyles.primaryText,
                    {
                        fontSize: 42 * fU,
                        color: CS.light1
                    }
                ]}
                onPress= {() => navigation.navigate("CloudData", {})}
            />

            {/* Settings */}
            <TTButton 
                text="Settings"
                buttonStyle={[
                    globalButtonStyles.secondaryButton,
                    {   
                        borderRadius: 2 * vw,
                        height: 10 * vh,
                    }
                ]}
                textStyle={[
                    globalTextStyles.primaryText,
                    {
                        fontSize: 42 * fU,
                        color: CS.light1
                    }
                ]}
                onPress= {() => navigation.navigate("Settings", {})}
            />

            <View style={{margin: 0.25*vh}}/>
        </View>
    );
}

// Exports
export default Homescreen;