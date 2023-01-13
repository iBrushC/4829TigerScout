// Library imports
import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
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
        await saveMatchData(matchData);

        navigation.navigate("Home");
    };

    const loadSavedData = (data) => {
        console.log(data);
        // Pre Round
        setTeamNumber(data[0].toString());
        setMatchNumber(data[1].toString());
        setMatchType(matchTypeValues[data[2]]);
        setTeamColor(teamColorValues[data[3]]);

        // Auto
        setTaxi(data[4] ? true : false);
        setAutoDocked(data[5] ? true : false);
        setAutoEngaged(data[6] ? true : false);
        setAutoHigh(data[7].toString());
        setAutoMid(data[8].toString());
        setAutoLow(data[9].toString());
        setAutoMisses(data[10].toString());

        // Teleop
        setTeleHigh(data[11].toString());
        setTeleMid(data[12].toString());
        setTeleLow(data[13].toString());
        setTeleMisses(data[14].toString());
        setTeleDocked(data[15] ? true : false);
        setTeleEngaged(data[16] ? true : false);

        // After Round
        setComments(data[17]);
    }

    React.useEffect(() => {
        if (route?.params?.dataKey) {
            loadMatchData(route.params.dataKey)
                .then(loadSavedData)
                .catch(e => {console.error(`There was an error loading match data: ${e}`)});
        }
    }, [])

    const scrollRef = React.useRef(null);

    return (
        <View style={globalConatinerStyles.topContainer}>
            <LinearGradient
                colors={['#2A3638F0', '#3E474321']}
                style={globalConatinerStyles.fullscreenBackground}
            />

            {/* All scouting settings go in the scroll view */}
            <KeyboardAvoidingView style={{flex: 1}} behavior="height">
            <ScrollView keyboardShouldPersistTaps='handled' ref={scrollRef}>
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
                
                {/* 
                
                AUTO 
                
                */}
                <View style={{width: "100%", alignItems: "center", height: 60*vh}}>
                    <LinearGradient
                        colors={['#EEFFFA35', '#00000000']}
                        style={{...globalConatinerStyles.viewBackground, borderTopLeftRadius: 10, borderTopRightRadius: 10}}
                    />

                    {/* Might also make title a block (?) */}
                    <Text style={{...globalTextStyles.primaryText, fontSize: 24, margin: 15}}>Auto</Text>
                    
                    {/* Row of all components */}
                    <View style={{...globalConatinerStyles.rowContainer, alignContent: "center", justifyContent: "center", paddingLeft: 15, paddingRight: 15, flexGrow: 0.7}}>
                        {/* Button Counters */}
                        <View style={{...globalConatinerStyles.columnContainer, justifyContent: "center", alignContent: "center"}}>
                            <Text style={{...globalTextStyles.labelText, fontSize: 20, alignSelf: "center", position: "absolute", top: 0}}>High</Text>
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

                        <View style={{...globalConatinerStyles.columnContainer, justifyContent: "center"}}>
                            <Text style={{...globalTextStyles.labelText, fontSize: 20, alignSelf: "center", position: "absolute", top: 0}}>Middle</Text>
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

                        <View style={{...globalConatinerStyles.columnContainer, justifyContent: "center"}}>
                            <Text style={{...globalTextStyles.labelText, fontSize: 20, alignSelf: "center", position: "absolute", top: 0}}>Low</Text>
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

                        <View style={{...globalConatinerStyles.columnContainer, justifyContent: "center"}}>
                            <Text style={{...globalTextStyles.labelText, fontSize: 20, alignSelf: "center", position: "absolute", top: 0}}>Misses</Text>
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
                    <View style={{...globalConatinerStyles.rowContainer, alignContent: "center", justifyContent: "center", paddingLeft: 15, paddingRight: 15, flexGrow: 0.3}}>
                        {/* Taxi */}
                        <TTSimpleCheckbox 
                                state={taxi}
                                setState={setTaxi}
                                text="Taxi?" 
                                overallStyle={{height: "100%", alignSelf: "center"}}
                                textStyle={{...globalTextStyles.labelText, fontSize: 14}}
                                boxUncheckedStyle={{width: 7*vw, height: 7*vw, margin: "5%", backgroundColor: "#FFFFFF10", borderWidth: 3, borderRadius: 3, borderColor: "white"}}
                                boxCheckedStyle={{width: 7*vw, height: 7*vw, margin: "5%", backgroundColor: "#D07E32", borderWidth: 3, borderRadius: 3, borderColor: "white"}}
                            />
                        {/* Docked */}
                        <TTSimpleCheckbox 
                                state={autoDocked}
                                setState={setAutoDocked}
                                text="Docked?" 
                                overallStyle={{height: "100%", alignSelf: "center"}}
                                textStyle={{...globalTextStyles.labelText, fontSize: 14}}
                                boxUncheckedStyle={{width: 7*vw, height: 7*vw, margin: "5%", backgroundColor: "#FFFFFF10", borderWidth: 3, borderRadius: 3, borderColor: "white"}}
                                boxCheckedStyle={{width: 7*vw, height: 7*vw, margin: "5%", backgroundColor: "#D07E32", borderWidth: 3, borderRadius: 3, borderColor: "white"}}
                            />
                        {/* Engaged */}
                        <TTSimpleCheckbox 
                                state={autoEngaged}
                                setState={setAutoEngaged}
                                text="Engaged?" 
                                overallStyle={{height: "100%", alignSelf: "center"}}
                                textStyle={{...globalTextStyles.labelText, fontSize: 14}}
                                boxUncheckedStyle={{width: 7*vw, height: 7*vw, margin: "5%", backgroundColor: "#FFFFFF10", borderWidth: 3, borderRadius: 3, borderColor: "white"}}
                                boxCheckedStyle={{width: 7*vw, height: 7*vw, margin: "5%", backgroundColor: "#D07E32", borderWidth: 3, borderRadius: 3, borderColor: "white"}}
                            />
                    </View>
                </View>

                {/* Rudamentary spacer */}
                <View style={{marginBottom: "5%"}}/> 
                
                {/* 
                
                TELEOP 
                
                */}
                <View style={{width: "100%", alignItems: "center", height: 50*vh}}>
                    <LinearGradient
                        colors={['#EEFFFA35', '#00000000']}
                        style={{...globalConatinerStyles.viewBackground, borderTopLeftRadius: 10, borderTopRightRadius: 10}}
                    />

                    <Text style={{...globalTextStyles.primaryText, fontSize: 24, margin: 15}}>Teleop</Text>
                    
                    <View style={{...globalConatinerStyles.rowContainer, alignContent: "center", justifyContent: "center", paddingLeft: 15, paddingRight: 15,}}>
                        {/* Button Counters */}
                        <View style={{...globalConatinerStyles.columnContainer, justifyContent: "center"}}>
                            <Text style={{...globalTextStyles.labelText, fontSize: 20, alignSelf: "center", position: "absolute", top: 0}}>High</Text>
                            {/* Have got to find a better system than this */}
                            <TTCounterInput
                                state={teleHigh}
                                setState={setTeleHigh}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center"}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>

                        <View style={{...globalConatinerStyles.columnContainer, justifyContent: "center"}}>
                            <Text style={{...globalTextStyles.labelText, fontSize: 20, alignSelf: "center", position: "absolute", top: 0}}>Middle</Text>
                            {/* Have got to find a better system than this */}
                            <TTCounterInput
                                state={teleMid}
                                setState={setTeleMid}
                                stateMin={0}
                                stateMax={255}
                                overallStyle={{justifySelf: "center"}}
                                topButtonProps={{text: "+", buttonStyle: [globalButtonStyles.topCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                                inputProps={{style: [globalInputStyles.numberInput, globalTextStyles.labelText, {width: "80%", height: "25%", margin: 0}]}}
                                bottomButtonProps={{text: "-", buttonStyle: [globalButtonStyles.bottomCounterButton, {height: 60, padding: 0}], textStyle: globalTextStyles.primaryText}}
                            />
                        </View>

                        <View style={{...globalConatinerStyles.columnContainer, justifyContent: "center"}}>
                            <Text style={{...globalTextStyles.labelText, fontSize: 20, alignSelf: "center", position: "absolute", top: 0}}>Low</Text>
                            {/* Have got to find a better system than this */}
                            <TTCounterInput
                                state={teleLow}
                                setState={setTeleLow}
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
                                state={teleMisses}
                                setState={setTeleMisses}
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

                {/* Rudamentary spacer */}
                <View style={{marginBottom: "5%"}}/> 
                
                {/* 
                
                ENDGAME 
                
                */}
                <View style={{width: "100%", alignItems: "center", height: 50*vh}}>
                    <LinearGradient
                        colors={['#EEFFFA35', '#00000000']}
                        style={{...globalConatinerStyles.viewBackground, borderTopLeftRadius: 10, borderTopRightRadius: 10}}
                    />

                    <Text style={{...globalTextStyles.primaryText, fontSize: 24, margin: 15}}>Endgame</Text>
                    
                    <View style={{...globalConatinerStyles.rowContainer, alignContent: "center", justifyContent: "center", paddingLeft: 15, paddingRight: 15, flexGrow: 0.3}}>
                        <TTSimpleCheckbox 
                                state={teleDocked}
                                setState={setTeleDocked}
                                text="Docked?" 
                                overallStyle={{height: "100%", alignSelf: "center"}}
                                textStyle={{...globalTextStyles.labelText}}
                                boxUncheckedStyle={{width: 7*vw, height: 7*vw, margin: "5%", backgroundColor: "#FFFFFF10", borderWidth: 3, borderRadius: 3, borderColor: "white"}}
                                boxCheckedStyle={{width: 7*vw, height: 7*vw, margin: "5%", backgroundColor: "#D07E32", borderWidth: 3, borderRadius: 3, borderColor: "white"}}
                            />
                        <TTSimpleCheckbox 
                                state={teleEngaged}
                                setState={setTeleEngaged}
                                text="Engaged?" 
                                overallStyle={{height: "100%", alignSelf: "center"}}
                                textStyle={{...globalTextStyles.labelText}}
                                boxUncheckedStyle={{width: 7*vw, height: 7*vw, margin: "5%", backgroundColor: "#FFFFFF10", borderWidth: 3, borderRadius: 3, borderColor: "white"}}
                                boxCheckedStyle={{width: 7*vw, height: 7*vw, margin: "5%", backgroundColor: "#D07E32", borderWidth: 3, borderRadius: 3, borderColor: "white"}}
                            />
                    </View>
                    <View style={{...globalConatinerStyles.rowContainer, alignContent: "center", justifyContent: "center", paddingLeft: 15, paddingRight: 15,}}>
                        <TTTextInput
                                state={comments}
                                setState={setComments}
                                placeholder="Comments (25 characters)"
                                placeholderTextColor="#FFFFFF50"
                                multiline={true}
                                maxLength={25}
                                numberOfLines={4}
                                onFocus={() => {scrollRef.current.scrollToEnd()}}
                                style={[
                                    {...globalInputStyles.numberInput, width: "90%", height: "90%"},
                                    {fontFamily: "Bebas", fontSize: 24, color: "#FFFFFF"}
                                ]}
                            />
                    </View>
                </View>
                
                <View style={{...globalConatinerStyles.centerContainer, backgroundColor: "#00000000"}}>
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