// Library imports
import * as React from 'react';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';

// Component imports
import ColorScheme from '../../common/ColorScheme';
import { TTButton, TTPushButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { TTDropdown } from '../components/InputComponents';

// Main function
const Settings = ({route, navigation}) => {
    // States
    const [autoSync, setAutoSync] = React.useState(false);
    const [autoClear, setAutoClear] = React.useState(false);
    const [randomVar, setRandomVar] = React.useState(false);
    const [dropdown, setDropdown] = React.useState("Select an Option");

    // JSX
    return (
        <View style={styles.container}>
            <Text>Settings! (all styles are temporary)</Text>
            <TextInput
                style={styles.PLACEHOLDER_input}
                placeholder="Scouter Name"
            />

            <TTDropdown 
                state={dropdown} 
                setState={setDropdown} 
                items={["Option 1", "Option 2", "Option 3"]}
                boxWidth={150}
                boxHeight={40}
                boxStyle={{backgroundColor: "aqua", padding: 5}}
                overrideStyle={{margin: 10}}
                zIndex={5}
                iconComponent={<Image style={{width: 20, height: 20}} source={{uri: "https://cdn1.iconfinder.com/data/icons/arrow-outline-6/32/Arrow_Icon_Set_4-512.png"}}/>}
            />
            <TTPushButton 
                text="Currently Not Syncing to Cloud" 
                pushText="Now Syncing to Cloud!" 
                state={autoSync} 
                setState={setAutoSync} 
                buttonStyle={{padding: 12, backgroundColor: "orange", borderRadius: 5}} 
                buttonPushedStyle={{padding: 12, backgroundColor: "red", borderRadius: 5}}
            />
            <TTPushButton 
                text="Auto Clear Synced Local Data" 
                state={autoClear} 
                setState={setAutoClear} 
                buttonStyle={{padding: 12, backgroundColor: "orange", borderRadius: 5}} 
                buttonPushedStyle={{padding: 12, backgroundColor: "red", borderRadius: 5}}
            />

            <TTSimpleCheckbox 
                text="And heres a random checkbox" 
                state={randomVar} 
                setState={setRandomVar} 
                boxCheckedStyle={{padding: 15, backgroundColor: "green", borderRadius: 15}} 
                boxUncheckedStyle={{padding: 15, backgroundColor: "red"}}
            />

            {/* Really shouldn't be using default buttons for anything */}
            <TTButton text="Save" onPress={() => navigation.navigate("Home")} buttonStyle={{padding: 12, backgroundColor: "blue", borderRadius: 5}} textStyle={{font: "Comic Sans"}}/>
        </View>
    );
}

// Stylesheet
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    PLACEHOLDER_input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        width: 300,
        padding: 10,
    },
    PLACEHOLDER_checkboxUnchecked: {
        margin: 12,
        padding: 10,
        elevation: 3,
        backgroundColor: ColorScheme.color2
    },
    PLACEHOLDER_checkboxChecked: {
        margin: 12,
        padding: 10,
        elevation: 3,
        backgroundColor: ColorScheme.color3
    },
  });

// Exports
export default Settings;