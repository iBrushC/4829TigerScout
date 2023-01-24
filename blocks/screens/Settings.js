// Library imports
import * as React from 'react';
import { getStorage } from "firebase/storage";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';

// Component imports
import { setColorScheme } from '../../common/ColorScheme';
import { TTAlert, TTGradient, TTWarning } from '../components/ExtraComponents';
import { TTButton, TTPushButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { readStringFromCloud, initializeFirebaseFromSettings } from '../../common/CloudStorage';
import { readData, writeData, loadSettings, deleteData, settingsKey } from '../../common/LocalStorage';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalConatinerStyles } from '../../common/GlobalStyleSheet';

// Main function
const Settings = ({route, navigation}) => {
    // Barcode Scanner states
    const [scanned, setScanned] = React.useState(true);
    const [hasPermission, setHasPermission] = React.useState(null);

    // Warning states
    const [warningVisible, setWarningVisible] = React.useState(false);
    const [warningText, setWarningText] = React.useState("This shouldn't be visible!");

    // Alert states
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [alertText, setAlertText] = React.useState("This shouldn't be visible!");

    // Setup
    React.useEffect(() => {
        // Get permission to use the barcode scanner
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();

        // Loading settings
        initializeFirebaseFromSettings();
    }, []);

    // Checks to make sure permission exists
    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        try {
            // !! NEED TO ADD MORE CHECKS TO MAKE SURE GARBAGE DATA CAN'T BE UPLOADED!
            const parsedData = JSON.parse(data);
            const settings = {
                cloudConfig: parsedData?.cloudConfig,
                colorScheme: parsedData?.colorScheme,
            }
            writeData(data, JSON.stringify(settings));
            
            let notificationText = "";

            if (parsedData?.cloudConfig) notificationText += `Successfully connected to ${settings.cloudConfig.projectId}!\n`;
            if (parsedData?.colorScheme) notificationText += "\nSuccessfully updated color palette!\n";

            setAlertText(notificationText);
            setAlertVisible(true);
        } catch (e) {
            setWarningText(`There was an issue loading settings from the scanned barcode!\n\n${e}\n`);
            setWarningVisible(true);
        }
    };

    // JSX
    return (
        <View style={globalConatinerStyles.centerContainer}>
            <TTGradient/>

            {
            //
            //  QR Code Scanner
            //
            !scanned && 
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            }

            {
            //
            //  Everything Else
            //
            scanned &&
            (
                <View>
                    <TTButton 
                        text="Scan Barcode" 
                        onPress={() => {setScanned(false)}}
                        buttonStyle={globalButtonStyles.primaryButton} 
                        textStyle={globalTextStyles.secondaryText}
                    />
                </View>
            ) 
            }
            <TTWarning
                state={warningVisible}
                setState={setWarningVisible}
                mainText={warningText}
            />
            <TTAlert
                state={alertVisible}
                setState={setAlertVisible}
                mainText={alertText}
                title="Success!"
            />
            
        </View>
    );
}

// Exports
export default Settings;