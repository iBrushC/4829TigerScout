import * as React from 'react';
import { StyleSheet, Animated, Easing, View, Text, Pressable } from 'react-native';

// Reusable animation curve
const fadeTo = (animated, value, duration) => {
    Animated.timing(animated.current, {
        toValue: value,
        duration: duration ? duration : 60,
        easing: Easing.ease,
        useNativeDriver: false,
    }).start();
};

const fadeToCallback = (animated, value, callback, duration) => {
    Animated.timing(animated.current, {
        toValue: value,
        duration: duration ? duration : 60,
        easing: Easing.ease,
        useNativeDriver: false,
    }).start(callback);
};

/* All components are relatively common, so in order to avoid name clashes with other libraries the prefix "TT" (Titanium Tigers) is used */

// A button which runs a function when pressed
const TTButton = (props) => {
    // Animation
    const animated = new Animated.Value(1);
    const animatedRef = React.useRef(animated);

    const opacity = (animatedRef.current).interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1],
    });

    // Component
    return (
        <Pressable {...props} style={props.overrideStyle} onPressIn={() => fadeTo(animatedRef, 0)} onPressOut={() => fadeTo(animatedRef, 1)}>
            <Animated.View style={[{opacity: opacity}, props.buttonStyle]}>
                {props.iconComponent}
                <Text style={props.textStyle}>{props.text}</Text>
            </Animated.View>
        </Pressable>
    );
}

// A button which flips its state when pressed, staying on or off
const TTPushButton = (props) => {
    // Animation
    const animated = new Animated.Value(1);
    const animatedRef = React.useRef(animated);

    const opacity = (animatedRef.current).interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1],
    });

    // Support for multiple styles
    const styleChange = () => {
        if (props.state) {
            return props.buttonPushedStyle ? props.buttonPushedStyle : props?.buttonStyle;
        } else {
            return props?.buttonStyle;
        }
    }

    const onPress = () => {
        if (props.onPress) {
            props.onPress()
        }
        if ((props.state !== null) && (props.setState !== null)) {
            props.setState(!props.state);
        }
    }

    // Component
    return (
        <Pressable onPress={onPress} onPressIn={() => fadeTo(animatedRef, 0)} onPressOut={() => fadeTo(animatedRef, 1)}>
            <Animated.View style={[{opacity: opacity}, styleChange()]}>
                <Text style={props.textStyle}>{(props.pushText && props.state) ? props.pushText : props.text}</Text>
            </Animated.View>
        </Pressable>
    );
}

// A simple checkbox
const TTSimpleCheckbox = (props) => {
    const onPress = () => {
        if (props.onPress) {
            props.onPress()
        }
        if ((props.state != null) && (props.setState != null)) {
            props.setState(!props.state);
        }
    }

    const styleChange = () => {
        if (props.state) {
            return props.boxCheckedStyle ? props.boxCheckedStyle : props?.boxUncheckedStyle;
        } else {
            return props?.boxUncheckedStyle;
        }
    }

    return (
        <Pressable onPress={onPress} style={[props?.overallStyle, {flexDirection: "row", alignItems: 'center', justifyContent: "center"}]}>
            <View style={styleChange()}/>
            <Text style={props?.textStyle}>{props.text}</Text>
        </Pressable>
    );
}

// A checkbox with more complex styling options and the ability to have an actual check appear
const TTCheckbox = (props) => {

}

// Export
export { TTButton, TTPushButton, TTSimpleCheckbox, TTCheckbox }