// Library imports
import * as React from 'react';
import { getStorage } from 'firebase/storage';
import { getApp, getApps } from "firebase/app";
import { StyleSheet, Text, View } from 'react-native';

// Component imports
import { readStringFromCloud, initializeFirebaseFromSettings, getAllFilesFromCloud } from '../../common/CloudStorage';


// Main function
const CloudData = ({route, navigation}) => {
    React.useEffect(() => {
        initializeFirebaseFromSettings();
        const wrapper = async () => {
            const allFiles = await getAllFilesFromCloud(getStorage(), "");
            console.log("All Files:");
            console.log(allFiles);
        };
        wrapper();
    }, []);

    // No cloud connection
    if (getApps().length === 0) {
        return (
            <View style={styles.container}>
                <Text>You're not connected to firebase!</Text>
            </View>
        );
    }

    // Everything else
    return (
        <View style={styles.container}>
            <Text>Youre connected to {getApp().options.projectId}</Text>
        </View>
    );
}

// Exports
export default CloudData;