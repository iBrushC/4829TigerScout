import * as React from 'react';
import { StyleSheet, Animated, Easing, View, Text, TextInput, Pressable } from 'react-native';

import { TTButton } from './ButtonComponents';

// Reusable animation curve
const fadeTo = (animated, value, duration) => {
    Animated.timing(animated.current, {
        toValue: value,
        duration: duration ? duration : 60,
        easing: Easing.spring,
        useNativeDriver: false,
    }).start();
};

const fadeToCallback = (animated, value, callback, duration) => {
    Animated.timing(animated.current, {
        toValue: value,
        duration: duration ? duration : 60,
        easing: Easing.spring,
        useNativeDriver: false,
    }).start(callback);
};

const TTTextInput = (props) => {
    return (
        <TextInput 
            {...props}
            keyboardType="default"
        />
    );
};

const TTNumberInput = (props) => {
    return (
        <TextInput 
            {...props}
            keyboardType="numeric"
        />
    );
};

const TTDropdown = (props) => {
    // Animation
    const animated = new Animated.Value(0);
    const animatedRef = React.useRef(animated);

    const [isActive, setIsActive] = React.useState(false);

    // Function to change when a box is pressed
    const setDropdown = (newState) => {
        if (isActive) {
            fadeToCallback(animatedRef, 0, () => setIsActive(!isActive), 120);
        } else {
            setIsActive(!isActive);
            fadeTo(animatedRef, 1, 120);
        }
        if (props.setState != null) {
            props.setState(newState);
        }
    }

    // Required style for the boxes
    const boxStyle = [
        {
            alignItems: "center", 
            justifyContent:"space-evenly",
            flexDirection: "row",
            width: props.boxWidth, 
            height: props.boxHeight,
        },
        props.boxStyle
    ];

    // Components for the dropdown
    let topComponent = null;
    if (props.state != null) {
        topComponent = <TTButton 
            key={0} 
            text={props.state} 
            buttonStyle={boxStyle} 
            textStyle={props.textStyle}
            onPress={() => setDropdown(props.state)}
            iconComponent={props.iconComponent}
            />;
    }
        
    const itemComponents = [];
    if (props.items != null) {
        props.items.forEach((item, index) => {
            itemComponents.push(
                <TTButton
                    key={1 + index} 
                    text={item} 
                    buttonStyle={boxStyle}
                    textStyle={props.textStyle}
                    onPress={() => setDropdown(item)}
                />
            )
        });
    }

    // Mapping
    const opacity = (animatedRef.current).interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const scaleY = (animatedRef.current).interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    let itemScale = 0;
    if (props.items != null) {
        itemScale = (props.items.length * props.boxHeight) / 2;
    }

    return (
        <View style={[{width: props.boxWidth, height: props.boxHeight, zIndex: props.zIndex, alignItems: "center"}, props.overrideStyle]}>
            {topComponent}
            <Animated.View style={{opacity: opacity, transform: [{translateY: -itemScale}, {scaleY: scaleY}, {translateY: itemScale}]}}>
                {isActive && itemComponents}
            </Animated.View>
        </View>
    );
};

// Exports
export { TTTextInput, TTNumberInput, TTDropdown };