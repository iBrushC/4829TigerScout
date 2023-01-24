// Library imports
import LZString from "lz-string";
import { initializeApp, getApp, getApps, deleteApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getBytes, listAll } from "firebase/storage";

// Component imports
import { loadSettings } from './LocalStorage';

// Initialize from settings
const initializeFirebaseFromSettings = async () => {
    const settings = await loadSettings();
    if (settings?.cloudConfig) {
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
    }
    return null;
}

// Uploads a string to the cloud
const uploadStringToCloud = async (storage, stringData, filepath) => {
    // Because of the weird way Firebase stores strings, it is normally much more
    // efficient to upload the default string, uncompressed, than it is to compress
    // it first and then upload it.
    const compressedData = LZString.compress(stringData);
    const blobUpload = new Blob([compressedData], {type: "text/plain"});
    const storageRef = ref(storage, filepath);
    try {
        await uploadBytes(storageRef, blobUpload);
        return true;
    } catch (e) {
        console.error(`Error Uploading File: ${e}`);
        return null;
    }
};

// Reads a string from the cloud
const readStringFromCloud = async (storage, filepath) => {
    const storageRef = ref(storage, filepath);
    try {
        const bytes = await getBytes(storageRef);
        const byteData = new Uint8Array(bytes);
        const compressedData = String.fromCharCode(...byteData);
        const stringData = LZString.decompress(compressedData);
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

export { initializeFirebaseFromSettings, uploadStringToCloud, readStringFromCloud, getAllFilesFromCloud };