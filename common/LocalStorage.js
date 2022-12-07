/*

KEY MANAGEMENT
To keep track of local file storage, there is one master key which stores data containing the other sub-keys.
When local data is being viewed, the master key is referenced for the other stored data which is then read afterward
When a local data entry is deleted, not only is the key and data deleted, but so is the entry in the master key

DATA SERIALIZATION
Data should be stored as efficiently as possible (within reason, no use packing individual bits). JSON strings
should be avoided, because the labels often take up multitudes more space than the data they're pointing to. As
long as the data is serialized and deserialized with the same conventions there is no need for labels.

DATA CONVENTIONS
Each round should have a hash of some kind which is used for the name of a sub-key. For simplicities sake, it makes the
most sense to use the team number, round type, and round number. It could be packed bytes as seen above, or in a more
readable format like 4829-Q18

*/

// Library imports
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
const masterKey = "@masterKey";
const settingsKey = "@settingsKey";


// Take a list of data and packs it into a string. Only works with numbers and strings
// Example: [90, 4829] -> "90 4829"
const serializeData = (data) => {
    let output = "";
    for (item of data) {
        if (typeof item == 'string') {
            output += `"${item}" `;
        } else {
            output += `${item.toString()} `;
        }
    }

    return output;
};

// Reads a string of separated values into an array. Only outputs numbers and strings
// Example: "90 4829" -> [90, 4829]
const deserializeData = (data) => {
    let output = [];

    let lastIndex = 0;
    let isString = false;

    // Simple parser
    for (let i = 0; i < data.length - 1; i++) {
        const char = data.charAt(i);
        
        if (char == ' ' && !isString) {
            output.push(Number(data.slice(lastIndex, i)));
            lastIndex = i;
        }
        if (char == '"') {
            if (isString) {
                output.push(data.slice(lastIndex, i));
                i++;
                lastIndex = i;
            } else {
                lastIndex = i + 1;
            }

            isString = !isString;
        }
    }
    
    return output;
};

const writeData = async (data) => {

};

const readData = async (key) => {
    
};

// Exports
export { masterKey, settingsKey, serializeData, deserializeData }