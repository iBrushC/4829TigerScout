import * as React from 'react';
import { StyleSheet, Animated, Easing, View, Text, TextInput, Pressable } from 'react-native';
import { vh } from '../../common/Constants';

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
            value={props?.state}
            onChangeText={props?.setState}
            textAlign="center"
            keyboardType="default"
        />
    );
};

const TTNumberInput = (props) => {
    const stateMin = props.stateMin ? props.stateMin : 0;
    const stateMax = props.stateMax ? props.stateMax : 255;

    const onChangeText = (value) => {
        // Allow for nothing values to allow for placeholder text to be visible
        if (value.length != 0) {
            if (props.state != null && props.setState != null) {
                const newValue = Math.min(Math.max(Number(value), stateMin), stateMax);
                props.setState(newValue.toString());
            }
        } else {
            props.setState("");
        }
    }
    return (
        <TextInput 
            {...props}
            value={props?.state}
            onChangeText={onChangeText}
            textAlign="center"
            keyboardType="numeric"
        />
    );
};

const TTCounterInput = (props) => {
    const stateMin = props.stateMin ? props.stateMin : 0;
    const stateMax = props.stateMax ? props.stateMax : 255;

    const onPress = (incriment) => {
        if (props.state != null && props.setState != null) {
            let newState = Number(props.state) + incriment;
            newState = Math.min(Math.max(newState, stateMin), stateMax); // Clamp between max and min
            props.setState(newState.toString());
        }
    }

    return (
        <View style={props.overallStyle}>
            <TTButton state={props.state} setState={props.setState} onPress={() => onPress(1)} {...props.topButtonProps}/>
            <TTNumberInput state={props.state} setState={props.setState} stateMin={props.stateMin} stateMax={props.stateMax} {...props.inputProps}/>
            <TTButton state={props.state} setState={props.setState} onPress={() => onPress(-1)} {...props.bottomButtonProps}/>
        </View>
    );
}

const TTDropdown = (props) => {
    // Animation
    const animated = new Animated.Value(0);
    const animatedRef = React.useRef(animated);

    const [isActive, setIsActive] = React.useState(false);

    // Function to change when a box is pressed
    const setDropdown = (newState) => {
        if (isActive) {
            fadeToCallback(animatedRef, 0, () => setIsActive(!isActive), 120);
            if (props.setState !== null) {
                props.setState(newState);
            }
        } else {
            setIsActive(!isActive);
            fadeTo(animatedRef, 1, 120);
        }
    }

    // Required style for the boxes
    // position 0: top closed, position 1: top open, position 2: middle, position 3: bottom
    const boxStyle = (position) => {
        let borderStyle = {};
        if (props.boxStyle.borderWidth > 0) {
            switch (position) {
                // Top closed
                case(0): {} break;

                // Top open
                case(1): {
                    borderStyle = {
                        borderBottomWidth: 0,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                    }
                } break;

                // Middle
                case(2): {
                    borderStyle = {
                        borderBottomWidth: 0,
                        borderTopWidth: 0,
                        borderRadius: 0
                    }
                } break;

                // Bottom
                case(3): {
                    borderStyle = {
                        borderTopWidth: 0,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                    }
                } break;
            }
        }
        return [
            {
                alignItems: "center", 
                justifyContent:"space-evenly",
                flexDirection: "row",
                width: props.boxWidth, 
                height: props.boxHeight,
                marginTop: -0.01*vh,
            },
            props.boxStyle,
            borderStyle,
        ]
    };

    // Components for the dropdown
    let topComponent = null;
    if (props.state != null) {
        topComponent = <TTButton 
            key={0} 
            text={props.state} 
            buttonStyle={boxStyle(isActive ? 1 : 0)} 
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
                    buttonStyle={boxStyle(index == props.items.length - 1 ? 3 : 2)}
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
export { TTTextInput, TTNumberInput, TTCounterInput, TTDropdown };