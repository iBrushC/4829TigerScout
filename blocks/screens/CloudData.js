// Library imports
import * as React from 'react';
import { getStorage } from 'firebase/storage';
import { getApp, getApps } from "firebase/app";
import { StyleSheet, Text, View } from 'react-native';

// Component imports
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalConatinerStyles } from '../../common/GlobalStyleSheet';
import { readStringFromCloud, initializeFirebaseFromSettings, getAllFilesFromCloud, downloadAllFilesFromCloud, uploadMultipleStringsToCloud } from '../../common/CloudStorage';

// Main function
const CloudData = ({route, navigation}) => {
    React.useEffect(() => {
        initializeFirebaseFromSettings();

        const wrapper = async () => {
            const storage = getStorage();
            const allFiles = await getAllFilesFromCloud(storage, "");
            console.log(`Number of files: ${allFiles.length}`)
            const fileData = await downloadAllFilesFromCloud(storage, "");
            // console.log("All file data:");
            // console.log(JSON.stringify(fileData, null, 2));
        };

        wrapper();
    }, []);

    // No cloud connection
    if (getApps().length === 0) {
        return (
            <View style={globalConatinerStyles.centerContainer}>
                <Text>You're not connected to firebase!</Text>
            </View>
        );
    }

    // Everything else
    return (
        <View style={globalConatinerStyles.centerContainer}>
            <Text>Youre connected to {getApp().options.projectId}</Text>
        </View>
    );
}

// Exports
export default CloudData;