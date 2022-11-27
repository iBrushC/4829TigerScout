// Library imports
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Block imports
import Homescreen from './blocks/screens/Homescreen';
import ScoutTeam from './blocks/screens/ScoutTeam';
import LocalData from './blocks/screens/LocalData';
import CloudData from './blocks/screens/CloudData';
import Settings from './blocks/screens/Settings';

// Navigation setup (https://reactnavigation.org/docs very useful)
const Stack = createNativeStackNavigator();

// Main function
const App = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            {/* Lots of header options, will eventually use them to build custom header */}
            {/* Home screen */}
            <Stack.Screen name="Home" options={{title: "Home"}}> 
                {(props) => <Homescreen {...props}/>}
            </Stack.Screen>

            {/* Scouting screen */}
            <Stack.Screen name="ScoutTeam" options={{title: "Scout Team"}}>
                {(props) => <ScoutTeam {...props}/>}
            </Stack.Screen>

            {/* Scouting screen */}
            <Stack.Screen name="LocalData" options={{title: "Local Data"}}>
                {(props) => <LocalData {...props}/>}
            </Stack.Screen>

            {/* Scouting screen */}
            <Stack.Screen name="CloudData" options={{title: "Cloud Data"}}>
                {(props) => <CloudData {...props}/>}
            </Stack.Screen>

            {/* Scouting screen */}
            <Stack.Screen name="Settings" options={{title: "Settings"}}>
                {(props) => <Settings {...props}/>}
            </Stack.Screen>

        </Stack.Navigator>
    </NavigationContainer>
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
});

// Exports
export default App;