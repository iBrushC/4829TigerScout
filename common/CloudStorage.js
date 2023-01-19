import LZString from "lz-string";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getBytes } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: "dummy",
//     authDomain: "dummy",
//     projectId: "dummy",
//     storageBucket: "dummy",
//     messagingSenderId: "dummy",
//     appId: "dummy"
// };

// Globals are questionable but if they work they work.
const app = initializeApp(firebaseConfig);
const storage = getStorage();

// Uploads a string to the cloud
const uploadStringToCloud = async (stringData, filepath) => {
    // Because of the weird way Firebase stores strings, it is normally much more
    // efficient to upload the default string, uncompressed, than it is to compress
    // it first and then upload it.
    const blobUpload = new Blob([stringData], {type: "text/plain"});
    const storageRef = ref(storage, filepath);
    try {
        await uploadBytes(storageRef, blobUpload);
    } catch (e) {
        console.error(`Error Uploading File: ${e}`)
    }
};

// Reads a string from the cloud
const readStringFromCloud = async (filepath) => {
    const storageRef = ref(storage, filepath);
    try {
        const bytes = await getBytes(storageRef);
        const byteData = new Uint8Array(bytes);
        const stringData = String.fromCharCode(...byteData);
        return stringData;
    } catch (e) {
        console.error(`Error Downloading File: ${e}`);
        return null;
    }
};

export { app, uploadStringToCloud, readStringFromCloud };