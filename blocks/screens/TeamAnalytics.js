// Library Imports
import * as React from 'react';
import { getStorage } from 'firebase/storage';
import { getApp, getApps } from "firebase/app";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Component Imports
import { vh, vw } from '../../common/Constants';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalContainerStyles } from '../../common/GlobalStyleSheet';
import { TTButton, TTSimpleCheckbox } from '../components/ButtonComponents';
import { ColorScheme as CS } from '../../common/ColorScheme';
import { TTGradient } from '../components/ExtraComponents';
import { matchTypeValues, teamColorValues } from './ScoutTeam';
import { TTDropdown } from '../components/InputComponents';

const chartableValues = ["Auto Points", "Teleop Points", "High Cargo", "Mid Cargo", "Low Cargo", "Misses", "Docking"];

const TeamAnalytics = ({route, navigation}) => {

    // States
    const [chartValue, setChartValue] = React.useState("Teleop Points");
    const [chartData, setChartData] = React.useState([]);
    const [chartLabels, setChartLabels] = React.useState([]);

    const checkEmptyComments = () => {
        for (const match of route.params.teamData) {
            if (match[17].length !== 0) return false;
        }
        return true;
    }

    const checkForDNP = () => {
        for (const match of route.params.teamData) {
            const comment = match[17].toLowerCase();
            if (
                comment.includes("dnp") || 
                comment.includes("don't pick") || 
                comment.includes("dont pick") || 
                comment.includes("do not pick")
            ) return true;
        }
        return false;
    }

    // Should be a better way to do this
    const getSpecificData = (section) => {
        switch (section) {
            case ("Auto Points"): {
                const points = route.params.teamData.map((item) => {
                    return 6*Number(item[7]) + 4*Number(item[8])+ 3*Number(item[9]);
                });
                return points;
            } break;
            case ("Teleop Points"): {
                const points = route.params.teamData.map((item) => {
                    return 5*Number(item[11]) + 3*Number(item[12]) + 2*Number(item[13]);
                });
                return points;
            } break;
            case ("High Cargo"): {
                const count = route.params.teamData.map((item) => {
                    return Number(item[7]) + Number(item[11]);
                });
                return count;
            } break;
            case ("Mid Cargo"): {
                const count = route.params.teamData.map((item) => {
                    return Number(item[8]) + Number(item[12]);
                });
                return count;
            } break;
            case ("Low Cargo"): {
                const count = route.params.teamData.map((item) => {
                    return Number(item[9]) + Number(item[13]);
                });
                return count;
            } break;
            case ("Misses"): {
                const count = route.params.teamData.map((item) => {
                    return Number(item[10]) + Number(item[14]);
                });
                return count;
            } break;
            case ("Docking"): {
                const count = route.params.teamData.map((item) => {
                    return 8*Number(item[5]) + 4*Number(item[6]) + 6*Number(item[15]) + 4*Number(item[16]);
                });
                return count;
            } break;
        }
    }

    React.useEffect(() => {
        const matchAbreviations = route.params.teamData.map((item) => {
            return `${matchTypeValues[item[2]][0]}${item[1]}`;
        });
        setChartLabels(matchAbreviations);
        setChartData(getSpecificData("Teleop Points"));
    }, [])

    // Individual match data component
    const MatchDataBox = (props) => {
        return (
            <View key={props.id} style={styles.matchDataContainer}>
                <Text style={{...globalTextStyles.secondaryText, fontSize: 24, color: CS.dark1}}>
                    {matchTypeValues[props.matchData[2]]} {props.matchData[1]}  —  {teamColorValues[props.matchData[3]]}
                </Text>

                {/* Auto subcontainer */}
                <View style={styles.matchDataSubcontainer}>
                    <Text style={{...globalTextStyles.secondaryText, fontSize: 20, color: CS.dark1}}>
                        Auto
                    </Text>

                    <Text style={styles.dataLabel}><Text style={styles.dataText}>{props.matchData[4] == 1 ? "Did" : "Did not"}</Text> taxi</Text>
                    <View style={styles.rowAlignContainer}>
                        <Text style={styles.dataLabel}>High   <Text style={styles.dataText}>{props.matchData[7]}</Text></Text>
                        <Text style={styles.dataLabel}>Mid   <Text style={styles.dataText}>{props.matchData[8]}</Text></Text>
                    </View>
                    <View style={styles.rowAlignContainer}>
                        <Text style={styles.dataLabel}>Low   <Text style={styles.dataText}>{props.matchData[7]}</Text></Text>
                        <Text style={styles.dataLabel}>Misses   <Text style={styles.dataText}>{props.matchData[8]}</Text></Text>
                    </View>
                    <View style={styles.rowAlignContainer}>
                        <Text style={styles.dataLabel}><Text style={styles.dataText}>{props.matchData[5] == 1 ? "Did" : "Did not"}</Text> dock</Text>
                        <Text style={styles.dataLabel}><Text style={styles.dataText}>{props.matchData[6] == 1 ? "Did" : "Did not"}</Text> engage</Text>
                    </View>
                </View>

                {/* Teleop Subcontainer */}
                <View style={styles.matchDataSubcontainer}>
                    <Text style={{...globalTextStyles.secondaryText, fontSize: 20, color: CS.dark1}}>
                        Teleop
                    </Text>

                    <View style={styles.rowAlignContainer}>
                        <Text style={styles.dataLabel}>High   <Text style={styles.dataText}>{props.matchData[11]}</Text></Text>
                        <Text style={styles.dataLabel}>Mid   <Text style={styles.dataText}>{props.matchData[12]}</Text></Text>
                    </View>
                    <View style={styles.rowAlignContainer}>
                        <Text style={styles.dataLabel}>Low   <Text style={styles.dataText}>{props.matchData[13]}</Text></Text>
                        <Text style={styles.dataLabel}>Misses   <Text style={styles.dataText}>{props.matchData[14]}</Text></Text>
                    </View>
                    <View style={styles.rowAlignContainer}>
                        <Text style={styles.dataLabel}><Text style={styles.dataText}>{props.matchData[15] == 1 ? "Did" : "Did not"}</Text> dock</Text>
                        <Text style={styles.dataLabel}><Text style={styles.dataText}>{props.matchData[16] == 1 ? "Did" : "Did not"}</Text> engage</Text>
                    </View>
                </View>

                {/* Comment Subcontainer */}
                <View style={styles.matchDataSubcontainer}>
                    <Text style={{...globalTextStyles.secondaryText, fontSize: 20, color: CS.dark1}}>
                        Comment
                    </Text>
                    <View style={styles.rowAlignContainer}>
                        <Text style={styles.dataLabel}>"{props.matchData[17]}"</Text>
                    </View>
                </View>

            </View>
        );
    }

    const PerformanceChart = (data, labels) => {

            if (chartLabels.length === 0 || chartData.length === 0) return;

            // Centering this is a remarkable pain
            return (
                <View style={{alignItems: "center", justifyContent: "center", marginTop: 4*vh, marginRight: 4*vw}}>
                    <LineChart
                        data={{
                            labels: chartLabels,
                            datasets: [{
                                data: chartData
                            }],
                        }}
                        width={90*vw}
                        height={70*vw}
                        yAxisInterval={1}
                        segments={Math.min(Math.max(...chartData), 9)}
                        fromZero={true}
                        withOuterLines={false}
                        chartConfig={{
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientToOpacity: 0,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            decimalPlaces: 0,
                            propsForDots: {
                                r: 1*vh,
                                strokeWidth: 0,
                            }
                        }}
                        style={{
                        }}
                    />
                </View>
        );
    }

    return (
        <View style={globalContainerStyles.centerContainer}>
            <TTGradient/>

            { checkForDNP() && (
                <View style={styles.warningTopBar}>
                    <Text style={{fontFamily: "LGC Light", color: CS.light2, fontSize: 16, textAlign: "center"}}>
                        A commenter has flagged this team as a <Text style={{fontFamily: "LGC Bold"}}>do not pick</Text> team!
                    </Text>
                </View>
            )}

            <ScrollView>
                {/* General Team Overview */}
                <View style={styles.sectionStyle}>
                    <TTGradient/>
                    <View style={{margin: 1*vh}}/>

                    <Text style={styles.sectionTitle}>
                        Team {route.params.teamNumber} Overview
                    </Text>

                    <View style={{...styles.rowAlignContainer, paddingHorizontal: 3*vw}}>
                        <View style={{...styles.columnContainer, alignItems: "center"}}>
                            <Text style={styles.statHeader}>Played</Text>
                            <Text style={globalTextStyles.secondaryText}>{route.params.teamData.length}</Text>
                        </View>
                        <View style={{...styles.columnContainer, alignItems: "center"}}>
                            <Text style={styles.statHeader}>Auto Avg</Text>
                            <Text style={globalTextStyles.secondaryText}>{route.params.teamStatistics.auto}</Text>
                        </View>
                        <View style={{...styles.columnContainer, alignItems: "center"}}>
                            <Text style={styles.statHeader}>Teleop Avg</Text>
                            <Text style={globalTextStyles.secondaryText}>{route.params.teamStatistics.teleop}</Text>
                        </View>
                        <View style={{...styles.columnContainer, alignItems: "center"}}>
                            <Text style={styles.statHeader}>Miss Avg</Text>
                            <Text style={globalTextStyles.secondaryText}>{route.params.teamStatistics.misses}</Text>
                        </View>
                        <View style={{...styles.columnContainer, alignItems: "center"}}>
                            <Text style={styles.statHeader}>Dock Avg</Text>
                            <Text style={globalTextStyles.secondaryText}>{route.params.teamStatistics.docking}</Text>
                        </View>
                    </View>
                    <View style={{margin: 2*vh}}/>
                </View>

                {/* Performace Over Time */}
                <View style={{...styles.sectionStyle, zIndex: 5}}>
                    <TTGradient/>
                    <View style={{margin: 1*vh}}/>

                    <Text style={styles.sectionTitle}>
                        Performance Chart
                    </Text>


                    {   route.params.teamData.length < 3 &&
                        <Text style={{fontFamily: "LGC Light", color: CS.light2, fontSize: 16, textAlign: "center", margin: 2*vh}}>
                            There isn't enough data on this team to make a chart
                        </Text>
                    }
                    {
                        route.params.teamData.length >= 3 &&
                        <View style={{flex: 1, flexDirection: "column", width: "100%", alignItems: "center"}}>
                            <View style={{margin: 1.5*vh}}/>
                            <View style={{...styles.rowAlignContainer, zIndex: 5}}>
                                <Text style={globalTextStyles.labelText}>View graph of...</Text>
                                <TTDropdown 
                                    state={chartValue} 
                                    setState={(value) => {
                                        setChartValue(value);
                                        setChartData(getSpecificData(value));
                                    }} 
                                    items={chartableValues}
                                    boxWidth={50*vw}
                                    boxHeight={6*vh}
                                    boxStyle={globalInputStyles.dropdownInput}
                                    textStyle={globalTextStyles.labelText}
                                    overrideStyle={{margin: 0, alignSelf: "center"}}
                                    zIndex={5}
                                />
                            </View>
                            <PerformanceChart/>
                        </View>
                    }
                    <View style={{margin: 1*vh}}/>

                </View>

                {/* Comments */}
                <View style={styles.sectionStyle}>
                    <TTGradient/>
                    <View style={{margin: 1*vh}}/>

                    <Text style={styles.sectionTitle}>
                        Comments
                    </Text>
                    {route.params.teamData.map((match, index) => {
                        const comment = match[17];
                        if (comment.length !== 0) return (
                            <View key={index}>
                                <Text style={{...globalTextStyles.labelText, margin: 0.5*vh}}>"{comment}"</Text>
                            </View>
                        );
                    })}
                    { checkEmptyComments() &&
                        <Text>Nobody has commented on this team yet.</Text>
                    }

                    <View style={{margin: 2*vh}}/>
                </View>

                {/* Individual match data */}
                <View style={styles.sectionStyle}>
                    <TTGradient/>
                    <View style={{margin: 1*vh}}/>

                    <Text style={styles.sectionTitle}>
                        Individual Matches
                    </Text>

                    {route.params.teamData.map((match, index) => {
                        return <MatchDataBox key={index} id={index} matchData={match}/>
                    })}

                    <View style={{margin: 2*vh}}/>
                </View>

            </ScrollView>
        </View>
    );
}

// Probably shouldn't be quite this localized
const styles = StyleSheet.create({
    sectionStyle: {
        ...globalContainerStyles.centerContainer, 
        alignItems: "center", 
        backgroundColor: `${CS.dark1}70`,
    },
    sectionTitle: {
        ...globalTextStyles.primaryText, 
        fontSize: 36
    },
    matchDataContainer: {
        ...globalContainerStyles.columnContainer,
        alignItems: "center",
        marginHorizontal: 2*vh,
        marginVertical: 1*vh,
        padding: 1*vh,

        backgroundColor: CS.light1,
        borderRadius: 1*vh,
    },
    matchDataSubcontainer: {
        ...globalContainerStyles.columnContainer,
        alignItems: "center",
        padding: 1*vh,
        margin: 1*vh,
        
        backgroundColor: `${CS.light3}9F`,
        borderRadius: 0.5*vh,
    },
    rowAlignContainer: {
        ...globalContainerStyles.rowContainer, 
        width: "100%", 
        justifyContent: "space-evenly"
    },
    dataText: {
        fontFamily: "LGC Bold",
        fontSize: 14,
    },
    dataLabel: {
        marginVertical: 0.4*vh,

        fontFamily: "LGC Light Italic", // For reasons I cannot explain, setting this to "LGC Light" adds a margin of about 130 to every item using it
        fontSize: 14,
    },
    statHeader: {
        ...globalTextStyles.secondaryText,
        marginTop: 2*vh,
        marginBottom: -1*vh,

        fontSize: 14,
        color: `${CS.light1}9F`
    },
    warningTopBar: {
        alignItems:"center",
        padding: 2*vh,
        zIndex: 10,

        backgroundColor: CS.accent3,
        shadowColor: CS.dark1,
        shadowRadius: 2*vh,
        shadowOpacity: 0.5,
    }
})

// Exports
export default TeamAnalytics;