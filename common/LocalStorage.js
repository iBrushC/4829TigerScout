/*
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
import LZString from 'lz-string';

// Constants
const settingsKey = "@settingsKey";

// Take a list of data and packs it into a string. Only works with lists numbers and strings
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
    for (let i = 0; i < data.length; i++) {
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

// Compresses data using LZString
const compressData = (stringData) => {
    return LZString.compressToUTF16(stringData);
}

// Decompresses data using LZString
const decompressData = (compressedData) => {
    return LZString.decompressFromUTF16(compressedData);
}

// Stores data at a key. Returns false if there there was an error, returns true otherwise.
const writeData = async (data, key) => {
    try {
        await AsyncStorage.setItem(key, data);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

// Reads data at a key. Returns false if there was an error, returns the data otherwise
const readData = async (key) => {
    try {
        const data = await AsyncStorage.getItem(key);
        if (data !== null) {
            return data;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

// Deletes a key. Returns false if there was an error, returns true otherwise
const deleteData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

// Deletes multiple keys. Returns false if there was an error, returns true otherwise
const deleteMultipleMatches = async (keys) => {
    for (const key of keys) {
        const result = await deleteData(key);
        if (!result) return result;
    }
    return true;
}

// Takes a list of values and saves it according to conventions. Returns false if there was an error, returns true otherwise
const saveMatchData = async (data) => {
    console.log(`Data In: ${data}`)
    const matchTypeValues = ["Practice", "Qualifiers", "Finals"]; // Probablu should be stored elsewhere

    const key = `@MD${data[0]}-${matchTypeValues[data[2]]}-${data[1]}`;
    const serializedData = serializeData(data);
    console.log(`Serialized Data: ${serializedData}`)
    const compressedData = compressData(serializedData);
    console.log(`Compressed Data: ${compressedData}`)

    return await writeData(compressedData, key);
};

// Reads the data stored at a key value. Returns false if there was an error, returns list of data otherwise.
const loadMatchData = async (key) => {
    const compressedData = await readData(key);
    if (compressData == false) {
        return false;
    } else {
        const decompressedData = decompressData(compressedData);
        const listData = deserializeData(decompressedData);
    
        return listData;
    }
};

// Exports
export { 
    settingsKey, 
    serializeData, 
    deserializeData, 
    compressData, 
    decompressData,
    saveMatchData,
    loadMatchData,
    deleteData,
    deleteMultipleMatches,
}