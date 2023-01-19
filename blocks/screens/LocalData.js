// Library imports
import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Component Imports
import { vh, vw } from '../../common/Constants';
import { TTButton, TTCheckbox, TTPushButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalConatinerStyles } from '../../common/GlobalStyleSheet';
import { deleteMultipleMatches, loadMatchData, removeNonMatchKeys } from '../../common/LocalStorage';
import { TTGradient } from '../components/ExtraComponents';
import { CS } from '../../common/ColorScheme';

// Component imports


// Main function
const LocalData = ({route, navigation}) => {
	const [matchKeys, setMatchKeys] = React.useState([]);

	const loadKeys = () => {
		AsyncStorage.getAllKeys()
			.then((loadedKeys) => {
				const filteredLoadedKeys = removeNonMatchKeys(loadedKeys);
				setMatchKeys(filteredLoadedKeys);
			})
			.catch(e => {console.error(e)});
	};

	// Function to make sure people want to delete keys before actually doing it
	const checkDeleteKeys = () => {

	}

	// Loads all keys and removes any that don't contain matchdata
	React.useEffect(loadKeys, []);

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
					onPress={() => {}}
				/>
			</View>
        </View>
    );
}

// Exports
export default LocalData;