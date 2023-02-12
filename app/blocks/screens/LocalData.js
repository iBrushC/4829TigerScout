// Library imports
import * as React from 'react';
import { getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Component Imports
import { fU, vh, vw } from '../../common/Constants';
import { ColorScheme as CS } from '../../common/ColorScheme';
import { TTGradient, TTConfirmation, TTLoading, TTWarning, TTAlert } from '../components/ExtraComponents';
import { initializeFirebaseFromSettings, uploadStringToCloud, getAllFilesFromRef, uploadMultipleStringsToCloud } from '../../common/CloudStorage';
import { deleteMultipleDataKeys, loadMatchData, removeNonMatchKeys, readData, saveMatchData, readMultipleDataKeys, loadSettings, deleteData } from '../../common/LocalStorage';
import { TTButton, TTCheckbox, TTPushButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalContainerStyles } from '../../common/GlobalStyleSheet';


// Serializes the data to a string and saves it
const saveRandomData = async () => {
	const matchData = [
		// Pre Round
		Math.round(Math.random() * 30), 
		Math.round(Math.random() * 3),
		Math.round(Math.random() * 2), 
		Math.round(Math.random()), 

		// Auto
		Math.round(Math.random()),
		Math.round(Math.random()),
		Math.round(Math.random()),
		Math.round(Math.random() * 3),
		Math.round(Math.random() * 3),
		Math.round(Math.random() * 3),
		Math.round(Math.random() * 3),

		// Teleop
		Math.round(Math.random() * 3),
		Math.round(Math.random() * 3),
		Math.round(Math.random() * 3),
		Math.round(Math.random() * 3),
		Math.round(Math.random()),
		Math.round(Math.random()),

		// After Round
		"1246890!@#$%^&*()<>?:",
	];

	// Save data using hash
	await saveMatchData(matchData)
};

// Main function
const LocalData = ({route, navigation}) => {
	// FILLS LOCAL DATA WITH A BUNCH OF FAKE DATA FOR TESTING
	const [matchKeys, setMatchKeys] = React.useState([]);
	const [settings, setSettings] = React.useState(null);

	// Confirmation states
    const [confirmationVisible, setConfirmationVisible] = React.useState(false);
    const [confirmationContent, setConfirmationContent] = React.useState([]);

	// Loading states
    const [loadingVisible, setLoadingVisible] = React.useState(false);
    const [loadingContent, setLoadingContent] = React.useState([]);

	// Warning states
    const [warningVisible, setWarningVisible] = React.useState(false);
    const [warningContent, setWarningContent] = React.useState([]); // Title, text, button text

    // Alert states
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [alertContent, setAlertContent] = React.useState([]);

    // Gets all the keys from local settings
	const loadKeys = async () => {
        try {
		    const loadedKeys = await AsyncStorage.getAllKeys()
            const filteredLoadedKeys = removeNonMatchKeys(loadedKeys);
			setMatchKeys(filteredLoadedKeys);
        } catch (e) {
            console.error(e);
        }
	};

    // Upload all the data keys to the cloud
    const uploadDataToCloud = async () => {
		setLoadingContent([null, `Uploading files to cloud...`]);
		setLoadingVisible(true);

		let storage = null;
		try {
			storage = getStorage();
		} catch (e) {
			setLoadingVisible(false);
			setWarningContent([null, `Couldn't get a connection to bucket storage! Make sure you've scanned a valid QR code.`, null]);
			setWarningVisible(true);
			return;
		}

		let multiStringData = [];
		try {
			multiStringData = await readMultipleDataKeys(matchKeys);
		} catch (e) {
			setLoadingVisible(false);
			setWarningContent([null, `Couldn't get a connection to bucket storage!\n${e}`, null]);
			setWarningVisible(true);
			return;
		}
		const filenames = matchKeys.map(
			(keyName) => {
				const components = keyName.split("-");
				const teamNumberPadded = components[0].slice(3).padStart(4, "0");
				let filename = `${teamNumberPadded}-${components.slice(1).join("-")}.txt`;

				if (settings !== null) filename = `${settings.subpath}/${filename}`

				return filename;
			}
		);
		await uploadMultipleStringsToCloud(storage, multiStringData, filenames);

		setLoadingVisible(false);
		setAlertContent(["Success!", `Successfully uploaded ${filenames.length} files to the cloud!`, null]);
		setTimeout(() => setAlertVisible(true), 500);

		return;
	}


	// Loads all keys and removes any that don't contain matchdata
	React.useEffect(() => {
		// Loads and stores settings
		const wrapper = async () => {
			const loadedSettings = await loadSettings();
			setSettings(loadedSettings);
		}

        loadKeys();
        initializeFirebaseFromSettings();
		wrapper();

		// Used for testing only, should be removed
		const UploadFakeRandomData = async () => {
			for (let i = 0; i < 200; i++) {
				await saveRandomData();
			}
		}
		// UploadFakeRandomData();

    }, []);

	const deleteCallback = async () => {
		try {
			await deleteMultipleDataKeys(matchKeys);
			loadKeys();
		} catch (e) {
			console.error(e)
		}
	}
    
    return (
		<View style={globalContainerStyles.topContainer}>
			<TTGradient/>

			{/* This is an upsetting amount of boilerplate */}
            <TTAlert
                state={alertVisible}
                setState={setAlertVisible}
                title={alertContent[0]}
                mainText={alertContent[1]}
                acceptText={alertContent[2]}
            />
			<TTWarning
                state={warningVisible}
                setState={setWarningVisible}
                title={warningContent[0]}
                mainText={warningContent[1]}
                acceptText={warningContent[2]}
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
			<TTLoading
                state={loadingVisible}
                setState={setLoadingVisible}
                title={loadingContent[0]}
                mainText={loadingContent[1]}
                acceptText={loadingContent[2]}
            />

			{/* Match buttons */}
			<ScrollView style={{paddingTop: 2*vh}}>
				{
					matchKeys.map((keyName, i) => (
						<View key={i} style={{flexDirection: "row", alignSelf: "center"}}>
							<TTButton
								text={keyName.slice(3)}
								buttonStyle={{...globalButtonStyles.matchKeyButton, width: 80 * vw, marginVertical: 1 * vh}}
								textStyle={{...globalTextStyles.matchKeyText}}
								onPress={async () => {
									const matchData = await loadMatchData(keyName)
									navigation.navigate("ScoutTeam", {matchData: matchData})
								}}
							/>
							<TTButton
								text="X"
								buttonStyle={{...globalButtonStyles.matchKeyButton, backgroundColor: CS.accent3, marginHorizontal: 0}}
								textStyle={{...globalTextStyles.matchKeyText, color: CS.light1}}
								onPress={async () => {
									await deleteData(keyName);
									await loadKeys();
								}}
							/>
						</View>
					))
				}
				<View style={{marginTop: 1*vh}}></View>
				{matchKeys.length > 0 && <TTButton
					text="Delete Local Data"
					buttonStyle={{...globalButtonStyles.secondaryButton, width: "90%", margin: 1 * vh}}
					textStyle={{...globalTextStyles.primaryText, fontSize: 16 * fU}}
					onPress={() => {
						setConfirmationVisible(true);
						setConfirmationContent([null, `Are you sure you want to delete all ${matchKeys.length} files? You wont be able to get them back.`, null, null]);
					}}
				/>}
				<View style={{marginBottom: 4*vh}}></View>
			</ScrollView>

			{/* Bottom button */}
			<View style={{backgroundColor: CS.transparent}}>
				<TTGradient/>

				{ (settings !== null && settings?.permissions === "editor") &&
					<TTButton
						text="Upload Data To Cloud"
						buttonStyle={{...globalButtonStyles.primaryButton, width: "90%", margin: 2 * vh}}
						textStyle={{...globalTextStyles.primaryText, fontSize: 24 * fU}}
						onPress={() => {uploadDataToCloud()}}
					/>
				}
				{
					(settings !== null && settings?.permissions !== "editor") &&
					<Text style={{...globalTextStyles.labelText, fontFamily: "LGC Light", color: CS.light2, margin: 2*vh}}>
						You don't have permission to upload to the bucket you're connected to!
					</Text>
				}
				
			</View>
        </View>
    );
}

// Exports
export default LocalData;