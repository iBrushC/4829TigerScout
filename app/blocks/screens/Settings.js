// Library imports
import * as React from 'react';
import { getStorage } from "firebase/storage";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera, PermissionStatus } from 'expo-camera';
import { StyleSheet, Text, View, TextInput, NativeModules } from 'react-native';
import CryptoJS from 'crypto-js';

// Component imports
import { ColorScheme as CS } from '../../common/ColorScheme';
import { TTAlert, TTConfirmation, TTGradient, TTWarning, TTPoll } from '../components/ExtraComponents';
import { TTButton, TTPushButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { readStringFromCloud, initializeFirebaseFromSettings } from '../../common/CloudStorage';
import { readData, writeData, loadSettings, deleteData, settingsKey, saveCloudCache } from '../../common/LocalStorage';
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

    // Poll sates
    const [enterTextVisible, setEnterTextVisible] = React.useState(false);
    const [enterPasswordVisible, setEnterPasswordVisible] = React.useState(false);
    const [enteredPassword, setEnteredPassword] = React.useState("");
    
    const [connectionData, setConnectionData] = React.useState("");

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
        const loadSettingsToState = async () => {
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

    const connectFromData = async () => {
        const contentEquivalency = (a, b) => {
            return a.sort().join(",") === b.sort().join(",");
        }

        try {
            // !! NEED TO ADD MORE CHECKS TO MAKE SURE GARBAGE DATA CAN'T BE UPLOADED!
            const bytes = CryptoJS.AES.decrypt(connectionData.toString(), enteredPassword);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            const parsedData = JSON.parse(decryptedData);

            // Make sure barcode has required keys
            const requiredKeys = ["bucketName", "cloudConfig", "subpath", "permissions"];
            if (!contentEquivalency(requiredKeys, Object.keys(parsedData))) {
                setWarningContent([null, "QR code doesn't have the right keys to connect to a bucket!", null]);
                setTimeout(() => setWarningVisible(true), 500);
                return;
            }

            const settings = {
                bucketName: parsedData.bucketName,
                cloudConfig: parsedData.cloudConfig,
                subpath: parsedData.subpath,
                permissions: parsedData.permissions
            };
            setSettings(settings);
            writeData(JSON.stringify(settings), settingsKey);

            setAlertContent([null, `Successfully connected to ${settings.bucketName}!\n`, null]);
            setTimeout(() => setAlertVisible(true), 500);
        } catch (e) {
            setWarningContent([null, `Invalid data entered, connection failed!`, null]);
            setTimeout(() => setWarningVisible(true), 500);
            return;
        }
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setConnectionData(data);
        setEnteredPassword("");
        setEnterPasswordVisible(true);
    };

    const deleteCallback = () => {
        deleteData(settingsKey);
        setSettings(null);
        saveCloudCache(null);
    }

    //
    //  QR Code Scanner
    //
    const BarCodeScannerLayout = () => {
        return (
            <View style={{flex: 1, flexDirection: "column", alignContent: "center", justifyContent: "space-around", padding: 3*vh}}>
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
                        <Text style={{...globalTextStyles.labelText, fontSize: 18, color: CS.light1, margin: 3*vh}}>
                            To get connected, scan a team's QR code.
                        </Text>
                        <TTButton 
                            text="Scan QR Code" 
                            onPress={() => {
                                setConnectionData("");
                                setScanned(false);
                            }}
                            buttonStyle={{...globalButtonStyles.primaryButton, width: "80%"}} 
                            textStyle={globalTextStyles.secondaryText}
                        />
                        <Text style={{...globalTextStyles.labelText, fontSize: 18, color: CS.light1, margin: 3*vh}}>
                            Or connect with text
                        </Text>
                        <TTButton 
                            text="Enter Text" 
                            onPress={() => {
                                setConnectionData("");
                                setEnterTextVisible(true);
                            }}
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
            <TTPoll
                state={enterPasswordVisible}
                setState={setEnterPasswordVisible}
                title="Enter Password"
                overrideTitleStyle={{fontSize: 30}}
                mainText="Enter the bucket's password to connect (32 characters max)"
                acceptText="Ok"
                secureTextEntry={true}
                textState={enteredPassword}
                setTextState={setEnteredPassword}
                overrideTextInputStyle={{...globalTextStyles.labelText, height: 8*vh}}
                maxLength={32}
                enterCallback={() => {
                    connectFromData();
                }}
            />
            <TTPoll
                state={enterTextVisible}
                setState={setEnterTextVisible}
                title="Enter Bucket Text"
                overrideTitleStyle={{fontSize: 36}}
                mainText="Paste in bucket text below"
                acceptText="Ok"
                multiline={true}
                numberOfLines={1}
                textState={connectionData}
                setTextState={setConnectionData}
                overrideTextInputStyle={{...globalTextStyles.labelText, height: 20*vh}}
                enterCallback={() => {
                    setEnteredPassword("");
                    setTimeout(() => {setEnterPasswordVisible(true)}, 500)
                }}
            />

            { !scanned && <BarCodeScannerLayout/> }
            { scanned && <SettingsLayout/> }
            
            
        </View>
    );
}

// Exports
export default Settings;
