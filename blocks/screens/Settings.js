// Library imports
import * as React from 'react';
import { getStorage } from "firebase/storage";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera, PermissionStatus } from 'expo-camera';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';

// Component imports
import { ColorScheme as CS } from '../../common/ColorScheme';
import { TTAlert, TTConfirmation, TTGradient, TTWarning } from '../components/ExtraComponents';
import { TTButton, TTPushButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { readStringFromCloud, initializeFirebaseFromSettings } from '../../common/CloudStorage';
import { readData, writeData, loadSettings, deleteData, settingsKey } from '../../common/LocalStorage';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalContainerStyles } from '../../common/GlobalStyleSheet';
import { vh } from '../../common/Constants';

// Main function
const Settings = ({route, navigation}) => {
    // Barcode Scanner states
    const [scanned, setScanned] = React.useState(true);
    const [hasPermission, setHasPermission] = React.useState(null);

    // Warning states
    const [warningVisible, setWarningVisible] = React.useState(false);
    const [warningContent, setWarningContent] = React.useState([]); // Title, text, button text

    // Alert states
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [alertContent, setAlertContent] = React.useState([]);

    // Confirmation states
    const [confirmationVisible, setConfirmationVisible] = React.useState(false);
    const [confirmationContent, setConfirmationContent] = React.useState([]);

    // Settings
    const [settings, setSettings] = React.useState({});

    // Setup
    React.useEffect(() => {
        // Get permission to use the barcode scanner
        const getBarCodeScannerPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === PermissionStatus.GRANTED);
        };
        getBarCodeScannerPermissions();

        // Loading settings
        const loadSettingsToState = async() => {
            const loadedSettings = await loadSettings();
            setSettings(loadedSettings);
        };
        loadSettingsToState();

        // Loading firebase from settings
        initializeFirebaseFromSettings();
    }, []);

    // Checks to make sure permission exists
    if (hasPermission === null) {
        return (
            <View style={globalContainerStyles.centerContainer}>
                <TTGradient/>
                <Text style={globalTextStyles.labelText}>Requesting for camera permission...</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={globalContainerStyles.centerContainer}>
                <TTGradient/>
                <Text style={{...globalTextStyles.secondaryText, fontSize: 30, marginHorizontal: 3*vh}}>
                    TigerScout doesn't have access to your camera!
                </Text>
                <Text style={{...globalTextStyles.labelText, color: `${CS.light1}80`, margin: 3*vh}}>
                    Before you're able to connect to a bucket, you need to enable camera permissions in your phone's settings.
                </Text>
            </View>
        );
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        const contentEquivalency = (a, b) => {
            return a.sort().join(",") === b.sort().join(",");
        }

        setScanned(true);
        try {
            // !! NEED TO ADD MORE CHECKS TO MAKE SURE GARBAGE DATA CAN'T BE UPLOADED!
            const parsedData = JSON.parse(data);

            // Make sure barcode has required keys
            const requiredKeys = ["bucketName", "cloudConfig", "subpath"];
            if (!contentEquivalency(requiredKeys, Object.keys(parsedData))) {
                setWarningContent([null, "QR code doesn't have the right keys to connect to a bucket!", null]);
                setWarningVisible(true);
                return;
            }

            const settings = {
                bucketName: parsedData?.bucketName,
                cloudConfig: parsedData?.cloudConfig,
                subpath: parsedData?.subpath,
            };
            setSettings(settings);
            writeData(JSON.stringify(settings), settingsKey);

            setAlertContent([null, `Successfully connected to ${settings.bucketName}!\n`, null]);
            setAlertVisible(true);
        } catch (e) {
            setWarningContent([null, `There was an issue loading settings from the scanned barcode!\n\n${e}\n`, null]);
            setWarningVisible(true);
            return;
        }
    };

    const deleteCallback = () => {
        deleteData(settingsKey);
        setSettings(null);
    }

    //
    //  QR Code Scanner
    //
    const BarCodeScannerLayout = () => {
        return (
            <View style={{flex: 1, flexDirection: "column", alignContent: "space-evenly", justifyContent: "space-around", padding: 3*vh}}>
                <Camera
                    style={{flex: 1, borderRadius: 2*vh}}
                    key={scanned ? 1 : 2}
                    barCodeScannerSettings={{
                        barCodeTypes: [
                            BarCodeScanner.Constants.BarCodeType.qr
                        ]
                    }}
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
                <TTButton 
                    text="Cancel" 
                    onPress={() => {setScanned(true)}}
                    buttonStyle={{...globalButtonStyles.primaryButton, width: "100%", margin: 3*vh}} 
                    textStyle={globalTextStyles.secondaryText}
                />
            </View>
        );
    };


    //
    //  Normal Settings Layout
    //
    const SettingsLayout = () => {
        return (
            <View style={globalContainerStyles.centerContainer}>
                <TTGradient/>
                
                {/* Settings label */}
                {
                    settings !== null && 
                    (<View>
                        <Text style={{...globalTextStyles.secondaryText, fontSize: 24, marginHorizontal: 3*vh}}>
                            Connected to bucket:
                        </Text>
                        <Text style={{...globalTextStyles.secondaryText, fontSize: 20, color: `${CS.light1}99`, marginHorizontal: 3*vh}}>
                            "{settings.bucketName}"
                        </Text>
                        <Text style={{...globalTextStyles.labelText, color: `${CS.light2}60`, marginHorizontal: 3*vh}}>
                            Subpath: "{settings.subpath}"
                        </Text>

                        <View style={{margin: 1 * vh}}/>

                        <TTButton 
                            text="Disconnect" 
                            onPress={() => {
                                setConfirmationContent([null, `Are you sure you want to disconnect from "${settings.bucketName}"? You won't be able to connect back without the QR code`, null, null]);
                                setConfirmationVisible(true);
                            }}
                            buttonStyle={{...globalButtonStyles.secondaryButton, width: "80%"}} 
                            textStyle={{...globalTextStyles.secondaryText, fontSize: 24}}
                        />
                    </View>)
                }

                {
                    settings === null &&
                    (<View style={globalContainerStyles.columnContainer}>
                        <Text style={{...globalTextStyles.labelText, fontSize: 18, color: CS.light1, margin: 4*vh}}>
                            To get connected, scan a team's QR code.
                        </Text>
                        <TTButton 
                            text="Scan QR Code" 
                            onPress={() => {setScanned(false)}}
                            buttonStyle={{...globalButtonStyles.primaryButton, width: "80%"}} 
                            textStyle={globalTextStyles.secondaryText}
                        />
                    </View>)
                }
            </View>
        );
    }

    // JSX
    return (
        <View style={globalContainerStyles.centerContainer}>
            <TTGradient/>

            <TTWarning
                state={warningVisible}
                setState={setWarningVisible}
                title={warningContent[0]}
                mainText={warningContent[1]}
                acceptText={warningContent[2]}
            />
            <TTAlert
                state={alertVisible}
                setState={setAlertVisible}
                title={alertContent[0]}
                mainText={alertContent[1]}
                acceptText={alertContent[2]}
            />
            <TTConfirmation
                state={confirmationVisible}
                setState={setConfirmationVisible}
                title={confirmationContent[0]}
                mainText={confirmationContent[1]}
                acceptText={confirmationContent[2]}
                rejectText={confirmationContent[3]}
                acceptCallback={deleteCallback}
            />

            { !scanned && <BarCodeScannerLayout/> }
            { scanned && <SettingsLayout/> }
            
            
        </View>
    );
}

// Exports
export default Settings;