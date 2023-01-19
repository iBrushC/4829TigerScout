// Library imports
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Component imports
import { uploadStringToCloud, readStringFromCloud } from '../../common/CloudStorage';


// Main function
const CloudData = ({route, navigation}) => {
    return (
        <View style={styles.container}>
            <Text>Cloud Data!</Text>
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
export default CloudData;