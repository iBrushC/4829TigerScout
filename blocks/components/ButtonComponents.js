import * as React from 'react';
import { StyleSheet, Animated, Easing, View, Text, Pressable } from 'react-native';

// Animation curves (using references because setState forces a re-render that erases static states)
const fadeIn = (animated) => {
    Animated.timing(animated.current, {
        toValue: 0.6,
        duration: 30,
        easing: Easing.ease,
        useNativeDriver: true,
    }).start();
};
const fadeOut = (animated) => {
    Animated.timing(animated.current, {
        toValue: 1,
        duration: 30,
        easing: Easing.ease,
        useNativeDriver: true,
    }).start();
};

/* All components are relatively common, so in order to avoid name clashes with other libraries the prefix "TT" (Titanium Tigers) is used */

// A button which runs a function when pressed
const TTButton = (props) => {
    // Animation
    const opacity = new Animated.Value(1);
    const opacityRef = React.useRef(opacity);

    // Component
    return (
        <Pressable onPressIn={() => fadeIn(opacityRef)} onPressOut={() => fadeOut(opacityRef)} onPress={props.onPress}>
            <Animated.View style={[{opacity: opacityRef.current}, props.buttonStyle]}>
                <Text style={props.textStyle}>{props.text}</Text>
            </Animated.View>
        </Pressable>
    );
}

// A button which flips its state when pressed, staying on or off
const TTPushButton = (props) => {
    // Animation
    const opacity = new Animated.Value(1);
    const opacityRef = React.useRef(opacity);

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
        <Pressable onPress={onPress} onPressIn={() => fadeIn(opacityRef)} onPressOut={() => fadeOut(opacityRef)}>
            <Animated.View style={[{opacity: opacityRef.current}, styleChange()]}>
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
        if ((props.state !== null) && (props.setState !== null)) {
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