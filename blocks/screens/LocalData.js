// Library imports
import * as React from 'react';
import { getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Component Imports
import { vh, vw } from '../../common/Constants';
import { TTGradient } from '../components/ExtraComponents';
import { ColorScheme as CS } from '../../common/ColorScheme';
import { initializeFirebaseFromSettings, uploadStringToCloud, getAllFilesFromRef, uploadMultipleStringsToCloud } from '../../common/CloudStorage';
import { deleteMultipleDataKeys, loadMatchData, removeNonMatchKeys, readData, saveMatchData, readMultipleDataKeys } from '../../common/LocalStorage';
import { TTButton, TTCheckbox, TTPushButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalConatinerStyles } from '../../common/GlobalStyleSheet';


// Serializes the data to a string and saves it
const saveRandomData = async () => {
	const matchData = [
		// Pre Round
		Math.round(Math.random() * 9999), 
		Math.round(Math.random() * 9999),
		Math.round(Math.random() * 2), 
		Math.round(Math.random() * 2), 

		// Auto
		Math.round(Math.random()),
		Math.round(Math.random()),
		Math.round(Math.random()),
		Math.round(Math.random() * 9999),
		Math.round(Math.random() * 9999),
		Math.round(Math.random() * 9999),
		Math.round(Math.random() * 9999),

		// Teleop
		Math.round(Math.random() * 9999),
		Math.round(Math.random() * 9999),
		Math.round(Math.random() * 9999),
		Math.round(Math.random() * 9999),
		Math.round(Math.random()),
		Math.round(Math.random()),

		// After Round
		"testtesttesttest",
	];

	// Save data using hash
	await saveMatchData(matchData)
};

// Main function
const LocalData = ({route, navigation}) => {
	// FILLS LOCAL DATA WITH A BUNCH OF FAKE DATA FOR TESTING
	
	React.useEffect(() => {
		const UploadFakeRandomData = async () => {
			for (let i = 0; i < 200; i++) {
				await saveRandomData();
			}
		}
		// UploadFakeRandomData();
	}, []);
	

	const [matchKeys, setMatchKeys] = React.useState([]);

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
	// This takes WAY TOO LONG (~2 minutes for 500 files)
    const uploadDataToCloud = async () => {
        const storage = getStorage();
        if (storage == null) return;

		// !! NEED TO INCLUDE SUBPATHS !!
		const multiStringData = await readMultipleDataKeys(matchKeys);
		const filenames = matchKeys.map((keyName) => {return `${keyName.slice(3)}.txt`});
		await uploadMultipleStringsToCloud(storage, multiStringData, filenames);
		console.log("Done");
    }


	// Loads all keys and removes any that don't contain matchdata
	React.useEffect(() => {
        loadKeys();
        initializeFirebaseFromSettings();

    }, []);

    
    return (
        <View style={globalConatinerStyles.topContainer}>
			<TTGradient/>

			{/* Match buttons */}
			<ScrollView style={{paddingTop: 2*vh}}>
				{
					matchKeys.map((keyName, i) => (
						<View key={i}>
							<TTButton
								text={keyName.slice(3)}
								buttonStyle={{...globalButtonStyles.matchKeyButton, width: "90%", margin: 1 * vh}}
								textStyle={{...globalTextStyles.matchKeyText, margin: 3}}
								onPress={async () => {
									const matchData = await loadMatchData(keyName)
									navigation.navigate("ScoutTeam", {matchData: matchData})
								}}
							/>
							
						</View>
					))
				}
				<View style={{marginTop: 1*vh}}></View>
				{matchKeys.length > 0 && <TTButton
					text="Delete Local Data"
					buttonStyle={{...globalButtonStyles.secondaryButton, width: "90%", margin: 1 * vh}}
					textStyle={{...globalTextStyles.primaryText, fontSize: 16}}
					onPress={() => {
						// Should probably add an "are you sure?" alert
						deleteMultipleDataKeys(matchKeys)
							.then(loadKeys)
							.catch(e => {console.error(e)});
					}}
				/>}
				<View style={{marginBottom: 4*vh}}></View>
			</ScrollView>

			{/* Bottom button */}
			<View style={{backgroundColor: CS.transparent, paddingTop: "2%", paddingBottom: "2%"}}>
				<TTGradient/>
				<TTButton
					text="Upload Data To Cloud"
					buttonStyle={{...globalButtonStyles.primaryButton, width: "90%", margin: 1 * vh}}
					textStyle={{...globalTextStyles.primaryText, fontSize: 24}}
					onPress={() => {uploadDataToCloud()}}
				/>
			</View>
        </View>
    );
}

// Exports
export default LocalData;