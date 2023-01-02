// Library imports
import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Component Imports
import { vh, vw } from '../../common/Constants';
import { TTButton, TTCheckbox, TTPushButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalConatinerStyles } from '../../common/GlobalStyleSheet';
import { deleteMultipleMatches } from '../../common/LocalStorage';

// Component imports


// Main function
const LocalData = ({route, navigation}) => {
	// Helper function to only keep match keys
	const removeNonMatchKeys = (loadedKeys) => {
		const filtered = loadedKeys.filter((keyName) => {return keyName.slice(0, 3) == "@MD"});
		return filtered;
	}

	const [matchKeys, setMatchKeys] = React.useState([]);

	const loadKeys = () => {
		AsyncStorage.getAllKeys()
			.then((loadedKeys) => {
				const filteredLoadedKeys = removeNonMatchKeys(loadedKeys);
				setMatchKeys(filteredLoadedKeys);
			})
			.catch(e => {console.error(e)});
	};

	// Loads all keys and removes any that don't contain matchdata
	React.useEffect(loadKeys, []);

    return (
        <View style={globalConatinerStyles.topContainer}>
			<LinearGradient
                colors={['#2A3638F0', '#3E474321']}
                style={globalConatinerStyles.fullscreenBackground}
            />

			{/* Match buttons */}
			<ScrollView style={{paddingTop: "5%"}}>
				{
					matchKeys.map((keyName, i) => (
						<View key={i}>
							<TTButton
								text={keyName.slice(3)}
								buttonStyle={{...globalButtonStyles.matchKeyButton, width: "90%", margin: 1 * vh}}
								textStyle={{...globalTextStyles.matchKeyText, margin: 3}}
								onPress={() => {navigation.navigate("ScoutTeam", {dataKey: keyName})}}
							/>
							
						</View>
					))
				}
			</ScrollView>

			{/* Bottom button */}
			<View style={{backgroundColor: "#00000000", paddingTop: "2%", paddingBottom: "2%"}}>
				<LinearGradient
					colors={['#2A3638F0', '#3E474321']}
					style={globalConatinerStyles.fullscreenBackground}
				/>
				<TTButton
					text="Delete Local Data"
					overrideStyle={{}}
					buttonStyle={{...globalButtonStyles.primaryButton, width: "90%", margin: 1 * vh}}
					textStyle={{...globalTextStyles.primaryText, fontSize: 24}}
					onPress={() => {
						// Should probably add an "are you sure?" alert
						deleteMultipleMatches(matchKeys).catch(e => {console.error(e)});
						loadKeys();
					}}
				/>
			</View>
        </View>
    );
}

// Exports
export default LocalData;