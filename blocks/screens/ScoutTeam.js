// Library imports
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Component imports


// Main function
const ScoutTeam = ({route, navigation}) => {
    return (
        <View style={styles.container}>
            <Text>Scouting Screen!</Text>
        </View>
    );
}

// Stylesheet
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

// Exports
export default ScoutTeam;