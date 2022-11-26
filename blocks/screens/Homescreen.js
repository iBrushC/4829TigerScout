// Library imports
import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Literally just to get cool background lmao

// Component imports
import { screenHeight } from '../../common/Constants';

// Main function
const Homescreen = ({route, navigation}) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2A3638F0', '#3E474321']}
                style={styles.background}
            />
            
            <Text>Home Screen!</Text>
            
            {/* Scout */}
            <Button 
                title="Scout Team"
                onPress= {() => navigation.navigate("ScoutTeam", {})}
            />

            {/* Local Data */}
            <Button 
                title="Local Data"
                onPress= {() => navigation.navigate("LocalData", {})}
            />

            {/* Cloud Data */}
            <Button 
                title="Cloud Data"
                onPress= {() => navigation.navigate("CloudData", {})}
            />

            {/* Settings */}
            <Button 
                title="Settings"
                onPress= {() => navigation.navigate("Settings", {})}
            />
        </View>
    );
}

// Stylesheet
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1E1E1E',
      alignItems: 'center',
      justifyContent: 'center',
    },
    background: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: screenHeight,
    }
});

// Exports
export default Homescreen;