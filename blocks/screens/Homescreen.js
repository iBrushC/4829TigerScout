// Library imports
import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Literally just to get cool background lmao

// Component imports
import { vh, vw } from '../../common/Constants';
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

    return (
        <View style={globalContainerStyles.centerContainer}>
            {/* Background */}
            <TTGradient/>
            
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
                        fontSize: 60,
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
                        fontSize: 42,
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
                        fontSize: 42,
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
                        fontSize: 42,
                        color: CS.light1
                    }
                ]}
                onPress= {() => navigation.navigate("Settings", {})}
            />
        </View>
    );
}

// Exports
export default Homescreen;