// Library imports
import LZString from "lz-string";
import { initializeApp, getApp, getApps, deleteApp } from "firebase/app";
import { ref, uploadBytes, listAll, getBlob } from "firebase/storage";
import { Promise } from "bluebird";

// Component imports
import { loadSettings, delimiter, deserializeData, compressData, decompressData } from './LocalStorage';
import { concurrency } from './Constants';

// Initialize from settings
const initializeFirebaseFromSettings = async () => {
    const settings = await loadSettings();
    if (settings?.cloudConfig !== undefined) {
        // If there isnt already an app, create one
        if (getApps().length === 0) {
            return initializeApp(settings.cloudConfig);
        }
        // If there is an app, reinitialize it if the settings have changed
        else if (JSON.stringify(getApp().options) != JSON.stringify(settings.cloudConfig)) {
            deleteApp(getApp());
            return initializeApp(settings.cloudConfig);
        }
        return getApp();
    } else {
        if (getApps().length !== 0) {
            deleteApp(getApp());
        }
    }
    return null;
}

// Uploads a string to the cloud
const uploadStringToCloud = async (storage, stringData, filepath) => {
    // Because of the weird way Firebase stores strings, it is normally much more
    // efficient to upload the default string, uncompressed, than it is to compress
    // it first and then upload it.
    // const compressedData = compressData(stringData);
    const blobUpload = new Blob([stringData], {type: "text/plain"});
    const storageRef = ref(storage, filepath);
    try {
        await uploadBytes(storageRef, blobUpload);
        return true;
    } catch (e) {
        console.error(`Error Uploading File: ${e}`);
        return null;
    }
};

// Uploads multiple strings to the cloud
const uploadMultipleStringsToCloud = async (storage, multiStringData, filepaths) => {
    try {
        // Batch upload them with a concurrency limit
        await Promise.map(multiStringData, 
            (stringData, i) => {
                const filepath = filepaths[i];
                return uploadStringToCloud(storage, stringData, filepath);
            },
            {concurrency: concurrency}
        );
    } catch(e) {
        console.error(`Error uploading multiple strings:\n${e}`);
        return null;
    }
}

// Reads a string from the cloud
const readStringFromCloud = async (storage, filepath) => {
    const storageRef = ref(storage, filepath);
    try {
        const blob = await getBlob(storageRef);
        const blobResponse = new Response(blob);
        const stringData = await blobResponse.text();
        return stringData;
    } catch (e) {
        console.error(`Error Downloading File: ${e}`);
        return null;
    }
};

// Gets all of the files from a specified subpath
const getAllFilesFromCloud = async (storage, subpath) => {
    const storageRef = ref(storage, subpath);
    const fileHandles = await listAll(storageRef);
    const fileData = fileHandles.items;
    const fileNames = fileData.map(x => x.fullPath)
    
    return fileNames;
}

// Downloads the data of all the files from the cloud
const downloadAllFilesFromCloud = async (storage, subpath) => {
    /*
    It is arranged in the following structure
    output = { teamNumber: [matchData1, matchData2] }
    */

    const fileContents = {};
    try {
        const filenames = await getAllFilesFromCloud(storage, subpath);
        
        // Wait for all promises at the same time
        const promiseData = await Promise.map(filenames, 
            (filename) => {
                return readStringFromCloud(storage, filename);
            },
            {concurrency: concurrency} // This might need to be messed with
        );
        
		// Need some way of sorting each match array based on match number so that graphs are easier
        for (const stringData of promiseData) {
            const data = deserializeData(stringData);
            const teamNumber = data[0];
            // If there's already something there, push the new data, otherwise create an array
            if (fileContents[teamNumber] == null) fileContents[teamNumber] = [data];
            else fileContents[teamNumber].push(data);
        }

    } catch (e) {
        console.error(`Error getting all files:\n${e}`);
        return null;
    }

    return fileContents;
}

export { 
    initializeFirebaseFromSettings, 
    uploadStringToCloud, 
    uploadMultipleStringsToCloud,
    readStringFromCloud, 
    getAllFilesFromCloud,
    downloadAllFilesFromCloud,
};