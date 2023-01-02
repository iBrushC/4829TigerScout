// Library imports
import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Component imports
import { vh, vw } from '../../common/Constants';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalConatinerStyles } from '../../common/GlobalStyleSheet';
import { TTButton, TTCheckbox, TTPushButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { TTCounterInput, TTDropdown, TTNumberInput, TTTextInput } from '../components/InputComponents';
import { serializeData, deserializeData, compressData, decompressData, saveMatchData, loadMatchData } from '../../common/LocalStorage'

// Main function
const ScoutTeam = ({route, navigation}) => {
    const matchTypeValues = ["Practice", "Qualifiers", "Finals"];
    const teamColorValues = ["Red", "Blue"]

    const [teamNumber, setTeamNumber] = React.useState("");
    const [matchNumber, setMatchNumber] = React.useState("");
    const [matchType, setMatchType] = React.useState("Match Type");
    const [teamColor, setTeamColor] = React.useState("Team Color");
    const [taxi, setTaxi] = React.useState(false);
    const [autoScores, setAutoScores] = React.useState("0");
    const [autoMisses, setAutoMisses] = React.useState("0");
    const [goalScores, setGoalScores] = React.useState("0");
    const [goalMisses, setGoalMisses] = React.useState("0");

    // Prevents nothing entries
    const formatNumericState = (state) => {
        return ((state != "") ? Number(state) : 0);
    }

    // Serializes the data to a string and saves it
    const saveAndExit = () => {
        console.log(`Taxi: ${taxi}`);
        const matchData = [
            formatNumericState(teamNumber), // Team number
            formatNumericState(matchNumber), // Match number
            matchType != "Match Type" ? matchTypeValues.indexOf(matchType) : 1, // Match type
            teamColor != "Team Color" ? teamColorValues.indexOf(teamColor) : 0, // Team Color
            taxi ? 1 : 0, // Taxi
            formatNumericState(autoScores),
            formatNumericState(autoMisses),
            formatNumericState(goalScores),
            formatNumericState(goalMisses),
        ];

        // Save data using hash
        saveMatchData(matchData);

        navigation.navigate("Home");
    };

    const loadSavedData = (data) => {
        setTeamNumber(data[0].toString());
        setMatchNumber(data[1].toString());
        setMatchType(matchTypeValues[data[2]]);
        setTeamColor(teamColorValues[data[3]]);
        setTaxi(data[4] ? true : false);
        setAutoScores(data[5].toString());
        setAutoMisses(data[6].toString());
        setGoalScores(data[7].toString());
        setGoalMisses(data[8].toString());
    }

    React.useEffect(() => {
        if (route?.params?.dataKey) {
            loadMatchData(route.params.dataKey)
                .then(loadSavedData)
                .catch(e => {console.error(e)});
        }
    }, [])

    return (
        <View style={globalConatinerStyles.topContainer}>
            <LinearGradient
                colors={['#2A3638F0', '#3E474321']}
                style={globalConatinerStyles.fullscreenBackground}
            />

            {/* All scouting settings go in the scroll view */}
            <ScrollView keyboardShouldPersistTaps='handled'>
                <Text style={{...globalTextStyles.primaryText, fontSize: 24, marginTop: "7%", marginBottom: "2%", alignSelf: "center"}}>Pre-Round</Text>

                <View style={{...globalConatinerStyles.rowContainer, alignItems: "center", justifyContent: "center", zIndex: 6}}>
                    {/* Team number */}
                    <TTNumberInput
                        state={teamNumber}
                        setState={setTeamNumber}
                        stateMax={9999}
                        maxLength={4}
                        placeholder="Team Number"
                        placeholderTextColor="#FFFFFF50"
                        style={[
                            {...globalInputStyles.numberInput, width: "45%", height: 50},
                            {fontFamily: "Bebas", fontSize: 24, color: "#FFFFFF"}
                        ]}
                    />
                    {/* Team Color */}
                    <TTDropdown 
                        state={teamColor} 
                        setState={setTeamColor} 
                        items={teamColorValues}
                        boxWidth={150}
                        boxHeight={50}
                        boxStyle={globalInputStyles.dropdownInput}
                        textStyle={globalTextStyles.labelText}
                        overrideStyle={{margin: 10}}
                        zIndex={5}
                    />
                </View>

                {/* Match type and number */}
                <View style={{...globalConatinerStyles.rowContainer, alignItems: "center", justifyContent: "center", zIndex: 5}}>
                    <TTDropdown 
                        state={matchType} 
                        setState={setMatchType} 
                        items={matchTypeValues}
                        boxWidth={150}
                        boxHeight={50}
                        boxStyle={globalInputStyles.dropdownInput}
                        textStyle={globalTextStyles.labelText}
                        overrideStyle={{margin: 10}}
                        zIndex={5}
                    />
                    <TTNumberInput
                        state={matchNumber}
                        setState={setMatchNumber}
                        maxLength={3}
                        placeholder="Match Number"
                        placeholderTextColor="#FFFFFF50"
                        style={[
                            {...globalInputStyles.numberInput, width: "45%", height: 50},
                            globalTextStyles.labelText
                        ]}
                    />
                </View>
                
                {/* Rudamentary spacer */}
                <View style={{marginBottom: "5%"}}/> 
                
                {/* Should probably make GradientView a block */}
                <View style={{width: "100%", alignItems: "center", height: 350}}>
                    <LinearGradient
                        colors={['#EEFFFA35', '#00000000']}
                        style={{...globalConatinerStyles.viewBackground, borderTopLeftRadius: 10, borderTopRightRadius: 10}}
                    />

                    {/* Might also make title a block (?) */}
                    <Text style={{...globalTextStyles.primaryText, fontSize: 24, margin: 15}}>Auto</Text>
                    
                    {/* Row of all components */}
                    <View style={{...globalConatinerStyles.rowContainer, alignContent: "center", justifyContent: "center", paddingLeft: 15, paddingRight: 15,}}>
                        {/* Button Counters */}
                        <View style={{...globalConatinerStyles.columnContainer, justifyContent: "center"}}>
                            <Text style={{...globalTextStyles.labelText, fontSize: 20, alignSelf: "center", position: "absolute", top: 0}}>Scores</Text>
                            {/* Have got to find a better system than this */}
                            <TTCounterInput
                                state={autoScores}
                                setState={setAutoScores}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center"}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>

                        <View style={{...globalConatinerStyles.columnContainer, justifyContent: "center"}}>
                            <Text style={{...globalTextStyles.labelText, fontSize: 20, alignSelf: "center", position: "absolute", top: 0}}>Misses</Text>
                            <TTCounterInput
                                state={autoMisses}
                                setState={setAutoMisses}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center"}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>

                        <TTSimpleCheckbox 
                            state={taxi}
                            setState={setTaxi}
                            text="Taxi?" 
                            overallStyle={{height: "10%", alignSelf: "center"}}
                            textStyle={globalTextStyles.labelText}
                            boxUncheckedStyle={{width: 7*vw, height: 7*vw, margin: "5%", backgroundColor: "#FFFFFF10", borderWidth: 3, borderRadius: 3, borderColor: "white"}}
                            boxCheckedStyle={{width: 7*vw, height: 7*vw, margin: "5%", backgroundColor: "#D07E32", borderWidth: 3, borderRadius: 3, borderColor: "white"}}
                        />
                    </View>
                </View>

                <View style={{width: "100%", alignItems: "center", height: 350}}>
                    <LinearGradient
                        colors={['#EEFFFA35', '#00000000']}
                        style={{...globalConatinerStyles.viewBackground, borderTopLeftRadius: 10, borderTopRightRadius: 10}}
                    />

                    <Text style={{...globalTextStyles.primaryText, fontSize: 24, margin: 15}}>Teleop</Text>
                    
                    <View style={{...globalConatinerStyles.rowContainer, alignContent: "center", justifyContent: "center", paddingLeft: 15, paddingRight: 15,}}>
                        {/* Button Counters */}
                        <View style={{...globalConatinerStyles.columnContainer, justifyContent: "center"}}>
                            <Text style={{...globalTextStyles.labelText, fontSize: 20, alignSelf: "center", position: "absolute", top: 0}}>Scores</Text>
                            {/* Have got to find a better system than this */}
                            <TTCounterInput
                                state={goalScores}
                                setState={setGoalScores}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center"}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>

                        <View style={{...globalConatinerStyles.columnContainer, justifyContent: "center"}}>
                            <Text style={{...globalTextStyles.labelText, fontSize: 20, alignSelf: "center", position: "absolute", top: 0}}>Misses</Text>
                            <TTCounterInput
                                state={goalMisses}
                                setState={setGoalMisses}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center"}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>
                    </View>
                    
                </View>

                <View style={{...globalConatinerStyles.centerContainer, backgroundColor: "#00000000"}}>
                    <TTButton
                        text="Save Data"
                        buttonStyle={{...globalButtonStyles.primaryButton, width: "90%", margin: 5 * vh}}
                        textStyle={{...globalTextStyles.primaryText, fontSize: 36}}
                        onPress={saveAndExit}
                    />
                </View>

                {/* Gradient View */}
            </ScrollView>
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
});

// Exports
export default ScoutTeam;