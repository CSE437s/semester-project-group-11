import { initializeApp } from "firebase/app";
import { app } from "./firebaseConfig.js"
import { User, userConverter } from "./UserModel.js";
import axios from 'axios';

export async function validateUniqueUsername(username){
    const endpointURL = process.env.EXPO_PUBLIC_SERVER_URL + "/user/username/validate";

    try{
        const res = await axios.post(endpointURL, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: { username: username }
        });
        return res;
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

export async function addUser(uid, username, email) {
    const endpointURL = process.env.EXPO_PUBLIC_SERVER_URL + "/user/add";
    try {
        const res = await axios.post(endpointURL, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: { uid: uid, email: email, username: username }
        });
        return res;
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

export async function deleteUser(id) {
    const endpointURL = process.env.EXPO_PUBLIC_SERVER_URL + "/user/delete";
    try {
        const res = await axios.post(endpointURL, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: { id:id }
        });
        return res;
    }
    catch (error) {
        console.log(error);
        return error;
    }
}