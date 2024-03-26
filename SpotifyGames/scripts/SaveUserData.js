// import * as SecureStore from 'expo-secure-store';
// export async function save(key, value) {
//     await SecureStore.setItemAsync(key, value);
// }

// export async function getValueFor(key) {
//     let result = await SecureStore.getItemAsync(key);

//     return result;
// }

import { doc, getDoc, updateDoc, getFirestore, where } from 'firebase/firestore';
import { app } from "./firebaseConfig.js";
import { getAuth } from 'firebase/auth';

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveSpotifyTokenInfo (spotifyInfo, spotifyTokenExpiration) {

    const auth = getAuth();
    const user = auth.currentUser;

    console.log(auth);

    if (user) {
        console.log("trying to store");
        const db = getFirestore(app);
        console.log("firestore?");
        const userRef = doc(db, "users", user.uid);
        // console.log(user.uid);
        // console.log(spotifyInfo, spotifyTokenExpiration);

        if (Platform.OS === "web"){
            AsyncStorage.setItem("spotifyInfo", spotifyInfo);
            AsyncStorage.setItem("spotifyTokenExpiration", spotifyTokenExpiration);

            console.log("testing if set in AsyncStorage", AsyncStorage.getItem("spotifyInfo"));
        }
        else{

        }
        
        return updateDoc(userRef, { "spotifyInfo": spotifyInfo, "spotifyTokenExpiration": spotifyTokenExpiration }).then(() => {
            console.log("worked");
            return "success";
        }).catch((error) => {
            throw error;
        })

    }
    else{
        return Error("User is not signed in, not authorized to save spotify data")
    }

}

export async function getSpotifyTokenInfo() {

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {

        const db = getFirestore(app);
        const userRef = doc(db, "users", user.uid);
        const userInfo = await getDoc(userRef);

        if (userInfo.exists()){
            const data = userInfo.data();
            // console.log("THE DICTIONARY RETURNED IS BROKEN RN, BUT HERES THE RAW DATA WE GOT", data);
            return {"spotifyInfo": data.spotifyInfo, "spotifyTokenExpiration": data.spotifyTokenExpiration};
        }
        else{
            console.log("Uh oh, no such user with uid:", user.uid + " (there should be though)");
            console.log("might be a permissions issue");
        }

    }
    else{
        return Error("User is not signed in, not authorized to retrieve spotify data");
    }
}

export function parseTokenFromInfo(info){
    const json = JSON.parse(info);
    return json.access_token;
}

export function parseRefreshTokenFromInfo(info){
    const json = JSON.parse(info);
    return json.refresh_token;
}