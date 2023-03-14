// Library imports
import * as React from 'react';
import { getStorage } from 'firebase/storage';
import { getApp, getApps } from "firebase/app";
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

// Component imports
import { vh, vw, fU } from '../../common/Constants';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalContainerStyles } from '../../common/GlobalStyleSheet';
import { readStringFromCloud, initializeFirebaseFromSettings, getAllFilesFromCloud, downloadAllFilesFromCloud, uploadMultipleStringsToCloud } from '../../common/CloudStorage';
import { TTButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { TTGradient, TTLoading } from '../components/ExtraComponents';
import { loadCloudCache, loadSettings, saveCloudCache } from '../../common/LocalStorage';
import { ColorScheme as CS } from '../../common/ColorScheme';
import { TTDropdown } from '../components/InputComponents';

const sortableValues = ["Team Number", "Auto Points", "Teleop Points", "Misses", "Cubes", "Cones", "Docking"];
const sortableKeys = [null, "auto", "teleop", "misses", "cubes", "cones", "docking"];

// Main function
const CloudData = ({route, navigation}) => {
    // Settings
    const [settings, setSettings] = React.useState(null);

    // Loading states
    const [loadingVisible, setLoadingVisible] = React.useState(false);
    const [loadingContent, setLoadingContent] = React.useState([]);

    // Loaded cloud data
    const [cloudData, setCloudData] = React.useState([]);
    const [statistics, setStatistics] = React.useState([]);
    const [teamOrder, setTeamOrder] = React.useState([]);

    // Normal states
    const [sortBy, setSortBy] = React.useState(sortableValues[0]);
    const [reverseSort, setReverseSort] = React.useState(false);

    // Calculates average statistics
    const calculateAverages = (teamData) => {
        const teamAverages = {};
        // Loop over every team
        for (const teamNumber of Object.keys(teamData)) {
            const averages = { auto: 0, teleop: 0, misses: 0, cubes: 0, cones: 0, docking: 0 };
            const count = teamData[teamNumber].length;
            // For every md (match data), add to the average for each stat
            for (const md of teamData[teamNumber]) {
                // This is horrible
                averages.auto += 6*(Number(md[7])+Number(md[10])) + 4*(Number(md[8])+Number(md[11]))+ 3*(Number(md[9])+Number(md[12]));
                averages.teleop += 5*(Number(md[14])+Number(md[17])) + 3*(Number(md[15])+Number(md[18]))+ 2*(Number(md[16])+Number(md[19]));
                averages.misses += Number(md[13]) + Number(md[20]);
                averages.cubes += Number(md[7])+Number(md[8])+Number(md[9]) + Number(md[14])+Number(md[15])+Number(md[16]);
                averages.cones += Number(md[10])+Number(md[11])+Number(md[12]) + Number(md[17])+Number(md[18])+Number(md[19]);
                averages.docking += 8*Number(md[5]) + 4*Number(md[6]) + 6*Number(md[21]) + 4*Number(md[22]);
            }
            // Average out and round
            averages.auto = Math.round(10*averages.auto / count) / 10;
            averages.teleop = Math.round(10*averages.teleop / count) / 10;
            averages.misses = Math.round(10*averages.misses / count) / 10;
            averages.cubes = Math.round(10*averages.cubes / count) / 10;
            averages.cones = Math.round(10*averages.cones / count) / 10;
            averages.docking = Math.round(10*averages.docking / count) / 10;

            teamAverages[teamNumber] = averages;
        }
        return teamAverages;
    }

    // Sorts an object by key values of another object
    // Ultra specified to work just for sorting by staistics
    const getSortedObjectOrder = (baseObject, valuesObject, sortKey, reverse) => {
        const objectKeys = Object.keys(baseObject);
        if (sortKey === null) {
            return reverse ? objectKeys.reverse() : objectKeys;
        }

        const compareFunction = (a, b) => {
            return valuesObject[a][sortKey] <= valuesObject[b][sortKey];
        }

        const sortedKeys = objectKeys.sort((a, b) => compareFunction(reverse ? b : a, reverse ? a : b));
        return sortedKeys;
    }

    const sortMatches = (teamData) => {
        const compareFunction = (a, b) => {
            return (
                Number(a[2]) * 300 + Number(a[1]) >
                Number(b[2]) * 300 + Number(b[1])
            )
        }
        return teamData.sort(compareFunction);
    }

    // Initial loading
    React.useEffect(() => {
        setLoadingContent([null, "Loading local cache..."]);

        const wrapper = async () => {
            const loadedSettings = await loadSettings();
            setSettings(loadedSettings);

            const loadedCache = await loadCloudCache();
            if (loadedCache !== null) {
                setCloudData(loadedCache);
                setTeamOrder(Object.keys(loadedCache));
                setStatistics(calculateAverages(loadedCache));
            }
        };
        
        initializeFirebaseFromSettings();
        wrapper();
    }, []);

    const downloadAndStoreCloudData = async () => {
        setLoadingContent([null, "Downloading all cloud files to device..."]);
        setLoadingVisible(true);

        const storage = getStorage();
        const downloadedData = await downloadAllFilesFromCloud(storage, settings.subpath ? settings.subpath : "");
        await saveCloudCache(downloadedData);
        setCloudData(downloadedData);
        setTeamOrder(Object.keys(downloadedData));
        setStatistics(calculateAverages(downloadedData));

        setLoadingVisible(false);
    }

    // Special case that's not worth making a TTButton or globalButtonStyle for
    const MatchKeyButton = (props) => {
        const topLabelStyle = {...globalTextStyles.secondaryText, color: CS.dark3, fontSize: 16*fU};
        const bottomLabelStyle = {...globalTextStyles.secondaryText, color: CS.dark1, fontSize: 24*fU, margin: -1*vh};

        return (
            <View style={{...globalContainerStyles.rowContainer, backgroundColor: CS.light1, marginVertical: 1.3*vh, marginHorizontal: 2.6*vh, borderRadius: 1*vw}} key={props.id}>
                <View>
                    <TTButton
                        text={props.teamNumber}
                        buttonStyle={{...globalButtonStyles.secondaryButton, width: 20*vw, paddingVertical: 2*vh, margin: 0, left: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0}}
                        textStyle={{...globalTextStyles.primaryText, fontSize: 24*fU}}
                         // Maybe include rankings ?
                        onPress={
                            () => {
                                navigation.navigate("TeamAnalytics", 
                                    {
                                        teamNumber: props.teamNumber, 
                                        teamStatistics: statistics[props.teamNumber],
                                        teamData: sortMatches(cloudData[props.teamNumber]),
                                    })
                            }
                        }
                    />
                </View>
                <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingHorizontal: 2*vw}}>
                    <View>
                        <Text style={topLabelStyle}>Auto</Text>
                        <Text style={bottomLabelStyle}>
                            {statistics[props.teamNumber]?.auto}
                        </Text>
                    </View>
                    <View>
                        <Text style={topLabelStyle}>Teleop</Text>
                        <Text style={bottomLabelStyle}>
                            {statistics[props.teamNumber]?.teleop}
                        </Text>
                    </View>
                    <View>
                        <Text style={topLabelStyle}>Misses</Text>
                        <Text style={bottomLabelStyle}>
                            {statistics[props.teamNumber]?.misses}
                        </Text>
                    </View>
                    <View>
                        <Text style={topLabelStyle}>Docking</Text>
                        <Text style={bottomLabelStyle}>
                            {statistics[props.teamNumber]?.docking}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    // No cloud connection
    if (getApps().length === 0) {
        return (
            <View style={globalContainerStyles.centerContainer}>
                <TTGradient/>
                <Text style={globalTextStyles.labelText}>You're not connected to Firebase!</Text>
                <TTButton
                    text="Go To Settings"
                    buttonStyle={{...globalButtonStyles.primaryButton, width: "70%", margin: 2 * vh}}
                    textStyle={{...globalTextStyles.primaryText, fontSize: 36*fU, marginTop: 0.5*vh}}
                    onPress={() => {navigation.navigate("Settings")}}
                />
            </View>
        );
    }

    // Everything else
    return (
        <View style={globalContainerStyles.topContainer}>
            <TTLoading
                state={loadingVisible}
                setState={setLoadingVisible}
                title={loadingContent[0]}
                mainText={loadingContent[1]}
                acceptText={loadingContent[2]}
            />
            
            <View style={{...globalContainerStyles.centerContainer, flex: 0, height: 20*vh, zIndex: 5}}>
                <TTGradient/>
                {/* <Text style={{...globalTextStyles.primaryText, fontSize: 16*fU}}>
                    Youre connected to {getApp().options.projectId}
                </Text> */}
                <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 1*vh, zIndex: 4}}>
                    <TTButton
                        text="⟳"
                        buttonStyle={{...globalButtonStyles.primaryButton, width: 7*vh, aspectRatio: 1, margin: 2*vh}}
                        textStyle={{color: CS.light1, fontSize: 32*fU, marginTop: (Platform.OS !== 'ios') ? -1.5*vh : 0 }}
                        onPress={downloadAndStoreCloudData}
                    />
                    <Text style={globalTextStyles.labelText}>Sort By...</Text>
                    <TTDropdown 
                        state={sortBy} 
                        setState={(value) => {
                            setSortBy(value);
                            const sortKey = sortableKeys[sortableValues.indexOf(value)];
                            const newTeamOrder = getSortedObjectOrder(cloudData, statistics, sortKey, reverseSort);
                            setTeamOrder(newTeamOrder);
                        }} 
                        items={sortableValues}
                        boxWidth={50*vw}
                        boxHeight={8.1*vh}
                        boxStyle={globalInputStyles.dropdownInput}
                        textStyle={globalTextStyles.labelText}
                        overrideStyle={{margin: 10, alignSelf: "center"}}
                        zIndex={5}
                    />
                </View>
                <TTSimpleCheckbox 
                    state={reverseSort}
                    setState={(value) => {
                        setReverseSort(value);
                        const sortKey = sortableKeys[sortableValues.indexOf(sortBy)];
                        const newTeamOrder = getSortedObjectOrder(cloudData, statistics, sortKey, value);
                        setTeamOrder(newTeamOrder);
                    }}
                    text="Reverse Order?" 
                    overallStyle={{alignSelf: "center"}}
                    textStyle={{...globalTextStyles.labelText, fontSize: 14*fU}}
                    boxUncheckedStyle={{...globalButtonStyles.checkboxUncheckedStyle}}
                    boxCheckedStyle={{...globalButtonStyles.checkboxCheckedStyle}}
                />
            </View>
            <View style={globalContainerStyles.centerContainer}>
                <TTGradient/>
                <ScrollView style={{paddingTop: 1.3*vh}}>
                    {teamOrder.map((item, index) => {
                        return <MatchKeyButton key={index} id={index} teamNumber={item}/>;
                    })}
                    <View style={{padding: 2*vh}}/>
                </ScrollView>
            </View>
        </View>
    );
}

// Exports
export default CloudData;