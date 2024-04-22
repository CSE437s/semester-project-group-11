
import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { app } from "./firebaseConfig.js";
import { getAuth } from 'firebase/auth';

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateExpirationTime, getRefreshTokenData } from './SpotifyApiRequests.js';

export async function saveSpotifyTokenInfo(spotifyInfo, spotifyTokenExpiration) {

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        console.log("trying to store");
        const db = getFirestore(app);
        console.log("firestore?");
        const userRef = doc(db, "users", user.uid);

        await saveToCrossPlatformStorage("spotifyTokenExpiration", spotifyTokenExpiration);
        await saveToCrossPlatformStorage("spotifyInfo", spotifyInfo);

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



export async function getUserFirebaseInfo(){

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {

        const db = getFirestore(app);
        const userRef = doc(db, "users", user.uid);
        const userInfo = await getDoc(userRef);

        if (userInfo.exists()){
            const data = userInfo.data()
            console.log("Firebase data:",data)
            return data;
        }
        else{
            console.log("Uh oh, no such user with uid:",user.uid + " (there should be though)");
            return;
        }

    }
    else{
        return Error("User is not signed in, not authorized to retrieve spotify data")
    }

}

export function saveUserTopSongs(songs){

    const auth = getAuth();
    const user = auth.currentUser;

    console.log(auth);

    if (user) {
        const db = getFirestore(app);
        const userRef = doc(db, "users", user.uid);
        
        return updateDoc(userRef, { "topSongs": songs }).then(() => {
            console.log("saved top songs");
            return "success";
        }).catch((error) => {
            throw error;
        })

    }
    else{
        return Error("User is not signed in, not authorized to save spotify data")
    }

}

export function parseTokenFromInfo(info){
    // console.log("PARSE TOKEN INFO ", info);
    if (!info){
        throw Error ("info is undefined in parseTokenInfo");
    }
    else if (typeof info === "object"){
        return info.access_token;
    }
    const json = JSON.parse(info);
    return json.access_token;
}

export function parseRefreshTokenFromInfo(info) {
    // console.log("PARSE REFRESH TOKEN INFO ", info, typeof info);

    if (!info){
        throw Error ("info is undefined in parseRefreshInfo");
    }
    else if (typeof info === "object"){
        // console.log("PARSE REFRESH TOKEN INFO ", info.refresh_token);

        return info.refresh_token;
    }
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
            // console.log("USER INFO SPOTIFY INFO", data.spotifyInfo, typeof(data.spotifyInfo));
            const expirationTime = parseInt(data.spotifyTokenExpiration);
            console.log(expirationTime<Date.now() ? "token is expired..." : "fetching token from firebase...");
            // console.log("DATA FROM FIREBASE TO TRY TO PARSE:", data);
            if (expirationTime < Date.now()){
                // if the token is expired
                console.log("attempting to refresh token from firebase refresh token");
                const parsedSpotifyInfo = typeof(data.spotifyInfo) === "string" ? JSON.parse(data.spotifyInfo) : data.spotifyInfo;
                // console.log("PARSED SPOITYF INFO", parsedSpotifyInfo, typeof(parsedSpotifyInfo));
                // const refreshToken = parsedSpotifyInfo.refresh_token;
                const refreshToken = parseRefreshTokenFromInfo(parsedSpotifyInfo);
                if (!refreshToken){
                    console.log("user must sign in again");
                    return;
                }
                let refreshedInfo = await getRefreshTokenData(refreshToken);
                // console.log('REFRESHED INFORMATION????????', refreshedInfo);

                // SPOTIFY FUCK YOU FOR NOT KEEPING THE REFRESH TOKEN IN THE RESPONSE
                // Me when I literally lie on the documentation about what is going to be returned in the response
                refreshedInfo.refresh_token = refreshToken;

                const refreshTokenExpirationTime = calculateExpirationTime(refreshedInfo.expires_in);
                await saveSpotifyTokenInfo(JSON.stringify(refreshedInfo), String(refreshTokenExpirationTime));
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
        const value = localStorage.getItem(key);
        // console.log("saving ", key, value);
        return value;
    } else {
        const value = await AsyncStorage.getItem(key);
        // console.log("saving ", key, value);
        return value;
    }
}

export async function saveToCrossPlatformStorage(key, value){

    // console.log("saving ", key, value);

    if ((typeof value) != "string"){
        throw Error (`value of ${typeof(value)} must be stringified before being stored in Platform Storage`);
    }
    
    if (Platform.OS === "web") {
        localStorage.setItem(key, value);
    } else {
        await AsyncStorage.setItem(key, value);
    }
}