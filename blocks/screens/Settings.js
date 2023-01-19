// Library imports
import * as React from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';

// Component imports
import { TTAlert, TTGradient } from '../components/ExtraComponents';
import CS from '../../common/ColorScheme';
import { TTButton, TTPushButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalConatinerStyles } from '../../common/GlobalStyleSheet';

// Main function
const Settings = ({route, navigation}) => {
    // States
    const [hasPermission, setHasPermission] = React.useState(null);
    const [scanned, setScanned] = React.useState(true);
    const [alertVisible, setAlertVisible] = React.useState(false);

    // Get permission to use the barcode scanner
    React.useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    // Checks to make sure permission exists
    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    // Idk docs uses it
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    // JSX
    return (
        <View style={globalConatinerStyles.centerContainer}>
            <TTGradient/>
            {
            !scanned && <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            }
            {
            scanned && <TTButton 
                text="Scan Barcode" 
                onPress={() => {setScanned(false)}}
                buttonStyle={{padding: 12, backgroundColor: "orange", borderRadius: 5}} 
            />
            }
            <TTAlert
                state={alertVisible}
                setState={setAlertVisible}
            />
            <TTButton 
                text="Show Alert" 
                onPress={() => {setAlertVisible(true)}}
                buttonStyle={{padding: 12, backgroundColor: "orange", borderRadius: 5}} 
            />
        </View>
    );
}

// Exports
export default Settings;