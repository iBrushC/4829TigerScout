// Library imports
import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Literally just to get cool background lmao

// Component imports
import { vh, vw } from '../../common/Constants';
import { globalButtonStyles, globalTextStyles, globalConatinerStyles } from '../../common/GlobalStyleSheet';
import { TTButton } from '../components/ButtonComponents';

// Main function
const Homescreen = ({route, navigation}) => {
    return (
        <View style={globalConatinerStyles.container}>
            {/* Background */}
            <LinearGradient
                colors={['#2A3638F0', '#3E474321']}
                style={globalConatinerStyles.background}
            />
            
            {/* Scout */}
            <TTButton 
                text="Scout Team"
                buttonStyle={[
                    globalButtonStyles.primaryButton,
                    {   
                        borderRadius: 5 * vw,
                        height: 50 * vh,
                    }
                ]}
                textStyle={[
                    globalTextStyles.primaryText,
                    {
                        fontSize: 60,
                        color: "#FFFFFF"
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
                        borderRadius: 5 * vw,
                        height: 10 * vh,
                    }
                ]}
                textStyle={[
                    globalTextStyles.primaryText,
                    {
                        fontSize: 42,
                        color: "#FFFFFF"
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
                        borderRadius: 5 * vw,
                        height: 10 * vh,
                    }
                ]}
                textStyle={[
                    globalTextStyles.primaryText,
                    {
                        fontSize: 42,
                        color: "#FFFFFF"
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
                        borderRadius: 5 * vw,
                        height: 10 * vh,
                    }
                ]}
                textStyle={[
                    globalTextStyles.primaryText,
                    {
                        fontSize: 42,
                        color: "#FFFFFF"
                    }
                ]}
                onPress= {() => navigation.navigate("Settings", {})}
            />
        </View>
    );
}

// Exports
export default Homescreen;