import * as React from 'react';
import { StyleSheet, Animated, Easing, View, Text, TextInput, Pressable } from 'react-native';

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
    return (
        <View style={{width: 155, height: 15, backgroundColor: "red", alignItems: "center"}}>
            <Text style={{position: 'absolute', top: 0}}>Hello There</Text>
            <Text style={{position: 'absolute', top: 15}}>Hello There</Text>
            <Text style={{position: 'absolute', top: 30}}>Hello There</Text>
            <Text style={{position: 'absolute', top: 45}}>Hello There</Text>
        </View>
    );
};

// Exports
export { TTTextInput, TTNumberInput, TTDropdown };