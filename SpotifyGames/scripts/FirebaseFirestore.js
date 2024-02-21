import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, where, query, getDocs } from "firebase/firestore";
import { app } from "./firebaseConfig.js"
import { User, userConverter } from "./UserModel.js";
import axios from 'axios';

const db = getFirestore(app);

export async function addUser(username, email) {

    try {
        const ref = doc(db, "users", username).withConverter(userConverter);
        await setDoc(ref, new User(username, email))
        return true;
    } catch (e) {
        console.error("Error adding document: ", e);
        return false;
    }
}


export async function isUniqueUsername(username) {

    console.log("isUniqueUsername called")

    try {
        const res = await axios.post("http://localhost:3000/user/validate", {
            headers: {
                'Content-Type': 'application/json',

            },
            data: { username: username }
        })
        return JSON.parse(res.json).isUniqueUsername;
    }
    catch (error) {
        console.log(error);
    }
}