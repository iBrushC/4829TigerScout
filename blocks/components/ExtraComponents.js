// Library Imports
import * as React from 'react';
import Modal from 'react-native-modal'
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Animated, Easing, View, Text, Pressable } from 'react-native';

// Component Imports
import { TTButton } from './ButtonComponents';
import { vh, vw } from '../../common/Constants';
import { CS } from '../../common/ColorScheme';
import { globalButtonStyles, globalInputStyles, globalTextStyles, globalConatinerStyles } from '../../common/GlobalStyleSheet';

const TTGradient = (props) => {
    return (
        <LinearGradient
            colors={[CS.gradient1, CS.gradient2]}
            style={[{...globalConatinerStyles.viewBackground}, {...props.style}]}
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

    return (
        <Modal isVisible={props.state != null ? props.state : false}>
            <View style={[{...globalConatinerStyles.popupContainer, backgroundColor: CS.light2}, props?.overrideViewStyle]}>
                <Text style={[{...globalTextStyles.primaryText, color: CS.dark2, alignSelf: "center"}, props?.overrideTitleStyle]}>
                    {alertTitle}
                </Text>
                <Text style={[{...globalTextStyles.labelText, color: CS.dark3, alignSelf: "center"}, props?.overrideMainTextStyle]}>
                    {alertText}
                </Text>
                <TTButton
                    text={acceptText}
                    buttonStyle={[{...globalButtonStyles.primaryButton, width: "90%", margin: 2 * vh}, props?.overrideButtonStyle]}
                    textStyle={[{...globalTextStyles.primaryText, fontSize: 24, margin: 1}, props?.overrideTitleStyle]}
                    onPress={setVisibility}
                />
            </View>
        </Modal>
    )
};

const TTWarning = (props) => {
    <Modal>
        <View style={{ flex: 1 }}>

        </View>
    </Modal>
};

const TTPoll = (props) => {
    <Modal>
        <View style={{ flex: 1 }}>

        </View>
    </Modal>
};

const TTConfirmation = (props) => {
    <Modal>
        <View style={{ flex: 1 }}>

        </View>
    </Modal>
};

export { TTGradient, TTAlert, TTWarning, TTPoll, TTConfirmation };