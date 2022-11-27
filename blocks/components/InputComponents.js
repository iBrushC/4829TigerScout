import * as React from 'react';
import { StyleSheet, Animated, Easing, View, Text, TextInput, Pressable } from 'react-native';

import { TTButton } from './ButtonComponents';

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
    const [isActive, setIsActive] = React.useState(false);

    // Function to change when a box is pressed
    const setDropdown = (newState) => {
        setIsActive(!isActive);
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
    ]

    // Components for the dropdown
    const itemComponents = [];
    if (props.state != null) {
        itemComponents.push(
            <TTButton 
                key={0} 
                text={props.state} 
                buttonStyle={boxStyle} 
                onPress={() => setDropdown(props.state)}
                iconComponent={props.iconComponent}
            />
        );
    }

    if (props.items != null) {
        props.items.forEach((item, index) => {
            itemComponents.push(
                <TTButton
                    key={5 + index} 
                    text={item} 
                    buttonStyle={boxStyle}
                    onPress={() => setDropdown(item)}
                />
            )
        });
    }

    return (
        <View style={{width: props.boxWidth, height: props.boxHeight, zIndex: 5, alignItems: "center"}}>
            {isActive ? itemComponents : itemComponents[0]}
        </View>
    );
};

// Exports
export { TTTextInput, TTNumberInput, TTDropdown };