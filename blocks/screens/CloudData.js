// Library imports
import * as React from 'react';
import { getStorage } from 'firebase/storage';
import { getApp, getApps } from "firebase/app";
import { StyleSheet, Text, View } from 'react-native';

// Component imports
import { vh, vw } from '../../common/Constants';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalContainerStyles } from '../../common/GlobalStyleSheet';
import { readStringFromCloud, initializeFirebaseFromSettings, getAllFilesFromCloud, downloadAllFilesFromCloud, uploadMultipleStringsToCloud } from '../../common/CloudStorage';
import { TTButton } from '../components/ButtonComponents';
import { TTGradient, TTLoading } from '../components/ExtraComponents';
import { loadSettings } from '../../common/LocalStorage';

// Main function
const CloudData = ({route, navigation}) => {
    // Settings
    const [settings, setSettings] = React.useState(null);

    // Loading states
    const [loadingVisible, setLoadingVisible] = React.useState(false);
    const [loadingContent, setLoadingContent] = React.useState([]);

    React.useEffect(() => {
        const wrapper = async () => {
            const loadedSettings = await loadSettings();
            setSettings(loadedSettings);
        };

        initializeFirebaseFromSettings();
        wrapper();
    }, []);

    // No cloud connection
    if (getApps().length === 0) {
        return (
            <View style={globalContainerStyles.centerContainer}>
                <TTGradient/>
                <Text style={globalTextStyles.labelText}>You're not connected to Firebase!</Text>
                <TTButton
                    text="Go To Settings"
                    buttonStyle={{...globalButtonStyles.primaryButton, width: "70%", margin: 2 * vh}}
                    textStyle={{...globalTextStyles.primaryText, fontSize: 36, marginTop: 0.5*vh}}
                    onPress={() => {navigation.navigate("Settings")}}
                />
            </View>
        );
    }

    // Everything else
    return (
        <View style={globalContainerStyles.centerContainer}>
            <TTGradient/>
            <TTLoading
                state={loadingVisible}
                setState={setLoadingVisible}
                title={loadingContent[0]}
                mainText={loadingContent[1]}
                acceptText={loadingContent[2]}
            />
            
            <Text style={globalTextStyles.primaryText}>Youre connected to {getApp().options.projectId}</Text>
        </View>
    );
}

// Exports
export default CloudData;