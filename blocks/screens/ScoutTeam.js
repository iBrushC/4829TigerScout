// Library imports
import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Component imports
import { vh, vw } from '../../common/Constants';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalContainerStyles } from '../../common/GlobalStyleSheet';
import { TTButton, TTCheckbox, TTPushButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { TTCounterInput, TTDropdown, TTNumberInput, TTTextInput } from '../components/InputComponents';
import { serializeData, deserializeData, compressData, decompressData, saveMatchData, loadMatchData } from '../../common/LocalStorage'
import { TTGradient } from '../components/ExtraComponents';
import { ColorScheme as CS } from '../../common/ColorScheme';

const matchTypeValues = ["Practice", "Qualifiers", "Finals"];
const teamColorValues = ["Red", "Blue"]

// Main function
const ScoutTeam = ({route, navigation}) => {
    // Might be good to make some of these into arrays
    
    const [teamNumber, setTeamNumber] = React.useState("");
    const [matchNumber, setMatchNumber] = React.useState("");
    const [matchType, setMatchType] = React.useState("Match Type");
    const [teamColor, setTeamColor] = React.useState("Team Color");

    const [taxi, setTaxi] = React.useState(false);
    const [autoDocked, setAutoDocked] = React.useState(false);
    const [autoEngaged, setAutoEngaged] = React.useState(false);
    const [autoHigh, setAutoHigh] = React.useState("0");
    const [autoMid, setAutoMid] = React.useState("0");
    const [autoLow, setAutoLow] = React.useState("0");
    const [autoMisses, setAutoMisses] = React.useState("0");

    const [teleHigh, setTeleHigh] = React.useState("0");
    const [teleMid, setTeleMid] = React.useState("0");
    const [teleLow, setTeleLow] = React.useState("0");
    const [teleMisses, setTeleMisses] = React.useState("0");
    
    const [teleDocked, setTeleDocked] = React.useState(false);
    const [teleEngaged, setTeleEngaged] = React.useState(false);
    const [comments, setComments] = React.useState("");

    // Prevents nothing entries
    const formatNumericState = (state) => {
        return ((state != "") ? Number(state) : 0);
    }

    // Serializes the data to a string and saves it
    const saveAndExit = async () => {
        const matchData = [
            // Pre Round
            formatNumericState(teamNumber), 
            formatNumericState(matchNumber),
            matchType != "Match Type" ? matchTypeValues.indexOf(matchType) : 1, 
            teamColor != "Team Color" ? teamColorValues.indexOf(teamColor) : 0, 

            // Auto
            taxi ? 1 : 0,
            autoDocked ? 1 : 0,
            autoEngaged ? 1 : 0,
            formatNumericState(autoHigh),
            formatNumericState(autoMid),
            formatNumericState(autoLow),
            formatNumericState(autoMisses),

            // Teleop
            formatNumericState(teleHigh),
            formatNumericState(teleMid),
            formatNumericState(teleLow),
            formatNumericState(teleMisses),
            teleDocked ? 1 : 0,
            teleEngaged ? 1 : 0,

            // After Round
            comments,
        ];

        // Save data using hash
        try {
            await saveMatchData(matchData)
            navigation.navigate("Home");
        } catch (e) {
            console.error(`Error Saving Data: ${e}`);
        }
    };

    const loadSavedData = (data) => {
        // Pre Round
        setTeamNumber(data[0]);
        setMatchNumber(data[1]);
        setMatchType(matchTypeValues[data[2]]);
        setTeamColor(teamColorValues[data[3]]);

        // Auto
        setTaxi(Number(data[4]) ? true : false);
        setAutoDocked(Number(data[5]) ? true : false);
        setAutoEngaged(Number(data[6]) ? true : false);
        setAutoHigh(data[7]);
        setAutoMid(data[8]);
        setAutoLow(data[9]);
        setAutoMisses(data[10]);

        // Teleop
        setTeleHigh(data[11]);
        setTeleMid(data[12]);
        setTeleLow(data[13]);
        setTeleMisses(data[14]);
        setTeleDocked(Number(data[15]) ? true : false);
        setTeleEngaged(Number(data[16]) ? true : false);

        // After Round
        setComments(data[17]);
    }

    React.useEffect(() => {
        if (route?.params?.matchData) {
            loadSavedData(route.params.matchData);
        }
    }, [])

    const scrollRef = React.useRef(null);

    return (
        <View style={globalContainerStyles.topContainer}>
        <TTGradient/>

            {/* All scouting settings go in the scroll view */}
            <KeyboardAvoidingView style={{flex: 1}} behavior="height">
            <ScrollView keyboardShouldPersistTaps='handled' ref={scrollRef}>
                <View style={{height: 35*vh, zIndex: 1}}>
                    <Text style={styles.sectionHeader}>Pre-Round</Text>

                    <View style={{...styles.rowAlignContainer, zIndex: 6}}>
                        {/* Team number */}
                        <TTNumberInput
                            state={teamNumber}
                            setState={setTeamNumber}
                            stateMax={9999}
                            maxLength={4}
                            placeholder="Team Number"
                            placeholderTextColor={`${CS.light1}50`}
                            style={styles.topNumberInput}
                        />
                        {/* Team Color */}
                        <TTDropdown 
                            state={teamColor} 
                            setState={setTeamColor} 
                            items={teamColorValues}
                            boxWidth={40*vw}
                            boxHeight={8.1*vh}
                            boxStyle={globalInputStyles.dropdownInput}
                            textStyle={globalTextStyles.labelText}
                        />
                    </View>

                    {/* Match type and number */}
                    <View style={{...styles.rowAlignContainer, zIndex: 5}}>
                        <TTDropdown 
                            state={matchType} 
                            setState={setMatchType} 
                            items={matchTypeValues}
                            boxWidth={40*vw}
                            boxHeight={8.1*vh}
                            boxStyle={globalInputStyles.dropdownInput}
                            textStyle={globalTextStyles.labelText}
                            zIndex={5}
                        />
                        <TTNumberInput
                            state={matchNumber}
                            setState={setMatchNumber}
                            maxLength={3}
                            placeholder="Match Number"
                            placeholderTextColor={`${CS.light1}50`}
                            style={styles.topNumberInput}
                        />
                    </View>
                    
                    {/* Rudamentary spacer */}
                    <View style={{marginBottom: 5*vh}}/> 
                </View>

                {/* 
                
                AUTO 
                
                */}
                <View style={{height: 60*vh}}>
                    <TTGradient/>

                    {/* Might also make title a block (?) */}
                    <Text style={styles.sectionHeader}>Auto</Text>
                    
                    {/* Row of all components */}
                    <View style={{...styles.rowAlignContainer, flexGrow: 0.7}}>
                        {/* Button Counters */}
                        <View style={globalContainerStyles.columnContainer}>
                            <Text style={styles.counterHeader}>High</Text>
                            {/* Have got to find a better system than this */}
                            <TTCounterInput
                                state={autoHigh}
                                setState={setAutoHigh}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center", marginTop: 7*vh}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>

                        <View style={globalContainerStyles.columnContainer}>
                            <Text style={styles.counterHeader}>Middle</Text>
                            {/* Have got to find a better system than this */}
                            <TTCounterInput
                                state={autoMid}
                                setState={setAutoMid}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center", marginTop: 7*vh}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>

                        <View style={globalContainerStyles.columnContainer}>
                            <Text style={styles.counterHeader}>Low</Text>
                            {/* Have got to find a better system than this */}
                            <TTCounterInput
                                state={autoLow}
                                setState={setAutoLow}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center", marginTop: 7*vh}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>

                        <View style={globalContainerStyles.columnContainer}>
                            <Text style={styles.counterHeader}>Misses</Text>
                            <TTCounterInput
                                state={autoMisses}
                                setState={setAutoMisses}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center", marginTop: 7*vh}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>
                    </View>
                    <View style={{...styles.rowAlignContainer, flexGrow: 0.3}}>
                        {/* Taxi */}
                        <TTSimpleCheckbox 
                            state={taxi}
                            setState={setTaxi}
                            text="Taxi?" 
                            overallStyle={{height: "100%", alignSelf: "center"}}
                            textStyle={{...globalTextStyles.labelText, fontSize: 14}}
                            boxUncheckedStyle={{...globalButtonStyles.checkboxUncheckedStyle}}
                            boxCheckedStyle={{...globalButtonStyles.checkboxCheckedStyle}}
                        />
                        {/* Docked */}
                        <TTSimpleCheckbox 
                            state={autoDocked}
                            setState={setAutoDocked}
                            text="Docked?" 
                            overallStyle={{height: "100%", alignSelf: "center"}}
                            textStyle={{...globalTextStyles.labelText, fontSize: 14}}
                            boxUncheckedStyle={{...globalButtonStyles.checkboxUncheckedStyle}}
                            boxCheckedStyle={{...globalButtonStyles.checkboxCheckedStyle}}
                        />
                        {/* Engaged */}
                        <TTSimpleCheckbox 
                            state={autoEngaged}
                            setState={setAutoEngaged}
                            text="Engaged?" 
                            overallStyle={{height: "100%", alignSelf: "center"}}
                            textStyle={{...globalTextStyles.labelText, fontSize: 14}}
                            boxUncheckedStyle={{...globalButtonStyles.checkboxUncheckedStyle}}
                            boxCheckedStyle={{...globalButtonStyles.checkboxCheckedStyle}}
                        />
                    </View>
                    <View style={{marginBottom: 2*vh}}/> 
                </View>

                {/* 
                
                TELEOP 
                
                */}
                <View style={{height: 55*vh}}>
                    <TTGradient/>

                    <Text style={styles.sectionHeader}>Teleop</Text>
                    
                    <View style={styles.rowAlignContainer}>
                        {/* Button Counters */}
                        <View style={globalContainerStyles.columnContainer}>
                            <Text style={styles.counterHeader}>High</Text>
                            {/* Have got to find a better system than this */}
                            <TTCounterInput
                                state={teleHigh}
                                setState={setTeleHigh}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center", marginTop: 7*vh}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>

                        <View style={globalContainerStyles.columnContainer}>
                            <Text style={styles.counterHeader}>Middle</Text>
                            {/* Have got to find a better system than this */}
                            <TTCounterInput
                                state={teleMid}
                                setState={setTeleMid}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center", marginTop: 7*vh}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>

                        <View style={globalContainerStyles.columnContainer}>
                            <Text style={styles.counterHeader}>Low</Text>
                            {/* Have got to find a better system than this */}
                            <TTCounterInput
                                state={teleLow}
                                setState={setTeleLow}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center", marginTop: 7*vh}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>

                        <View style={globalContainerStyles.columnContainer}>
                            <Text style={styles.counterHeader}>Misses</Text>
                            <TTCounterInput
                                state={teleMisses}
                                setState={setTeleMisses}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center", marginTop: 7*vh}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>
                    </View>
                </View>
                
                {/* 
                
                ENDGAME 
                
                */}
                <View style={{height: 50*vh}}>
                    <TTGradient/>

                    <Text style={styles.sectionHeader}>Endgame</Text>
                    
                    <View style={{...styles.rowAlignContainer, flexGrow: 0.3}}>
                        <TTSimpleCheckbox 
                            state={teleDocked}
                            setState={setTeleDocked}
                            text="Docked?" 
                            overallStyle={{height: "100%", alignSelf: "center"}}
                            textStyle={{...globalTextStyles.labelText}}
                            boxUncheckedStyle={{...globalButtonStyles.checkboxUncheckedStyle}}
                            boxCheckedStyle={{...globalButtonStyles.checkboxCheckedStyle}}
                        />
                        <TTSimpleCheckbox 
                            state={teleEngaged}
                            setState={setTeleEngaged}
                            text="Engaged?" 
                            overallStyle={{height: "100%", alignSelf: "center"}}
                            textStyle={{...globalTextStyles.labelText}}
                            boxUncheckedStyle={{...globalButtonStyles.checkboxUncheckedStyle}}
                            boxCheckedStyle={{...globalButtonStyles.checkboxCheckedStyle}}
                        />
                    </View>
                    <View style={styles.rowAlignContainer}>
                        <TTTextInput
                            state={comments}
                            setState={setComments}
                            placeholder="Comments (50 characters)"
                            placeholderTextColor={`${CS.light1}50`}
                            multiline={true}
                            maxLength={50}
                            numberOfLines={4}
                            onFocus={() => {scrollRef.current.scrollToEnd()}}
                            style={[
                                {...globalInputStyles.numberInput, width: "90%", height: "90%"},
                                globalTextStyles.labelText
                            ]}
                        />
                    </View>

                    {/* Rudamentary spacer */}
                    <View style={{marginBottom: 5*vh}}/> 
                </View>
                
                <View style={{...globalContainerStyles.centerContainer, backgroundColor: "#00000000"}}>
                    <TTButton
                        text="Save Data"
                        buttonStyle={{...globalButtonStyles.primaryButton, width: "90%", margin: 5*vh}}
                        textStyle={{...globalTextStyles.primaryText, fontSize: 36}}
                        onPress={saveAndExit}
                    />
                </View>

            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// !! TODO !! REPLACE ALL MASSIVE INLINE STYLES WITH A STYLESHEET
const styles = StyleSheet.create({
    sectionHeader: {
        ...globalTextStyles.primaryText, 
        fontSize: 24, 
        margin: 3*vh
    },
    topNumberInput: {
        ...globalInputStyles.numberInput, 
        ...globalTextStyles.labelText,
        margin: 0,
        width: 45*vw, 
        height: 8*vh,
    },
    rowAlignContainer: {
        ...globalContainerStyles.rowContainer, 
        width: "100%", 
        alignItems: "center", 
        justifyContent: "space-evenly",
    },
    counterHeader: {
        ...globalTextStyles.labelText, 
        fontSize: 20, 
        alignSelf: "center", 
        position: "absolute", 
        top: 0
    }
});

// Exports
export default ScoutTeam;

export { matchTypeValues, teamColorValues };