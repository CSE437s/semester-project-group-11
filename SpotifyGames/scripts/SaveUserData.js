
import { doc, getDoc, updateDoc, getFirestore, where } from 'firebase/firestore';
import { app } from "./firebaseConfig.js";
import { getAuth } from 'firebase/auth';

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateExpirationTime, getRefreshTokenData } from './SpotifyApiRequests.js';

export async function saveSpotifyTokenInfo(spotifyInfo, spotifyTokenExpiration) {

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

        if (Platform.OS === "web") {
            localStorage.setItem("spotifyInfo", spotifyInfo);
            localStorage.setItem("spotifyTokenExpiration", spotifyTokenExpiration);

            console.log("testing if set in localStorage", localStorage.getItem("spotifyInfo"));
        }
        else {
            await AsyncStorage.setItem("spotifyInfo", spotifyInfo);
            await AsyncStorage.setItem("spotifyTokenExpiration", spotifyTokenExpiration);
            const testGet = await AsyncStorage.getItem("spotifyInfo");
            console.log("testing if set in ASYNCStorage", testGet);
        }

        return updateDoc(userRef, { "spotifyInfo": spotifyInfo, "spotifyTokenExpiration": spotifyTokenExpiration }).then(() => {
            console.log("worked");
            return "success";
        }).catch((error) => {
            throw error;
        })

    }
    else {
        return Error("User is not signed in, not authorized to save spotify data")
    }
}

export async function saveScoreForGame(game, score){
    const auth = getAuth();
    const user = auth.currentUser;

    console.log(auth);

    if (user) {
        console.log("trying to store");
        const db = getFirestore(app);
        console.log("firestore?");
        const userRef = doc(db, "users", user.uid);

        const userInfo = await getDoc(userRef);
        if (!userInfo.exists()){
            console.log("Uh oh, no such user with uid:", user.uid + " (there should be though)");
            return;
        }

        const data = userInfo.data();

        console.log(data);

        // console.log(user.uid);
        // console.log(spotifyInfo, spotifyTokenExpiration);

        const scoreMap = new Map(Obect.entries(data.scores))

        const gameScoreField = game;

        let currHighScore = scoreMap[gameScoreField] instanceof int ? scoreMap[gameScoreField] : 0;

        scoreMap [gameScoreField] = Math.max(currHighScore, score);

        console.log("old was",currHighScore,"new is",newScores[gameScoreField]);

        return updateDoc(userRef, {"scores" : Object.fromEntries(newScores) }).then(() => {
            console.log("worked");
            return "success";
        }).catch((error) => {
            throw error;
        })

    }
    else {
        return Error("User is not signed in, not authorized to save spotify data")
    }
}

export async function getUserDataFromFirestore() {

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {

        const db = getFirestore(app);
        const userRef = doc(db, "users", user.uid);
        const userInfo = await getDoc(userRef);

        if (userInfo.exists()) {
            console.log("THE DICTIONARY RETURNED IS BROKEN RN, BUT HERES THE RAW DATA WE GOT", userInfo.data())
            return(userInfo.data());
        }
        else {
            console.log("Uh oh, no such user with uid:", user.uid + " (there should be though)");
        }

    }
    else {
        return Error("User is not signed in, not authorized to retrieve spotify data")
    }
}

export async function getDataFromStorage(key) {
    try {
        let value;
        if (Platform.OS === "web") {
            value = localStorage.getItem(key);
        }
        else {
            value = await AsyncStorage.getItem(key);
        }
        return value;
    }
    catch (error) {
        console.log("From SaveUserData.js, getDataFromStorage called with", key);
        console.log(error);
    } 
}

export function parseTokenFromInfo(info) {
    const json = JSON.parse(info);
    return json.access_token;
}

export function parseRefreshTokenFromInfo(info) {
    const json = JSON.parse(info);
    return json.refresh_token;
}

export async function getOrRefreshTokenFromFirebase(){
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {

        const db = getFirestore(app);
        const userRef = doc(db, "users", user.uid);
        const userInfo = await getDoc(userRef);

        if (userInfo.exists()) {
            const data = userInfo.data();
            const expirationTime = parseInt(data.spotifyTokenExpiration);
            console.log("comparing",expirationTime, Date.now(), "which is",(expirationTime<Date.now()));
            if (expirationTime < Date.now()){
                // if the token is expired
                const refreshToken = JSON.parse(data.spotifyInfo).refresh_token;
                const refreshedInfo = await getRefreshTokenData(refreshToken);
                await saveSpotifyTokenInfo(refreshedInfo);
                saveToCrossPlatformStorage("spotifyInfo", refreshedInfo);
                saveToCrossPlatformStorage("spotifyTokenExpiration", String(calculateExpirationTime(refreshedInfo.expires_in)));
                return parseTokenFromInfo(refreshedInfo);
            }
            else {
                saveToCrossPlatformStorage("spotifyInfo", data.spotifyInfo);
                saveToCrossPlatformStorage("spotifyTokenExpiration", data.spotifyTokenExpiration);
                return parseTokenFromInfo(data.spotifyInfo);
            }
            
        }
        else {
            console.log("Uh oh, no such user with uid:", user.uid + " (there should be though)");
        }

    }
    else {
        return Error("User is not signed in, not authorized to retrieve spotify data")
    }
}

export async function getFromCrossPlatformStorage(key){
    if (Platform.OS === "web") {
        return localStorage.getItem(key);
    } else {
        return await AsyncStorage.getItem(key);
    }
}

export async function saveToCrossPlatformStorage(key, value){
    if (Platform.OS === "web") {
        localStorage.setItem(key, value);
    } else {
        await AsyncStorage.setItem(key, value);
    }
}