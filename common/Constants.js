import { Dimensions } from 'react-native';

// Screen dimensions
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const vh = screenHeight / 100;
const vw = screenWidth / 100;

export { screenWidth, screenHeight, vh, vw }