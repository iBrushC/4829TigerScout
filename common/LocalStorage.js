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
const delimiter = String.fromCharCode(29);

// Take a list of data and packs it into a string. Only works with lists numbers and strings
// Example: [90, 4829] -> "90 4829"
const serializeData = (data) => {
    return data.join(delimiter);
};

// Reads a string of separated values into an array. Only outputs numbers and strings
// Example: "90 4829" -> [90, 4829]
const deserializeData = (data) => {    
    return data.split(delimiter);
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
    const matchTypeValues = ["Practice", "Qualifiers", "Finals"]; // Probably should be stored elsewhere

    const key = `@MD${data[0]}-${matchTypeValues[data[2]]}-${data[1]}`;
    const serializedData = serializeData(data);
    return await writeData(serializedData, key);
};

// Reads the data stored at a key value. Returns false if there was an error, returns list of data otherwise.
const loadMatchData = async (key) => {
    const data = await readData(key);
    if (compressData == false) {
        return false;
    } else {
        const listData = deserializeData(data);
        return listData;
    }
};

// Helper function to only keep match keys
const removeNonMatchKeys = (loadedKeys) => {
    const filtered = loadedKeys.filter((keyName) => {return keyName.slice(0, 3) == "@MD"});
    return filtered;
}

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
    removeNonMatchKeys,
}