// Library Imports
import * as React from 'react';
import Modal from 'react-native-modal'
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Animated, Easing, View, Text, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native';

// Component Imports
import { TTButton } from './ButtonComponents';
import { vh, vw } from '../../common/Constants';
import { ColorScheme as CS } from '../../common/ColorScheme';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalContainerStyles } from '../../common/GlobalStyleSheet';
import { TTTextInput } from './InputComponents';

const TTGradient = (props) => {
    return (
        <LinearGradient
            colors={[CS.gradient1, CS.gradient2]}
            style={[{...globalContainerStyles.viewBackground}, {...props.style}]}
        />
    );
}

const TTAlert = (props) => {
    const alertTitle = props.title ? props.title : "Alert";
    const alertText = props.mainText ? props.mainText : "Something happened!";
    const acceptText = props.acceptText ? props.acceptText : "Ok";

    const setVisibility = () => {
        if (props.setState != null && props.state != null ) {
            props.setState(!props.state);
        }
    }

    const additionalTextStyle = {color: CS.dark2, alignSelf: "center", marginHorizontal: 1*vh};

    return (
        <Modal isVisible={props.state != null ? props.state : false}>
            <View style={[{...globalContainerStyles.popupContainer, backgroundColor: CS.light2}, props?.overrideViewStyle]}>
                <Text style={[{...globalTextStyles.primaryText, ...additionalTextStyle}, props?.overrideTitleStyle]}>
                    {alertTitle}
                </Text>
                <Text style={[{...globalTextStyles.labelText, ...additionalTextStyle}, props?.overrideMainTextStyle]}>
                    {alertText}
                </Text>
                <TTButton
                    text={acceptText}
                    buttonStyle={[{...globalButtonStyles.primaryButton}, props?.overrideButtonStyle]}
                    textStyle={[{...globalTextStyles.primaryText, fontSize: 24, margin: 1 * vh}, props?.overrideTitleStyle]}
                    onPress={setVisibility}
                />
            </View>
        </Modal>
    );
};

const TTWarning = (props) => {
    const warningTitle = props.title ? props.title : "Warning";
    const warningText = props.mainText ? props.mainText : "Something happened!";
    const acceptText = props.acceptText ? props.acceptText : "Ok";

    const setVisibility = () => {
        if (props.setState != null && props.state != null) {
            props.setState(!props.state);
        }
    }

    const additionalTextStyle = {color: CS.light1, alignSelf: "center", marginHorizontal: 1*vh};

    return (
        <Modal isVisible={props.state != null ? props.state : false}>
            <View style={[{...globalContainerStyles.popupContainer, backgroundColor: CS.accent3}, props?.overrideViewStyle]}>
                <Text style={[{...globalTextStyles.primaryText, ...additionalTextStyle}, props?.overrideTitleStyle]}>
                    {warningTitle}
                </Text>
                <Text style={[{...globalTextStyles.labelText, ...additionalTextStyle}, props?.overrideMainTextStyle]}>
                    {warningText}
                </Text>
                <TTButton
                    text={acceptText}
                    buttonStyle={[{...globalButtonStyles.primaryButton, backgroundColor: CS.light2, marginTop: 3*vh}, props?.overrideButtonStyle]}
                    textStyle={[{...globalTextStyles.primaryText, color: CS.dark1, fontSize: 24, margin: 1 * vh}, props?.overrideTitleStyle]}
                    onPress={setVisibility}
                />
            </View>
        </Modal>
    );
};

const TTPoll = (props) => {
    const alertTitle = props.title ? props.title : "Alert";
    const alertText = props.mainText ? props.mainText : "Something happened!";
    const acceptText = props.acceptText ? props.acceptText : "Ok";

    const setVisibility = () => {
        if (props.setState != null && props.state != null ) {
            props.setState(!props.state);
        }
    }

    const additionalTextStyle = {color: CS.dark2, alignSelf: "center", marginHorizontal: 1*vh};

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Modal isVisible={props.state != null ? props.state : false}>
            <View style={[{...globalContainerStyles.popupContainer, backgroundColor: CS.light2}, props?.overrideViewStyle]}>
                <Text style={[{...globalTextStyles.primaryText, ...additionalTextStyle}, props?.overrideTitleStyle]}>
                    {alertTitle}
                </Text>
                <Text style={[{...globalTextStyles.labelText, ...additionalTextStyle}, props?.overrideMainTextStyle]}>
                    {alertText}
                </Text>
                <TTTextInput
                    state={props?.textState}
                    setState={props?.setTextState}
                    placeholder={props?.placeholder}
                    placeholderTextColor={`${CS.light1}50`}
                    multiline={props?.multiline}
                    maxLength={props?.maxLength}
                    numberOfLines={props?.numberOfLines}
                    style={[
                        {...globalInputStyles.numberInput, borderWidth: 0, width: "90%"},
                        props?.overrideTextInputStyle
                    ]}
                />
                <TTButton
                    text={acceptText}
                    buttonStyle={[{...globalButtonStyles.primaryButton}, props?.overrideButtonStyle]}
                    textStyle={[{...globalTextStyles.primaryText, fontSize: 24, margin: 1 * vh}, props?.overrideTitleStyle]}
                    onPress={() => {
                        props.enterCallback?.();
                        setVisibility();
                    }}
                />
            </View>
        </Modal>
        </TouchableWithoutFeedback>
    );
};

const TTConfirmation = (props) => {
    const confirmationTitle = props.title ? props.title : "Are you sure?";
    const confirmationText = props.mainText ? props.mainText : "Make sure you want to do this risky action!";
    const acceptText = props.acceptText ? props.acceptText : "Yes";
    const rejectText = props.rejectText ? props.rejectText : "No";

    const setVisibility = () => {
        if (props.setState != null && props.state != null) {
            props.setState(!props.state);
        }
    }

    const additionalTextStyle = {color: CS.dark2, alignSelf: "center", marginHorizontal: 1*vh};

    return (
        <Modal isVisible={props.state != null ? props.state : false}>
            <View style={[{...globalContainerStyles.popupContainer, backgroundColor: CS.light2}, props?.overrideViewStyle]}>
                <Text style={[{...globalTextStyles.primaryText, ...additionalTextStyle}, props?.overrideTitleStyle]}>
                    {confirmationTitle}
                </Text>
                <Text style={[{...globalTextStyles.labelText, ...additionalTextStyle}, props?.overrideMainTextStyle]}>
                    {confirmationText}
                </Text>
                <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 2 * vh}}>
                    <TTButton
                        text={rejectText}
                        buttonStyle={[{...globalButtonStyles.primaryButton, margin: 0}, props?.overrideButtonStyle]}
                        textStyle={[{...globalTextStyles.primaryText, fontSize: 24, margin: 1 * vh}, props?.overrideTitleStyle]}
                        onPress={() => {
                            props.rejectCallback?.();
                            setVisibility();
                        }}
                    />
                    <TTButton
                        text={acceptText}
                        buttonStyle={[{...globalButtonStyles.primaryButton, margin: 0}, props?.overrideButtonStyle]}
                        textStyle={[{...globalTextStyles.primaryText, fontSize: 24, margin: 1 * vh}, props?.overrideTitleStyle]}
                        onPress={() => {
                            props.acceptCallback?.();
                            setVisibility();
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
};

// !! IMPL
const TTLoading = (props) => {
    const loadingTitle = props.title ? props.title : "Loading";
    const loadingText = props.mainText ? props.mainText : "Loading something";
    const acceptText = props.acceptText ? props.acceptText : "Hide";

    const additionalTextStyle = {color: CS.dark2, alignSelf: "center", marginHorizontal: 1*vh};

    const setVisibility = () => {
        if (props.setState != null && props.state != null) {
            props.setState(!props.state);
        }
    }

    const animated = new Animated.Value(0);
    const animatedRef = React.useRef(animated);

    const rotation = (animatedRef.current).interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    Animated.loop(
        Animated.timing(animatedRef.current, {
            toValue: 1,
            duration: 2000,
            easing: Easing.bounce,
            useNativeDriver: false,
            delay: 200
        })
    ).start();

    return (
        <Modal isVisible={props.state != null ? props.state : false}>
            <View style={[{...globalContainerStyles.popupContainer, backgroundColor: CS.light2}, props?.overrideViewStyle]}>
                <Text style={[{...globalTextStyles.primaryText, ...additionalTextStyle}, props?.overrideTitleStyle]}>
                    {loadingTitle}
                </Text>
                <Text style={[{...globalTextStyles.labelText, ...additionalTextStyle}, props?.overrideMainTextStyle]}>
                    {loadingText}
                </Text>
                {/* Spinning loading thing */}
                <Animated.View style={{...globalContainerStyles.loadingContainer, transform: [{rotate: rotation}]}}/>
                <TTButton
                    text={acceptText}
                    buttonStyle={[{...globalButtonStyles.primaryButton, backgroundColor: CS.light3}, props?.overrideButtonStyle]}
                    textStyle={[{...globalTextStyles.primaryText, color: CS.dark1, fontSize: 20}, props?.overrideTitleStyle]}
                    onPress={setVisibility}
                />
            </View>
        </Modal>
    );
}

export { TTGradient, TTAlert, TTWarning, TTPoll, TTConfirmation, TTLoading };