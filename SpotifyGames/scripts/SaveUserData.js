// import * as SecureStore from 'expo-secure-store';
// export async function save(key, value) {
//     await SecureStore.setItemAsync(key, value);
// }

// export async function getValueFor(key) {
//     let result = await SecureStore.getItemAsync(key);

//     return result;
// }

import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { app } from "./firebaseConfig.js";

export async function saveSpotifyTokenInfo (spotifyToken, spotifyTokenExpiration) {

    const auth = getAuth();

    const user = auth.currentUser;

    if (user) {
        const db = getFirestore(app);
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { spotifyToken: spotifyToken, spotifyTokenExpiration:spotifyTokenExpiration }, { merge: true });
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
            return {"spotifyToken": spotifyToken, "spotifyTokenExpiration": expirationTime};
        }
        else{
            console.log("Uh oh, no such user with uid:",user.uid + " (there should be though)");
        }

    }
    else{
        return Error("User is not signed in, not authorized to retrieve spotify data")
    }
}

