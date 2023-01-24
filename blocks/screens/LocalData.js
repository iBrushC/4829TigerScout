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
import { initializeFirebaseFromSettings, uploadStringToCloud, getAllFilesFromRef } from '../../common/CloudStorage';
import { deleteMultipleMatches, loadMatchData, removeNonMatchKeys, readData } from '../../common/LocalStorage';
import { TTButton, TTCheckbox, TTPushButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalConatinerStyles } from '../../common/GlobalStyleSheet';


// Main function
const LocalData = ({route, navigation}) => {
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
    const uploadDataToCloud = async () => {
        const storage = getStorage();
        if (storage == null) return;

        for (const keyName of matchKeys) {
            const filename = `${keyName.slice(3)}.txt`;
            const fileData = await readData(keyName);
            if (fileData) {
                try {
                    await uploadStringToCloud(storage, fileData, filename);
                    // !! NEED TO INCLUDE A POPUP TO SHOW THAT IT WAS SUCCESSFUL!
                } catch (e) {
                    console.error(`There was an error uploading data to the cloud:\n${e}`);
                    // !! NEED TO INCLUDE A POPUP TO SHOW THAT IT WAS NOT SUCCESSFUL!
                }
            }
        }
        
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
						deleteMultipleMatches(matchKeys)
							.then(loadKeys)
							.catch(e => {console.error(e)});
					}}
				/>}
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